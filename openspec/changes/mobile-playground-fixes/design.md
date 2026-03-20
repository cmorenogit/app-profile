# Design: Mobile Playground Fixes

**Change:** `mobile-playground-fixes`
**Status:** Draft
**Depends on:** [proposal.md](./proposal.md)

---

## Architecture Decisions

### 1. Resampling Strategy: Linear Interpolation

**Decision:** Implement manual linear interpolation to resample from native device sample rate to 16kHz.

**Rationale:** `OfflineAudioContext` with a target rate below 44100Hz fails silently on Safari (iOS and macOS). Safari's AudioContext implementation clamps the minimum sample rate to 44100Hz, making `OfflineAudioContext`-based resampling unreliable for the 16kHz target Whisper requires.

**Alternatives considered:**

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| `OfflineAudioContext` resampling | Native, zero-copy | Fails <44100Hz on Safari; silent failure | Rejected |
| `AudioWorklet` with resampling | Modern API, off-thread | Complex setup, no ScriptProcessorNode parity on all targets | Out of scope (future) |
| Web Audio `playbackRate` trick | Browser-native | Lossy, unpredictable rate | Rejected |
| **Linear interpolation (manual)** | **Cross-browser, predictable, simple** | **Slight quality loss vs. sinc** | **Selected** |

Linear interpolation is sufficient for speech-frequency content. Whisper is robust to minor resampling artifacts in voice data. A sinc/polyphase filter would add complexity with negligible WER improvement for speech.

### 2. Pipeline Management: Shared `usePipelineManager` Hook

**Decision:** Create a single shared hook that manages the active pipeline lifecycle, ensuring only one model is loaded at a time.

**Rationale:** Currently each demo component (`WhisperDemo`, `ImageDemo`, etc.) manages its own `pipelineRef` independently. When users switch demos, the previous model stays in memory. On iOS Safari with 3-4GB total device memory, having two large models loaded simultaneously causes the browser to kill the tab silently (no OOM error thrown).

**Alternatives considered:**

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Per-demo dispose on unmount | Simple, local to each demo | Race condition if unmount/mount overlap; no cross-demo coordination | Rejected |
| Global singleton class | Full control | Hard to integrate with React lifecycle; testing difficulty | Rejected |
| **Shared hook via ref lifting** | **React-idiomatic, coordinates across demos, testable** | **Requires PlaygroundApp to hold the ref** | **Selected** |

The hook lives at `PlaygroundApp` level and is passed down. When a new demo requests a model, the hook first calls `dispose()` on the current pipeline, nullifies the ref, and then loads the new one.

### 3. Mobile Detection: Feature Detection Over UA Sniffing

**Decision:** Use a layered feature-detection approach combining `navigator.deviceMemory`, screen dimensions, and touch capability.

**Rationale:** UA sniffing is fragile (Chrome on iPad reports desktop UA, browsers randomize UA strings). Feature detection is forward-compatible and directly answers "can this device run this model?" rather than "is this device mobile?".

**Detection layers (in priority order):**

1. `navigator.deviceMemory` (Chrome/Edge only) — direct memory capacity signal
2. `screen.width * screen.height * devicePixelRatio` — screen area heuristic (correlates with device class)
3. `'ontouchstart' in window` + `navigator.maxTouchPoints > 0` — touch capability
4. `navigator.hardwareConcurrency` — CPU core count (correlates with device tier)

**Fallback when `deviceMemory` is unavailable (Safari, Firefox):** Assume 4GB for desktop-class screens (>1200px width), 3GB for tablet-class (768-1200px), 2GB for phone-class (<768px). These are conservative estimates.

### 4. Progress Tracking: Transformers.js `progress_callback`

**Decision:** Use the `progress_callback` option in `pipeline()` to capture download progress and propagate it through React state.

**Rationale:** Transformers.js v3.x supports `progress_callback` in the `pipeline()` options. The callback receives events with `{ status, file, progress, loaded, total }`. This gives real MB downloaded / total MB information without polling Cache API.

**Event flow:**
```
pipeline("task", "model", {
  progress_callback: (event) => {
    // event.status: "initiate" | "download" | "progress" | "done" | "ready"
    // event.progress: 0-100 (percentage)
    // event.loaded: bytes downloaded
    // event.total: total bytes
  }
})
```

State is lifted to `usePipelineManager` and exposed as `{ progress, loadedBytes, totalBytes, status }`.

### 5. Pre-recorded Fallback: Static Data File

**Decision:** Create `src/data/prerecorded-results.ts` with example inputs and outputs for each demo, displayed when a device cannot run the model.

**Rationale:** Some devices (low-memory iOS, older Android) physically cannot load models >200MB. Rather than showing an error, showing real example results preserves the "wow factor" of the portfolio while being honest ("These are pre-computed results — your device doesn't have enough memory to run this model live").

**Structure:**
```typescript
export const PRERECORDED_RESULTS: Record<DemoId, PrerecordedResult> = {
  whisper: {
    input: { type: "audio", label: "JFK inaugural speech clip", url: "..." },
    output: { text: "And so my fellow Americans, ask not..." },
    modelName: "whisper-tiny.en",
    modelSizeMB: 40,
  },
  summary: {
    input: { type: "text", value: "Artificial intelligence has transformed..." },
    output: { summary_text: "AI tools have transformed..." },
    modelName: "distilbart-cnn-6-6",
    modelSizeMB: 305,
  },
  // ... etc
};
```

### 6. Model Selection for Mobile: Conditional Model ID

**Decision:** Select quantized or smaller model variants based on device capability assessment.

**Model mapping:**

| Demo | Desktop Model | Mobile Model | Size Reduction |
|------|--------------|--------------|----------------|
| Whisper | `onnx-community/whisper-tiny.en` | Same (40MB, already small) | N/A |
| Sentiment | `Xenova/distilbert-base-uncased-finetuned-sst-2-english` | Same (67MB, already small) | N/A |
| Summary | `Xenova/distilbart-cnn-6-6` (~305MB) | `Xenova/distilbart-cnn-6-6` q4 quantized (~80MB) | ~74% |
| Image | `Xenova/vit-base-patch16-224` (~88MB) | `Xenova/mobilevit-small` or q4 ViT (~25MB) | ~72% |
| RAG | `Xenova/all-MiniLM-L6-v2` (~23MB) | Same (already small) | N/A |

**Selection logic:** If `deviceMemoryGB < 4` or estimated memory < 4GB, use mobile variant. If `deviceMemoryGB < 2`, use fallback only (pre-recorded results).

---

## Component Design

### New: `usePipelineManager` Hook

**File:** `src/components/playground/usePipelineManager.ts`

```typescript
interface ModelConfig {
  task: string;
  modelId: string;           // e.g., "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
  mobileModelId?: string;    // e.g., quantized variant
  modelSizeMB: number;       // for UI display and memory checks
  pipelineOptions?: Record<string, unknown>; // extra options per task
}

interface PipelineManagerState {
  pipeline: any | null;
  isLoading: boolean;
  progress: number;          // 0-100
  loadedBytes: number;
  totalBytes: number;
  status: "idle" | "downloading" | "initializing" | "ready" | "error" | "fallback";
  error: string | null;
}

interface PipelineManagerActions {
  loadModel: () => Promise<any>;
  dispose: () => Promise<void>;
}

type UsePipelineManagerReturn = PipelineManagerState & PipelineManagerActions;

function usePipelineManager(
  demoId: string,
  modelConfig: ModelConfig,
  deviceInfo: MobileDetectResult,
): UsePipelineManagerReturn;
```

**Behavior:**
1. On `loadModel()`: check if a different demo's pipeline is active via shared ref. If so, call `dispose()` on it first.
2. Evaluate `deviceInfo.canRunModel(modelConfig.modelSizeMB)`. If false, set `status: "fallback"` and return without loading.
3. Select `modelConfig.mobileModelId` if `deviceInfo.isMobile && mobileModelId` exists.
4. Call `pipeline(task, selectedModel, { device, progress_callback })`.
5. On progress events, update `progress`, `loadedBytes`, `totalBytes`.
6. On completion, store pipeline in shared ref, set `status: "ready"`.

**Shared ref pattern:** `PlaygroundApp` holds a `useRef<{ demoId: string; pipeline: any } | null>()` and passes it to each demo via prop or context. `usePipelineManager` reads/writes this ref.

### New: `useMobileDetect` Hook

**File:** `src/components/playground/useMobileDetect.ts`

```typescript
interface MobileDetectResult {
  isMobile: boolean;           // touch device with small screen
  isTablet: boolean;           // touch device with medium screen
  isIOS: boolean;              // iOS Safari (for AudioContext workarounds)
  isAndroid: boolean;          // Android Chrome
  deviceMemoryGB: number;      // detected or estimated
  hardwareConcurrency: number; // navigator.hardwareConcurrency
  canRunModel: (sizeMB: number) => boolean;  // based on memory thresholds
  shouldUseMobileModel: boolean; // true if deviceMemoryGB < 4
  recommendation: "full" | "mobile" | "fallback";
}

function useMobileDetect(): MobileDetectResult;
```

**Detection logic:**
```
deviceMemoryGB =
  navigator.deviceMemory                     // Chrome/Edge: direct value
  ?? (screenWidth > 1200 ? 4                 // Safari/Firefox desktop heuristic
    : screenWidth > 768 ? 3                  // tablet heuristic
    : 2)                                     // phone heuristic

canRunModel(sizeMB) =
  sizeMB < 50                                // always allow tiny models
  || (deviceMemoryGB >= 4)                   // 4GB+ can handle anything in scope
  || (deviceMemoryGB >= 2 && sizeMB < 200)   // 2-4GB can handle medium models

recommendation =
  deviceMemoryGB >= 4   → "full"
  deviceMemoryGB >= 2   → "mobile"           // use quantized variants
  deviceMemoryGB < 2    → "fallback"         // pre-recorded only
```

### Modified: `DemoShell`

**File:** `src/components/playground/DemoShell.tsx`

New props added to existing interface:

```typescript
interface DemoShellProps {
  // Existing
  title: string;
  howItWorks: string;
  modelName: string;
  children: ReactNode;
  isLoading: boolean;
  loadingText?: string;
  device?: "webgpu" | "wasm";

  // New
  progress?: number;               // 0-100, model download progress
  loadedBytes?: number;            // bytes downloaded so far
  totalBytes?: number;             // total bytes to download
  modelSizeMB?: number;            // displayed as badge on shell header
  isFallback?: boolean;            // true = show pre-recorded results banner
  fallbackReason?: string;         // "Device memory too low for this model"
}
```

**New UI elements:**
1. **Progress bar** (replaces spinner when `progress > 0`): Shows `"Downloading model... 12.3 / 40.0 MB"` with a filled bar.
2. **Model size badge**: Next to model name badge, shows `"~40 MB"` in monospace.
3. **Fallback banner**: When `isFallback === true`, renders a styled info box: "Showing pre-computed results. [reason]."

### Modified: `WhisperDemo`

**Key changes to internal flow:**

1. **AudioContext creation:** Remove `{ sampleRate: 16000 }` constraint. Let browser use native rate.
2. **iOS resume:** After creating AudioContext, explicitly call `audioContext.resume()` and await it.
3. **State change listener:** Add `audioContext.addEventListener("statechange", handler)` to detect `interrupted` state and auto-resume.
4. **Resampling:** After merging buffers, call `resampleLinear(merged, nativeSampleRate, 16000)` before passing to Whisper.
5. **Recording limit:** On mobile, auto-stop recording after 30 seconds with a countdown indicator.
6. **WAV playback:** Use `nativeSampleRate` for WAV blob creation (for faithful playback), use 16kHz resampled data for Whisper inference only.

```typescript
// Internal state additions
const nativeSampleRateRef = useRef<number>(48000);
const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const [recordingSeconds, setRecordingSeconds] = useState(0);
```

### Modified: `ImageDemo`

**Key changes:**

1. **Mobile input buttons:** When `isMobile`, replace drag-and-drop zone with two explicit buttons:
   - "Take Photo" — `<input capture="environment" accept="image/*" />`
   - "Choose from Gallery" — `<input accept="image/*" />` (no capture attribute)
2. **Model selection:** Use `usePipelineManager` with `mobileModelId: "Xenova/mobilevit-small"`.
3. Desktop retains existing drag-and-drop behavior unchanged.

### Modified: `PlaygroundApp`

**Key changes:**

1. **Pipeline ref holder:** Holds shared `activePipelineRef` passed to demos.
2. **Mobile detection:** Calls `useMobileDetect()` and passes result to demos.
3. **Storage persistence:** On mount, call `navigator.storage.persist()` (fire-and-forget).
4. **Model size badges:** Each demo card in the selector grid shows the model size (from a config map).
5. **Storage check:** On mount, call `navigator.storage.estimate()` and warn if available space < 500MB.

---

## Data Flow

### Flow 1: Audio Capture → Resample → Whisper Inference

```
User taps Record
  │
  ├─ navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } })
  │    (no sampleRate constraint — use native rate)
  │
  ├─ new AudioContext()  // no sampleRate option — native rate
  │    │
  │    ├─ audioContext.resume()  // required on iOS
  │    ├─ nativeSampleRateRef.current = audioContext.sampleRate  // e.g., 48000
  │    │
  │    ├─ addEventListener("statechange", () => {
  │    │     if (state === "interrupted") audioContext.resume()
  │    │   })
  │    │
  │    ├─ createMediaStreamSource(stream)
  │    ├─ createScriptProcessor(4096, 1, 1)
  │    │    └─ onaudioprocess → push Float32Array to audioBuffersRef
  │    └─ source.connect(processor).connect(destination)
  │
  ├─ [Mobile: start 30s countdown timer]
  │
User taps Stop (or timer fires)
  │
  ├─ Disconnect source/processor, stop stream tracks, close AudioContext
  ├─ Merge all Float32Array buffers → mergedAudio (at nativeSampleRate)
  │
  ├─ resampleLinear(mergedAudio, nativeSampleRate, 16000) → resampledAudio
  │    │
  │    │  Algorithm:
  │    │  ratio = sourceRate / targetRate  (e.g., 48000/16000 = 3.0)
  │    │  outputLength = floor(inputLength / ratio)
  │    │  for i in 0..outputLength:
  │    │    srcIndex = i * ratio
  │    │    lower = floor(srcIndex), upper = ceil(srcIndex)
  │    │    fraction = srcIndex - lower
  │    │    output[i] = input[lower] * (1 - fraction) + input[upper] * fraction
  │    │
  │    └─ Returns Float32Array at 16000Hz
  │
  ├─ float32ToWav(mergedAudio, nativeSampleRate) → WAV blob for playback
  │    (uses native rate so audio plays back at correct speed)
  │
  └─ pipe(resampledAudio) → { text: "..." }
       (Whisper receives 16kHz data as expected)
```

**iOS AudioContext State Machine:**
```
                    ┌──────────────┐
     new AudioContext()            │
                    ▼              │
              ┌──────────┐        │
              │ suspended │ ◄─────┘ (phone call, lock screen)
              └────┬─────┘
                   │ audioContext.resume()
                   ▼
              ┌──────────┐
              │ running   │ ◄──── normal operation
              └────┬─────┘
                   │ iOS interrupt (Siri, phone call, tab switch)
                   ▼
            ┌─────────────┐
            │ interrupted  │
            └──────┬──────┘
                   │ statechange listener → resume()
                   ▼
              ┌──────────┐
              │ running   │
              └──────────┘
```

### Flow 2: Demo Selection → Dispose → Capability Check → Load or Fallback

```
User clicks demo card (e.g., "Image Classification")
  │
  ├─ PlaygroundApp sets activeDemo = "image"
  │    └─ React unmounts previous demo, mounts ImageDemo
  │
  ├─ ImageDemo calls usePipelineManager("image", imageModelConfig, deviceInfo)
  │
  └─ usePipelineManager.loadModel() triggered by user action (classify/analyze)
       │
       ├─ Check activePipelineRef.current
       │    ├─ If exists and demoId !== current:
       │    │    ├─ activePipelineRef.current.pipeline.dispose()
       │    │    ├─ activePipelineRef.current = null
       │    │    └─ (GC hint: pipeline ref is now null, large tensors eligible for collection)
       │    └─ If exists and demoId === current:
       │         └─ Return cached pipeline immediately
       │
       ├─ deviceInfo.canRunModel(modelConfig.modelSizeMB)?
       │    ├─ NO  → set status = "fallback", return null
       │    │         └─ DemoShell renders pre-recorded results
       │    └─ YES → continue
       │
       ├─ Select model ID:
       │    ├─ deviceInfo.shouldUseMobileModel && modelConfig.mobileModelId?
       │    │    └─ use mobileModelId
       │    └─ else → use modelConfig.modelId
       │
       ├─ pipeline(task, selectedModel, { device, progress_callback })
       │    │
       │    │  progress_callback events:
       │    │    "initiate"  → status = "downloading", totalBytes = event.total
       │    │    "progress"  → loadedBytes = event.loaded, progress = event.progress
       │    │    "done"      → status = "initializing"
       │    │    "ready"     → status = "ready"
       │    │
       │    └─ DemoShell displays progress bar during download
       │
       └─ Store in activePipelineRef: { demoId: "image", pipeline: pipe }
            └─ Return pipeline to caller
```

### Flow 3: Model Download → Cache API → Progress UI

```
pipeline() call with progress_callback
  │
  ├─ Transformers.js checks Cache API for model files
  │    ├─ Cache HIT (all files present):
  │    │    └─ "initiate" → "ready" (fast, ~1-2s, no download events)
  │    │
  │    └─ Cache MISS (first download or evicted):
  │         ├─ "initiate" { file: "model.onnx", total: 40_000_000 }
  │         ├─ "progress" { file: "model.onnx", loaded: 5_000_000, progress: 12.5 }
  │         ├─ "progress" { loaded: 20_000_000, progress: 50.0 }
  │         ├─ "progress" { loaded: 38_000_000, progress: 95.0 }
  │         ├─ "done" { file: "model.onnx" }
  │         │    └─ File written to Cache API automatically by Transformers.js
  │         └─ "ready" — pipeline instance created
  │
  ├─ usePipelineManager state updates on each event:
  │    progress: 50        →  DemoShell progress bar at 50%
  │    loadedBytes: 20MB   →  "Downloading model... 20.0 / 40.0 MB"
  │    totalBytes: 40MB
  │
  └─ navigator.storage.persist() (called once on PlaygroundApp mount)
       └─ Prevents browser from evicting cached models under storage pressure
```

---

## Key Technical Details

### Resample Function

```typescript
/**
 * Linear interpolation resampling from sourceRate to targetRate.
 * Used to convert native device audio (typically 48kHz) to 16kHz for Whisper.
 *
 * Why linear interpolation: OfflineAudioContext fails below 44100Hz on Safari.
 * Linear interp is sufficient for speech-frequency content (Whisper is robust).
 */
function resampleLinear(
  input: Float32Array,
  sourceRate: number,
  targetRate: number,
): Float32Array {
  if (sourceRate === targetRate) return input;

  const ratio = sourceRate / targetRate;
  const outputLength = Math.floor(input.length / ratio);
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i++) {
    const srcIndex = i * ratio;
    const lower = Math.floor(srcIndex);
    const upper = Math.min(lower + 1, input.length - 1);
    const fraction = srcIndex - lower;
    output[i] = input[lower] * (1 - fraction) + input[upper] * fraction;
  }

  return output;
}
```

**Performance:** For a 30s recording at 48kHz (1.44M samples), resampling produces 480K samples in <5ms on modern devices. No performance concern.

### AudioContext State Machine

```typescript
// Creation: no sampleRate constraint
const audioContext = new AudioContext();
// Native rate: 48000 (iOS), 44100 (some Android), 48000 (desktop)

// iOS requires explicit resume after user gesture
await audioContext.resume();

// Handle iOS interruptions (phone calls, Siri, lock screen)
audioContext.addEventListener("statechange", () => {
  if (audioContext.state === "interrupted" || audioContext.state === "suspended") {
    audioContext.resume().catch(() => {
      // Context permanently lost (e.g., hardware error)
      // Stop recording gracefully, process what we have
    });
  }
});
```

**Key behaviors:**
- iOS Safari creates AudioContext in `suspended` state until a user gesture triggers `resume()`.
- Incoming phone calls transition state to `interrupted`. The `statechange` event fires.
- After `resume()` from `interrupted`, recording continues seamlessly — `onaudioprocess` callbacks resume.
- If `resume()` fails (device hardware issue), gracefully stop recording and process available buffers.

### Pipeline Dispose Pattern

```typescript
async function disposePipeline(ref: MutableRefObject<ActivePipeline | null>): Promise<void> {
  if (!ref.current) return;

  const { pipeline, demoId } = ref.current;

  try {
    // Transformers.js Pipeline.dispose() releases ONNX session and tensors
    await pipeline.dispose();
  } catch (e) {
    console.warn(`Failed to dispose pipeline for ${demoId}:`, e);
  }

  // Null the ref so GC can collect the model weights
  ref.current = null;

  // Optional: hint GC on memory-constrained devices
  // Safari and Chrome support this; Firefox ignores it
  if (typeof globalThis.gc === "function") {
    globalThis.gc();
  }
}
```

**Why explicit dispose matters:** ONNX Runtime WASM backend allocates model weights in WASM linear memory, which is NOT automatically collected by JavaScript GC. Without `dispose()`, the WASM heap grows monotonically. On iOS Safari with 3GB budget, two 300MB models will exceed the limit.

### Mobile Thresholds

| `deviceMemoryGB` | Recommendation | Model Behavior |
|-------------------|----------------|----------------|
| >= 4 GB | `"full"` | Load desktop models, no warnings |
| 2-4 GB | `"mobile"` | Load quantized/mobile variants; warn for models >200MB |
| < 2 GB | `"fallback"` | Show pre-recorded results only; no model downloads |

**Per-model decisions:**

| Model | Size (MB) | 4GB+ | 2-4GB | <2GB |
|-------|-----------|------|-------|------|
| whisper-tiny.en | ~40 | Load | Load | Load |
| distilbert-sst2 | ~67 | Load | Load | Load |
| all-MiniLM-L6-v2 | ~23 | Load | Load | Load |
| vit-base-patch16-224 | ~88 | Load | mobilevit-small (~25MB) | Fallback |
| distilbart-cnn-6-6 | ~305 | Load | q4 quantized (~80MB) | Fallback |

**`canRunModel` formula:**
```
canRunModel(sizeMB) =
  sizeMB < 50                              → always true (tiny models)
  || deviceMemoryGB >= 4                    → always true
  || (deviceMemoryGB >= 2 && sizeMB < 200)  → medium models on 2-4GB
  || false                                  → fallback
```

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/playground/usePipelineManager.ts` | **New** | Shared hook for pipeline lifecycle, dispose, progress tracking |
| `src/components/playground/useMobileDetect.ts` | **New** | Device capability detection hook |
| `src/data/prerecorded-results.ts` | **New** | Static fallback data per demo |
| `src/components/playground/WhisperDemo.tsx` | **Modified** | Resampling, AudioContext state handling, recording limit, use usePipelineManager |
| `src/components/playground/PlaygroundApp.tsx` | **Modified** | Shared pipeline ref, mobile detection, storage persistence, model size badges |
| `src/components/playground/DemoShell.tsx` | **Modified** | Progress bar, model size badge, fallback banner |
| `src/components/playground/ImageDemo.tsx` | **Modified** | Mobile camera/gallery buttons, mobile model variant |
| `src/components/playground/SentimentDemo.tsx` | **Modified** | Use usePipelineManager (model already small enough) |
| `src/components/playground/SummaryDemo.tsx` | **Modified** | Mobile quantized model, fallback for low-memory devices |
| `src/components/playground/RAGDemo.tsx` | **Modified** | Use usePipelineManager (model already small enough) |
| `src/components/playground/useDevice.ts` | **Unchanged** | Kept as-is for WebGPU detection; mobile detect is separate concern |
