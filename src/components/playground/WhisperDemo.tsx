import { useState, useRef, useEffect } from "react";
import { DemoShell } from "./DemoShell";
import { useDevice } from "./useDevice";
import { useMobileDetect } from "./useMobileDetect";
import { PRERECORDED_RESULTS } from "../../data/prerecorded-results";

// Linear interpolation resampling from sourceRate to targetRate.
// OfflineAudioContext fails below 44100Hz on Safari, so we use manual resampling.
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

export function WhisperDemo() {
  const mobileInfo = useMobileDetect();
  const { device } = useDevice();
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const pipelineRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioBuffersRef = useRef<Float32Array[]>([]);
  const nativeSampleRateRef = useRef<number>(48000);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateChangeHandlerRef = useRef<(() => void) | null>(null);

  // iOS Safari cannot run Whisper inference — the autoregressive decoder
  // runs up to 448 steps with growing KV cache in WASM memory that iOS
  // cannot handle. This is a known unresolved issue (transformers.js #1298).
  if (mobileInfo.isIOS) {
    const example = PRERECORDED_RESULTS.whisper[0];
    return (
      <DemoShell
        title="Speech-to-Text"
        howItWorks="OpenAI's Whisper model runs entirely in your browser. On iOS, we show a pre-computed example due to Safari memory limitations with autoregressive models."
        modelName="whisper-tiny.en"
        isLoading={false}
        isFallback={true}
        fallbackReason="Whisper's autoregressive decoder exceeds iOS Safari memory limits"
        modelSizeMB={40}
        device={device}
      >
        <div style={{
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid rgba(100, 255, 218, 0.15)",
          background: "rgba(100, 255, 218, 0.05)",
        }}>
          <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "4px" }}>
            Example: {example.input.label}
          </span>
          <span style={{ color: "#8892b0", fontSize: "11px", display: "block", marginBottom: "12px", fontStyle: "italic" }}>
            {example.input.value}
          </span>
          <audio
            controls
            src="https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav"
            style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", height: "36px", marginBottom: "12px" }}
          />
          <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
            Transcript
          </span>
          <p style={{ color: "#e6f1ff", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
            {example.output.text}
          </p>
        </div>
      </DemoShell>
    );
  }

  // Auto-stop recording at 30s on mobile
  useEffect(() => {
    if (recordingSeconds >= 30) {
      const isMobile = "ontouchstart" in window && window.innerWidth < 768;
      if (isMobile) {
        stopRecording();
      }
    }
  }, [recordingSeconds]);

  const loadModel = async () => {
    if (pipelineRef.current) return pipelineRef.current;
    setIsModelLoading(true);
    const { env, pipeline } = await import("@huggingface/transformers");

    // iOS Safari: disable multi-threaded WASM (JSC memory spiral, Issue #1242)
    // and Cache API (eliminates memory copy during download)
    const isIOS = "ontouchstart" in window &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    if (isIOS) {
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.numThreads = 1;
      }
      env.useBrowserCache = false;
    }

    const pipe = await pipeline(
      "automatic-speech-recognition",
      "onnx-community/whisper-tiny.en",
      {
        device,
        // q4 for iOS: encoder ~8.6MB + decoder ~82.7MB ≈ 91MB total
        // vs q8: encoder ~9.7MB + decoder ~105MB ≈ 115MB — too close to iOS limit
        dtype: isIOS ? "q4" : undefined,
      },
    );
    pipelineRef.current = pipe;
    setIsModelLoading(false);
    return pipe;
  };

  const startRecording = async () => {
    setError(null);
    setTranscript("");
    setAudioUrl(null);
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      nativeSampleRateRef.current = audioContext.sampleRate;

      // iOS requires explicit resume after user gesture
      await audioContext.resume();

      // Handle iOS interruptions (phone calls, Siri, lock screen)
      const stateChangeHandler = () => {
        if (audioContext.state === "interrupted" || audioContext.state === "suspended") {
          audioContext.resume().catch(() => {
            setError("Audio interrupted. Recording stopped — processing available audio.");
          });
        }
      };
      stateChangeHandlerRef.current = stateChangeHandler;
      audioContext.addEventListener("statechange", stateChangeHandler);

      const source = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      // Use ScriptProcessorNode to capture raw PCM audio
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      audioBuffersRef.current = [];

      processor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0);
        audioBuffersRef.current.push(new Float32Array(data));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      const msg = (err as Error).message || "";
      if (msg.includes("Permission denied") || msg.includes("NotAllowedError")) {
        setError("Microphone access denied. Please allow microphone permissions and try again.");
      } else if (msg.includes("NotFoundError")) {
        setError("No microphone found. Please connect a microphone.");
      } else {
        setError("Could not access microphone. Please check your browser permissions.");
      }
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);

    // Clear recording timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingSeconds(0);

    // Stop processing
    if (processorRef.current && sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      processorRef.current.disconnect();
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    // Remove statechange listener and close audio context
    if (audioContextRef.current) {
      if (stateChangeHandlerRef.current) {
        audioContextRef.current.removeEventListener("statechange", stateChangeHandlerRef.current);
        stateChangeHandlerRef.current = null;
      }
      await audioContextRef.current.close();
    }

    // Merge audio buffers into a single Float32Array
    const buffers = audioBuffersRef.current;
    if (buffers.length === 0) {
      setError("No audio recorded. Try holding the Record button longer.");
      return;
    }

    const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const buf of buffers) {
      merged.set(buf, offset);
      offset += buf.length;
    }

    // Create WAV blob for playback using native sample rate (correct speed)
    const wavBlob = float32ToWav(merged, nativeSampleRateRef.current);
    const url = URL.createObjectURL(wavBlob);
    setAudioUrl(url);

    // Resample to 16kHz for Whisper inference
    const resampled = resampleLinear(merged, nativeSampleRateRef.current, 16000);

    // Transcribe the resampled audio data
    await transcribeAudio(resampled);
  };

  const transcribeAudio = async (audioData: Float32Array) => {
    setIsLoading(true);
    setTranscript("");

    const isIOS = "ontouchstart" in window &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    // On iOS, cap audio to 15s to reduce memory during inference
    // Whisper decoder runs up to 448 autoregressive steps with growing KV cache
    const maxSamples = isIOS ? 16000 * 15 : audioData.length;
    const clippedAudio = audioData.length > maxSamples
      ? audioData.slice(0, maxSamples)
      : audioData;

    try {
      const pipe = await loadModel();
      const output = await pipe(clippedAudio, {
        // Limit decoder iterations to reduce KV cache memory growth on iOS
        // 10s of speech ≈ 20-40 tokens; 64 is generous for 15s clips
        ...(isIOS ? { max_new_tokens: 64, chunk_length_s: 15 } : {}),
      });
      const text = (output as { text: string }).text?.trim();
      setTranscript(text || "No speech detected. Try speaking louder or closer to the microphone.");
    } catch (err) {
      console.error("Transcription error:", err);
      setTranscript("Error transcribing audio. Try again with a clearer recording.");
    }
    setIsLoading(false);
  };

  const transcribeExample = async () => {
    setError(null);
    const url = "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav";
    setAudioUrl(url);
    setIsLoading(true);
    setTranscript("");

    const isIOS = "ontouchstart" in window &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    try {
      const pipe = await loadModel();
      const output = await pipe(url, {
        ...(isIOS ? { max_new_tokens: 64, chunk_length_s: 15 } : {}),
      });
      setTranscript((output as { text: string }).text || "Could not transcribe audio.");
    } catch (err) {
      console.error("Transcription error:", err);
      setTranscript("Error transcribing. Try again.");
    }
    setIsLoading(false);
  };

  const isMobile = typeof window !== "undefined" && "ontouchstart" in window && window.innerWidth < 768;

  return (
    <DemoShell
      title="Speech-to-Text"
      howItWorks="OpenAI's Whisper model runs entirely in your browser. Record from your microphone or try an example — audio is transcribed locally without sending data to any server."
      modelName="whisper-tiny.en"
      isLoading={isModelLoading}
      loadingText="Loading Whisper model... (first time takes ~15s, ~40MB download)"
      device={device}
    >
      {/* Example button */}
      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={transcribeExample}
          disabled={isLoading || isRecording}
          style={{
            padding: "10px 16px",
            minHeight: "44px",
            borderRadius: "6px",
            border: "1px solid rgba(100, 255, 218, 0.1)",
            background: "rgba(17, 34, 64, 0.5)",
            color: "#a8b2d1",
            fontSize: "12px",
            cursor: isLoading || isRecording ? "not-allowed" : "pointer",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.1)")}
        >
          Try example: JFK speech clip
        </button>
      </div>

      {/* Record button */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: `1px solid ${isRecording ? "rgba(255, 107, 107, 0.3)" : "rgba(100, 255, 218, 0.2)"}`,
            background: isRecording ? "rgba(255, 107, 107, 0.1)" : "rgba(100, 255, 218, 0.1)",
            color: isRecording ? "#ff6b6b" : "#64ffda",
            fontSize: "14px",
            fontWeight: 500,
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background 0.2s, border-color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            whiteSpace: "nowrap",
            minWidth: "fit-content",
            width: "100%",
            minHeight: "48px",
          }}
        >
          {isRecording ? (
            <>
              <span style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: "#ff6b6b",
                display: "inline-block",
                flexShrink: 0,
              }} />
              Stop Recording
            </>
          ) : (
            <>
              <span style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: isLoading ? "#233554" : "#64ffda",
                display: "inline-block",
                flexShrink: 0,
              }} />
              Record
            </>
          )}
        </button>

        {isRecording && (
          <div style={{
            color: "#ff6b6b",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ff6b6b",
              animation: "pulse 1s ease-in-out infinite",
              display: "inline-block",
              flexShrink: 0,
            }} />
            {isMobile
              ? `Recording... ${recordingSeconds}s / 30s`
              : "Recording... (click Stop when done)"}
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "8px",
          background: "rgba(255, 107, 107, 0.08)",
          border: "1px solid rgba(255, 107, 107, 0.2)",
          marginBottom: "16px",
          color: "#ff6b6b",
          fontSize: "13px",
        }}>
          {error}
        </div>
      )}

      {/* Audio playback */}
      {audioUrl && !isRecording && (
        <div style={{ marginBottom: "16px" }}>
          <audio controls src={audioUrl} style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", height: "36px" }} />
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && !isModelLoading && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{
            width: "16px", height: "16px",
            border: "2px solid rgba(100, 255, 218, 0.15)",
            borderTop: "2px solid #64ffda",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            flexShrink: 0,
          }} />
          <span style={{ color: "#a8b2d1", fontSize: "13px" }}>Transcribing audio...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Result */}
      {transcript && (
        <div style={{
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid rgba(100, 255, 218, 0.15)",
          background: "rgba(100, 255, 218, 0.05)",
        }}>
          <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
            Transcript
          </span>
          <p style={{ color: "#e6f1ff", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
            {transcript}
          </p>
        </div>
      )}
    </DemoShell>
  );
}

// Convert Float32Array PCM to WAV Blob for playback
function float32ToWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}
