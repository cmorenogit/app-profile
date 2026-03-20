# Spec: Mobile UX — mobile-playground-fixes

**Change:** mobile-playground-fixes
**Area:** Progress bars, model size badges, touch inputs, pre-recorded fallbacks
**Status:** Draft
**Affected files:** `src/components/playground/DemoShell.tsx`, `src/components/playground/PlaygroundApp.tsx`, `src/components/playground/ImageDemo.tsx`, `src/components/playground/WhisperDemo.tsx`, `src/components/playground/SummaryDemo.tsx`, `src/data/prerecorded-results.ts` (new)

---

## 1. Requirements

### 1.1 Progress Bar with Bytes

- **REQ-UX-01:** During model download, `DemoShell` MUST display a progress bar showing bytes downloaded vs total bytes.
- **REQ-UX-02:** The progress display MUST show values in MB (e.g., "12.4 / 39.8 MB").
- **REQ-UX-03:** The progress callback MUST use the Transformers.js `progress_callback` option passed to `pipeline()`.
- **REQ-UX-04:** If total bytes are unknown (streaming without Content-Length), the progress bar SHOULD show an indeterminate animation with only downloaded bytes displayed.
- **REQ-UX-05:** The progress bar MUST be visually styled consistent with the portfolio theme (cyan accent #64ffda on dark background).
- **REQ-UX-06:** When a model is loading from Cache API (previously downloaded), the progress bar SHOULD show "Loading from cache..." instead of download progress.

### 1.2 Model Size Badges

- **REQ-UX-07:** Each demo selector card in `PlaygroundApp` MUST display the approximate model download size (e.g., "~40MB", "~250MB").
- **REQ-UX-08:** On devices with `estimatedMemoryGB < 4`, cards for models >200MB MUST display a warning indicator (e.g., amber/yellow border or icon).
- **REQ-UX-09:** The model size data MUST be hardcoded in the demos array (not fetched at runtime), since sizes are known at build time.
- **REQ-UX-10:** When a mobile-specific smaller model variant is used, the badge SHOULD reflect the smaller model's size (not the desktop model's size).

### 1.3 Touch-Friendly Inputs

- **REQ-UX-11:** On mobile devices, the WhisperDemo record button MUST have a minimum touch target of 48x48px (WCAG 2.5.8).
- **REQ-UX-12:** On mobile devices, ImageDemo MUST show separate "Take Photo" and "Choose from Gallery" buttons that trigger `<input type="file" capture="environment">` and `<input type="file" accept="image/*">` respectively.
- **REQ-UX-13:** On desktop, ImageDemo SHOULD continue to show a single file picker.
- **REQ-UX-14:** All interactive elements in demos MUST have adequate spacing (minimum 8px gap) to prevent mis-taps on mobile.
- **REQ-UX-15:** The demo selector grid MUST adapt to single-column layout on screens narrower than 640px (sm breakpoint).

### 1.4 Pre-Recorded Fallbacks

- **REQ-UX-16:** A new data file `src/data/prerecorded-results.ts` MUST contain pre-recorded demo results for each demo that may exceed device capabilities.
- **REQ-UX-17:** Each pre-recorded result MUST include: demo ID, input description, output result, and a label indicating it is a pre-recorded example.
- **REQ-UX-18:** When a demo cannot run on the device (memory too low, model too large), `DemoShell` MUST display the pre-recorded result with a clear "Pre-recorded example" badge.
- **REQ-UX-19:** The pre-recorded fallback MUST still allow the user to attempt loading the model via an explicit "Try loading model" button.
- **REQ-UX-20:** Pre-recorded results SHOULD be provided for at minimum: Summary and Image demos (the two largest models).
- **REQ-UX-21:** The pre-recorded display MUST visually distinguish itself from a live result (e.g., muted styling, dashed border, or distinct background).

### 1.5 Recording UX on Mobile

- **REQ-UX-22:** On mobile, the WhisperDemo MUST show a large, centered record button optimized for thumb interaction.
- **REQ-UX-23:** During recording on mobile, an elapsed time counter MUST be displayed (e.g., "0:12 / 0:30").
- **REQ-UX-24:** The "Try example" button MUST remain accessible on mobile as a fallback when microphone access is unavailable.

---

## 2. Scenarios

### Scenario: Model download progress on slow connection

```
Given the user selects the Whisper demo for the first time
  And the model has not been cached
When the model begins downloading (~40MB)
Then DemoShell shows a progress bar
  And the text reads "Downloading model: 5.2 / 39.8 MB"
  And the bar fills proportionally
When download completes
Then the progress bar disappears
  And the demo becomes interactive
```

### Scenario: Model loading from cache

```
Given the user previously loaded the Sentiment model (cached in Cache API)
When the user selects the Sentiment demo again
Then the progress area shows "Loading from cache..." with a spinner
  And the model loads in ~1-2s without download progress
```

### Scenario: Model size warning on low-memory device

```
Given the device has estimatedMemoryGB = 3
When PlaygroundApp renders the demo selector
Then the Summary demo card shows "~250MB" badge
  And the badge has an amber/warning color
  And a tooltip or subtitle reads "May be too large for this device"
  And the Sentiment demo card shows "~5MB" badge with no warning
```

### Scenario: Image demo on mobile (camera access)

```
Given the user is on a mobile device
When the user opens the Image demo
Then two buttons are displayed: "Take Photo" and "Choose from Gallery"
When the user taps "Take Photo"
Then the device camera opens
  And the captured photo is sent to the Image classification model
When the user taps "Choose from Gallery"
Then the device photo picker opens
  And the selected image is sent to the Image classification model
```

### Scenario: Pre-recorded fallback for Summary on low-memory iOS

```
Given the device is iOS with estimatedMemoryGB = 3
  And the Summary model requires ~250MB
When the user selects the Summary demo
Then DemoShell displays:
  - A "Pre-recorded example" badge with dashed border
  - The sample input text
  - The pre-recorded summary output
  - A "Try loading model" button (secondary styling)
  And no model download begins automatically
```

### Scenario: User overrides fallback and loads model

```
Given the pre-recorded fallback is shown for the Summary demo
When the user taps "Try loading model"
Then a confirmation appears: "This model (~250MB) may cause the browser tab to crash on this device. Continue?"
  If confirmed, the model download begins with progress bar
  If cancelled, the pre-recorded result remains
```

### Scenario: Demo selector grid on narrow screen

```
Given the viewport width is 375px (iPhone SE)
When PlaygroundApp renders
Then the demo selector grid displays as a single column
  And each card takes full width
  And the model size badge is visible without truncation
```

### Scenario: WhisperDemo recording UX on mobile

```
Given the user is on a mobile device
When the Whisper demo is active
Then the record button is at least 48x48px
  And it is centered in the demo area
When the user taps Record
Then an elapsed time counter shows "0:05 / 0:30"
  And the counter updates every second
When 30 seconds elapse
Then recording stops automatically
  And transcription begins
```

---

## 3. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Progress callback fires with `total: 0` | Show indeterminate progress bar with downloaded bytes only |
| Multiple progress callbacks from different model files (e.g., decoder + encoder) | Aggregate bytes across all files; show combined progress |
| Camera not available on mobile (permission denied for camera) | "Take Photo" button shows error; "Choose from Gallery" remains functional |
| Pre-recorded result data is missing for a demo | Do not show fallback; allow normal model loading with warning |
| Very narrow viewport (<320px) | Cards use 100% width; text wraps; badges stack vertically |
| User rapidly switches demos while progress bar is active | Previous download is cancelled (via AbortController if supported); new demo loads |

---

## 4. Data Structure: Pre-Recorded Results

```typescript
interface PrerecordedResult {
  demoId: string;
  inputLabel: string;       // e.g., "Sample news article"
  inputPreview?: string;    // Truncated input text for display
  output: string | object;  // The pre-computed result
  modelUsed: string;        // e.g., "distilbart-cnn-6-6"
}
```

---

## 5. Non-Goals

- Responsive redesign of the full portfolio layout (only playground-specific)
- Custom camera UI overlay
- Video recording support
- Drag-and-drop image upload on mobile
