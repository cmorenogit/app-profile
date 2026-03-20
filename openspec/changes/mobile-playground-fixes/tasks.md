# Tasks: Mobile Playground Fixes

## Phase 1: Foundation Hooks

### 1.1 Create `useMobileDetect` hook
- [ ] Create `src/components/playground/useMobileDetect.ts`
- [ ] Implement feature detection: deviceMemory, screen heuristic, touch, hardwareConcurrency
- [ ] Implement `canRunModel(sizeMB)` and `recommendation` logic
- [ ] Detect iOS vs Android for platform-specific workarounds

### 1.2 Create `usePipelineManager` hook
- [ ] Create `src/components/playground/usePipelineManager.ts`
- [ ] Implement shared pipeline ref pattern (dispose previous before loading new)
- [ ] Implement `progress_callback` integration for download progress
- [ ] Implement `loadModel()` with device-aware model selection
- [ ] Implement `dispose()` with ONNX session cleanup
- [ ] Handle fallback status when device can't run model

### 1.3 Create pre-recorded results data
- [ ] Create `src/data/prerecorded-results.ts`
- [ ] Add example input/output for each of the 5 demos

## Phase 2: Fix Whisper Audio (Critical)

### 2.1 Fix AudioContext and resampling
- [ ] Remove `sampleRate: 16000` from AudioContext constructor
- [ ] Remove `sampleRate: 16000` from getUserMedia constraints
- [ ] Add `await audioContext.resume()` after creation
- [ ] Store `audioContext.sampleRate` as native rate
- [ ] Implement `resampleLinear()` function
- [ ] Resample merged buffers before passing to Whisper
- [ ] Use native rate for WAV playback blob

### 2.2 iOS state handling
- [ ] Add `statechange` event listener for `interrupted`/`suspended`
- [ ] Auto-resume AudioContext on state change
- [ ] Handle permanent failure gracefully (process available buffers)

### 2.3 Mobile recording limit
- [ ] Add 30-second countdown timer on mobile
- [ ] Show countdown UI during recording
- [ ] Auto-stop recording when timer expires

## Phase 3: DemoShell + PlaygroundApp Updates

### 3.1 Update DemoShell
- [ ] Add progress bar props (progress, loadedBytes, totalBytes)
- [ ] Render determinate progress bar with MB counter
- [ ] Add model size badge (modelSizeMB prop)
- [ ] Add fallback banner (isFallback, fallbackReason props)
- [ ] Show pre-recorded results when in fallback mode

### 3.2 Update PlaygroundApp
- [ ] Add `useMobileDetect()` call
- [ ] Add shared pipeline ref
- [ ] Call `navigator.storage.persist()` on mount
- [ ] Add model size badges to demo selector cards

## Phase 4: Update Individual Demos

### 4.1 Integrate usePipelineManager in all demos
- [ ] WhisperDemo: use usePipelineManager + audio fixes
- [ ] SentimentDemo: use usePipelineManager
- [ ] SummaryDemo: use usePipelineManager + mobile model variant
- [ ] ImageDemo: use usePipelineManager + mobile camera/gallery buttons
- [ ] RAGDemo: use usePipelineManager

### 4.2 Mobile UX per demo
- [ ] ImageDemo: mobile camera/gallery buttons instead of drag-drop text
- [ ] SummaryDemo: pre-recorded fallback for low-memory devices

## Phase 5: Build & Deploy

### 5.1 Verify build
- [ ] `npm run build` passes without errors
- [ ] No TypeScript errors

### 5.2 Deploy and test
- [ ] Push to feature branch
- [ ] Get Vercel preview URL
- [ ] Verify on mobile device
