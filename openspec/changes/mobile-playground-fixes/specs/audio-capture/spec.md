# Spec: Audio Capture — mobile-playground-fixes

**Change:** mobile-playground-fixes
**Area:** WhisperDemo audio capture, resampling, iOS AudioContext handling
**Status:** Draft
**Affected files:** `src/components/playground/WhisperDemo.tsx`

---

## 1. Requirements

### 1.1 AudioContext Creation

- **REQ-AC-01:** The system MUST create `AudioContext` without specifying `sampleRate` in the constructor, allowing the browser to use its native sample rate.
- **REQ-AC-02:** The system MUST read `audioContext.sampleRate` after creation to determine the actual capture rate.
- **REQ-AC-03:** The system MUST call `audioContext.resume()` explicitly after creation, before connecting nodes, to handle iOS Safari's suspended-by-default policy.
- **REQ-AC-04:** The system MUST NOT pass `sampleRate: 16000` to `getUserMedia` constraints, as iOS Safari ignores this and captures at 48kHz native regardless.

### 1.2 Resampling

- **REQ-AC-05:** The system MUST resample captured audio from the native sample rate to 16kHz before passing it to the Whisper pipeline.
- **REQ-AC-06:** The system MUST use linear interpolation for resampling. This is sufficient for speech-to-text and avoids the complexity of sinc interpolation.
- **REQ-AC-07:** The system MUST NOT use `OfflineAudioContext` for resampling, as Safari does not support `sampleRate` values below 44100.
- **REQ-AC-08:** The WAV blob for playback MUST use the native sample rate (not 16kHz) so playback sounds correct.
- **REQ-AC-09:** The resampled 16kHz Float32Array MUST be passed to the Whisper pipeline for transcription.

### 1.3 iOS AudioContext State Management

- **REQ-AC-10:** The system MUST listen for `statechange` events on `AudioContext` to detect the `interrupted` state (iOS-specific: phone calls, Siri, app switch).
- **REQ-AC-11:** When `AudioContext.state` transitions to `interrupted`, the system MUST stop recording gracefully and display a user-visible message.
- **REQ-AC-12:** When `AudioContext.state` transitions to `suspended` during recording, the system SHOULD attempt `audioContext.resume()` once. If resume fails, it MUST stop recording and notify the user.
- **REQ-AC-13:** The system MUST clean up all audio resources (stream tracks, source node, processor node, AudioContext) when recording stops, whether by user action or interruption.

### 1.4 Recording Limits

- **REQ-AC-14:** On mobile devices, recording duration MUST be limited to 30 seconds. A countdown or elapsed time indicator SHOULD be displayed.
- **REQ-AC-15:** When the 30-second limit is reached, recording MUST stop automatically and proceed to transcription.
- **REQ-AC-16:** On desktop, recording MAY remain unlimited or use a higher limit (e.g., 60 seconds).

### 1.5 Permission Handling

- **REQ-AC-17:** The system MUST handle `NotAllowedError` (permission denied) with a clear message instructing the user to allow microphone access.
- **REQ-AC-18:** The system MUST handle `NotFoundError` (no microphone) with a message indicating no input device was found.
- **REQ-AC-19:** The system SHOULD detect when microphone permission has been permanently denied (iOS Settings level) and suggest the user check Settings.

---

## 2. Scenarios

### Scenario: Normal recording on iOS Safari

```
Given the user is on iOS Safari 17+
  And microphone permission is granted
When the user taps "Record"
Then AudioContext is created without sampleRate constraint
  And audioContext.resume() is called
  And audio is captured at 48kHz native
  And the recording indicator shows elapsed time
When the user taps "Stop Recording"
Then the captured audio is resampled from 48kHz to 16kHz via linear interpolation
  And a WAV blob at 48kHz is created for playback
  And the 16kHz Float32Array is passed to Whisper for transcription
  And the transcript is displayed
```

### Scenario: Normal recording on Android Chrome

```
Given the user is on Android Chrome
  And microphone permission is granted
When the user taps "Record"
Then AudioContext is created without sampleRate constraint
  And the native sample rate is detected (typically 48kHz)
  And audio is captured and buffered
When the user taps "Stop Recording"
Then the audio is resampled to 16kHz and transcribed correctly
```

### Scenario: AudioContext interrupted by phone call (iOS)

```
Given the user is recording audio on iOS
When a phone call comes in
Then AudioContext.state changes to "interrupted"
  And the statechange listener fires
  And recording stops gracefully
  And a message is displayed: "Recording interrupted by system event"
  And all audio resources are cleaned up
  And any audio captured before the interruption is preserved for transcription
```

### Scenario: AudioContext suspended on iOS (user switches app)

```
Given the user is recording audio on iOS
When the user switches to another app and returns
Then AudioContext.state may be "suspended"
  And the system attempts audioContext.resume()
  If resume succeeds, recording continues
  If resume fails, recording stops and the user is notified
```

### Scenario: 30-second recording limit on mobile

```
Given the user is on a mobile device
  And recording has been active for 30 seconds
When the timer reaches 30 seconds
Then recording stops automatically
  And the captured audio is processed and transcribed
  And the user sees a note that recording was auto-stopped at the time limit
```

### Scenario: Microphone permission denied

```
Given the user has not granted microphone permission
When the user taps "Record"
  And the browser permission prompt appears
  And the user denies the permission
Then an error message is shown: "Microphone access denied. Please allow microphone permissions and try again."
  And no AudioContext or stream resources are created
```

### Scenario: No microphone available

```
Given the device has no microphone (e.g., desktop without mic)
When the user clicks "Record"
Then getUserMedia throws NotFoundError
  And the error message reads: "No microphone found. Please connect a microphone."
```

### Scenario: Resampling from non-standard rate

```
Given the device captures at 44100Hz (some Android devices)
When recording stops and audio is processed
Then the resampling function converts 44100Hz to 16000Hz
  And the ratio (44100/16000 = 2.75625) is handled correctly by linear interpolation
  And the transcription quality is unaffected
```

---

## 3. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| AudioContext created but `sampleRate` returns unexpected value (e.g., 8000) | Log warning, proceed with resampling; if rate < 16kHz, skip resampling and pass directly |
| User taps Record then immediately taps Stop (<0.5s) | Show "No audio recorded" message, do not attempt transcription |
| getUserMedia succeeds but no audio data arrives (silent stream) | After stop, detect empty/silent buffer, show helpful message |
| Multiple rapid Record/Stop presses | Debounce or disable button during state transitions to prevent resource leaks |
| Browser tab put to sleep by OS (both iOS and Android) | statechange listener handles cleanup; partial audio is preserved if possible |

---

## 4. Non-Goals

- Migration from ScriptProcessorNode to AudioWorklet (out of scope per proposal)
- Echo cancellation tuning
- Noise suppression beyond browser defaults
- Support for browsers older than Safari 14.1 / Chrome 90
