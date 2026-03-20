# Spec: Memory Management — mobile-playground-fixes

**Change:** mobile-playground-fixes
**Area:** Pipeline lifecycle, model disposal, mobile detection
**Status:** Draft
**Affected files:** `src/components/playground/usePipelineManager.ts` (new), `src/components/playground/useDevice.ts`, `src/components/playground/PlaygroundApp.tsx`

---

## 1. Requirements

### 1.1 Pipeline Lifecycle (`usePipelineManager`)

- **REQ-MM-01:** The system MUST provide a shared hook `usePipelineManager` that manages the lifecycle of the currently active Transformers.js pipeline.
- **REQ-MM-02:** When a new demo is activated, the hook MUST dispose of the previous demo's pipeline before loading the new one.
- **REQ-MM-03:** Disposal MUST call `.dispose()` on the pipeline instance if the method exists, releasing WASM/WebGPU memory.
- **REQ-MM-04:** The hook MUST track which demo currently owns the active pipeline to prevent disposing a pipeline that is still in use.
- **REQ-MM-05:** If the user re-selects the same demo after it was disposed, the model MUST be re-loaded (from Cache API if cached, ~2s expected latency).
- **REQ-MM-06:** The hook MUST expose a `loadPipeline(task, model, options)` function and a `currentPipeline` ref for demos to consume.
- **REQ-MM-07:** On component unmount (user navigates away from playground), the hook MUST dispose of any active pipeline.

### 1.2 Mobile Detection (`useDevice` expansion)

- **REQ-MM-08:** `useDevice` MUST detect whether the device is mobile via User-Agent heuristics (checking for `iPhone`, `iPad`, `Android`, `Mobile` tokens).
- **REQ-MM-09:** `useDevice` MUST expose `isMobile: boolean` alongside existing `device` and `isWebGPU`.
- **REQ-MM-10:** `useDevice` SHOULD estimate available memory using `navigator.deviceMemory` when available (Chrome only).
- **REQ-MM-11:** When `navigator.deviceMemory` is not available (Safari, Firefox), the system MUST use heuristics: iOS devices SHOULD be assumed to have 3GB usable memory; Android devices without the API SHOULD be assumed to have 4GB.
- **REQ-MM-12:** `useDevice` MUST expose `estimatedMemoryGB: number` for other hooks/components to use in decision-making.

### 1.3 Memory-Based Warnings and Fallbacks

- **REQ-MM-13:** Demos with models exceeding 200MB MUST display a warning badge on their selector card when `estimatedMemoryGB < 4`.
- **REQ-MM-14:** Demos with models exceeding 300MB SHOULD offer a pre-recorded fallback result on devices with `estimatedMemoryGB < 4`, rather than attempting to load the model.
- **REQ-MM-15:** The warning MUST include the approximate model size in MB.
- **REQ-MM-16:** The user MAY override warnings and attempt to load the model anyway (with an explicit "Load anyway" action).

### 1.4 Model Variants for Mobile

- **REQ-MM-17:** On mobile devices, demos SHOULD prefer quantized or smaller model variants when available (e.g., `q4` quantization, smaller architectures).
- **REQ-MM-18:** The model variant selection MUST be transparent to the user (show which model is being used in the DemoShell badge).
- **REQ-MM-19:** If a preferred mobile model is not available in the Transformers.js version, the system MUST fall back to the default model with appropriate memory warnings.

---

## 2. Scenarios

### Scenario: Switching demos disposes previous model

```
Given the user has loaded the Sentiment demo and the model is in memory
When the user switches to the Image demo
Then usePipelineManager calls .dispose() on the Sentiment pipeline
  And the Sentiment pipeline ref is set to null
  And the Image demo's model begins loading
  And memory used by the Sentiment model is freed
```

### Scenario: Re-selecting a previously disposed demo

```
Given the user loaded Sentiment, switched to Image (disposing Sentiment), then switches back to Sentiment
When Sentiment demo activates
Then the pipeline is null (was disposed)
  And the model is re-loaded from Cache API
  And load time is ~2s (cache hit) instead of full download
```

### Scenario: Low-memory device loads a large model

```
Given the device has estimatedMemoryGB = 3 (iPhone)
  And the Summary demo requires a ~250MB model
When the user selects the Summary demo
Then a warning is shown: "This model requires ~250MB. Your device may not have enough memory."
  And a "Load anyway" button is available
  And a pre-recorded fallback result is shown by default
```

### Scenario: Device memory detection on Chrome Android

```
Given the user is on Chrome Android with navigator.deviceMemory = 4
When useDevice initializes
Then estimatedMemoryGB is set to 4
  And isMobile is true
  And device is "wasm" or "webgpu" based on GPU availability
```

### Scenario: Device memory detection on iOS Safari

```
Given the user is on iOS Safari
  And navigator.deviceMemory is undefined
When useDevice initializes
Then estimatedMemoryGB defaults to 3 (iOS heuristic)
  And isMobile is true
  And a log message indicates memory was estimated via heuristic
```

### Scenario: User navigates away from playground

```
Given the user has a model loaded in memory
When the user navigates to another page (e.g., /archive)
Then the usePipelineManager cleanup runs on unmount
  And .dispose() is called on the active pipeline
```

### Scenario: Tab killed by iOS Safari (OOM)

```
Given the user loaded a model that pushed memory close to the limit
When iOS Safari decides to kill the tab to reclaim memory
Then there is no graceful handling possible (OS kills the process)
  And the user sees a blank page when returning to the tab
  And the pre-recorded fallback system prevents this by blocking large models on low-memory devices
```

---

## 3. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| `.dispose()` method does not exist on pipeline | Log warning, set ref to null, continue without error |
| Two demos attempt to load simultaneously (race condition) | usePipelineManager serializes load requests; second request cancels/waits for first disposal |
| `navigator.deviceMemory` returns 0.25 (very low-end device) | All models >50MB show warning; only lightweight demos enabled without warning |
| iPad reports as desktop User-Agent (iPadOS 13+) | Check for `maxTouchPoints > 0` as secondary heuristic for iPad detection |
| WebGPU adapter available but GPU memory too low | Not detectable; rely on deviceMemory heuristic since GPU memory is not queryable |

---

## 4. Interface Sketch

```typescript
// usePipelineManager hook
interface PipelineManager {
  loadPipeline: (task: string, model: string, options?: object) => Promise<any>;
  disposeCurrent: () => Promise<void>;
  isLoading: boolean;
  currentDemoId: string | null;
  pipeline: any | null;
}

// useDevice expanded return
interface DeviceInfo {
  device: "webgpu" | "wasm";
  isDetecting: boolean;
  isWebGPU: boolean;
  isMobile: boolean;
  estimatedMemoryGB: number;
}
```

---

## 5. Non-Goals

- Implementing Web Workers for off-main-thread inference
- Monitoring real-time WASM heap usage (not exposed by browsers)
- Automatic model size optimization (e.g., dynamic quantization at runtime)
