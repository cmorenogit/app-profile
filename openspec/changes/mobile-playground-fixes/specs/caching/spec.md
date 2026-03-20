# Spec: Caching — mobile-playground-fixes

**Change:** mobile-playground-fixes
**Area:** Storage persistence, space estimation
**Status:** Draft
**Affected files:** `src/components/playground/PlaygroundApp.tsx`

---

## 1. Requirements

### 1.1 Storage Persistence

- **REQ-CA-01:** `PlaygroundApp` MUST call `navigator.storage.persist()` on mount to request persistent storage, protecting cached models from browser eviction.
- **REQ-CA-02:** The `persist()` call MUST be wrapped in a try/catch, as the API may be unavailable or may throw in restricted contexts.
- **REQ-CA-03:** The system MUST NOT block rendering or demo interaction on the `persist()` result. The call SHOULD be fire-and-forget.
- **REQ-CA-04:** If `persist()` returns `false` (browser declined), the system SHOULD log a warning but MUST NOT show an error to the user. Models will still be cached; they are just subject to eviction.
- **REQ-CA-05:** The system MUST NOT call `persist()` more than once per page load.

### 1.2 Space Estimation

- **REQ-CA-06:** Before downloading a model, the system SHOULD check available storage via `navigator.storage.estimate()`.
- **REQ-CA-07:** If `estimate().quota - estimate().usage` is less than the model's expected size (with a 20% margin), the system MUST warn the user that storage may be insufficient.
- **REQ-CA-08:** The warning MUST include the available space and required space in MB.
- **REQ-CA-09:** The user MUST be able to proceed with the download despite the warning (non-blocking).
- **REQ-CA-10:** If `navigator.storage.estimate()` is not available, the system MUST skip the check and allow the download without warning.

### 1.3 Cache API Awareness

- **REQ-CA-11:** Transformers.js uses the Cache API with the cache name `transformers-cache` by default. The system MUST NOT change this default.
- **REQ-CA-12:** The system MAY display cached model status (e.g., "Model cached" indicator) if Cache API inspection is feasible without performance impact.
- **REQ-CA-13:** The system MUST NOT attempt to manually manage the `transformers-cache` entries (no manual deletion, no custom cache keys).

### 1.4 iOS Safari ITP Considerations

- **REQ-CA-14:** The system MUST acknowledge that iOS Safari's 7-day ITP policy deletes script-writable storage (including Cache API) after 7 days without user interaction on the origin.
- **REQ-CA-15:** The system SHOULD NOT attempt to work around ITP (e.g., no fake service workers, no IndexedDB mirroring). The accepted trade-off is that models may need to be re-downloaded after 7 days of inactivity.
- **REQ-CA-16:** When a model is re-downloaded after cache eviction, the progress bar (REQ-UX-01) provides adequate feedback, making re-download acceptable UX.

---

## 2. Scenarios

### Scenario: Storage persistence granted

```
Given the user opens the Playground for the first time
  And the browser supports navigator.storage.persist()
When PlaygroundApp mounts
Then navigator.storage.persist() is called
  And the browser grants persistence (returns true)
  And cached models are protected from eviction
  And no user-visible indication is shown
```

### Scenario: Storage persistence denied

```
Given the user opens the Playground
  And the browser declines navigator.storage.persist() (returns false)
When PlaygroundApp mounts
Then the denial is logged to console as a warning
  And the playground continues to function normally
  And models are cached but subject to browser eviction policies
```

### Scenario: Storage persistence API unavailable

```
Given the user is on an older browser without navigator.storage
When PlaygroundApp mounts
Then the persist() call is skipped (caught by try/catch)
  And no error is shown
  And models download normally each time (no caching concern)
```

### Scenario: Sufficient storage for model download

```
Given the user selects a demo with a 40MB model
  And navigator.storage.estimate() reports 500MB available
When the system checks storage before download
Then the check passes (500MB > 40MB * 1.2)
  And the download proceeds without warning
```

### Scenario: Insufficient storage for model download

```
Given the user selects a demo with a 250MB model
  And navigator.storage.estimate() reports 200MB available
When the system checks storage before download
Then a warning is displayed: "Low storage: ~200MB available, model needs ~250MB"
  And a "Download anyway" button is available
When the user taps "Download anyway"
Then the download proceeds
  If the download fails due to storage, an error is shown
```

### Scenario: iOS Safari cache eviction after 7 days

```
Given the user loaded the Whisper model 8 days ago
  And has not visited the site since
When the user returns to the Playground and selects Whisper
Then iOS Safari has evicted the transformers-cache entries
  And Transformers.js detects cache miss
  And the full model download begins with progress bar
  And the user experience is identical to a first-time download
```

### Scenario: Model already cached (second load)

```
Given the user loaded the Sentiment model earlier in this session
  And then switched to another demo (model disposed from memory)
When the user switches back to Sentiment
Then the system calls pipeline() which checks Cache API
  And the model loads from cache (~1-2s)
  And no download progress is shown (only "Loading from cache..." spinner)
```

---

## 3. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| `storage.estimate()` returns `{quota: 0, usage: 0}` | Treat as unavailable; skip check, allow download |
| `storage.estimate()` throws (e.g., opaque origin, iframe) | Catch error, skip check, allow download |
| User is in private/incognito browsing mode | Cache API may work but data is lost on close; `persist()` likely returns false; no special handling needed |
| Multiple Playground tabs open simultaneously | Each tab calls `persist()` independently; this is idempotent and harmless |
| Storage quota changes between estimate and actual download | Warning is best-effort; actual download failure is handled by Transformers.js error |
| Cache partially populated (encoder cached, decoder not) | Transformers.js handles partial cache internally; progress bar shows remaining files |

---

## 4. Non-Goals

- PWA / Add to Home Screen to bypass ITP 7-day cap
- Custom service worker for cache management
- IndexedDB fallback for model storage
- Manual cache inspection or cleanup UI
- COOP/COEP headers for SharedArrayBuffer (evaluated separately per proposal risks)
