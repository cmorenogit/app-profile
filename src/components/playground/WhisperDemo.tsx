import { useState, useRef } from "react";
import { DemoShell } from "./DemoShell";
import { useDevice } from "./useDevice";

export function WhisperDemo() {
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const pipelineRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioBuffersRef = useRef<Float32Array[]>([]);
  const { device } = useDevice();

  const loadModel = async () => {
    if (pipelineRef.current) return pipelineRef.current;
    setIsModelLoading(true);
    const { pipeline } = await import("@huggingface/transformers");
    const pipe = await pipeline(
      "automatic-speech-recognition",
      "onnx-community/whisper-tiny.en",
      { device },
    );
    pipelineRef.current = pipe;
    setIsModelLoading(false);
    return pipe;
  };

  const startRecording = async () => {
    setError(null);
    setTranscript("");
    setAudioUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

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

    // Stop processing
    if (processorRef.current && sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      processorRef.current.disconnect();
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    // Close audio context
    if (audioContextRef.current) {
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

    // Create WAV blob for playback
    const wavBlob = float32ToWav(merged, 16000);
    const url = URL.createObjectURL(wavBlob);
    setAudioUrl(url);

    // Transcribe the raw audio data
    await transcribeAudio(merged);
  };

  const transcribeAudio = async (audioData: Float32Array) => {
    setIsLoading(true);
    setTranscript("");
    try {
      const pipe = await loadModel();
      const output = await pipe(audioData);
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
    try {
      const pipe = await loadModel();
      const output = await pipe(url);
      setTranscript((output as { text: string }).text || "Could not transcribe audio.");
    } catch (err) {
      console.error("Transcription error:", err);
      setTranscript("Error transcribing. Try again.");
    }
    setIsLoading(false);
  };

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
            padding: "6px 12px",
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
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
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
            gap: "8px",
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
              }} />
              Record
            </>
          )}
        </button>

        {isRecording && (
          <span style={{
            color: "#ff6b6b",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ff6b6b",
              animation: "pulse 1s ease-in-out infinite",
              display: "inline-block",
            }} />
            Recording... (click Stop when done)
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
          </span>
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
          <audio controls src={audioUrl} style={{ width: "100%", height: "36px" }} />
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
