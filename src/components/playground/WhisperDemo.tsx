import { useState, useRef } from "react";
import { DemoShell } from "./DemoShell";
import { useDevice } from "./useDevice";

export function WhisperDemo() {
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const pipelineRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        await transcribe(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript("");
      setAudioUrl(null);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribe = async (url: string) => {
    setIsLoading(true);
    setTranscript("");
    try {
      const pipe = await loadModel();
      const output = await pipe(url);
      setTranscript((output as { text: string }).text || "Could not transcribe audio.");
    } catch (err) {
      console.error("Transcription error:", err);
      setTranscript("Error transcribing audio. Try again with a clearer recording.");
    }
    setIsLoading(false);
  };

  const transcribeExample = async () => {
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
                background: "#64ffda",
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
            Recording...
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
          </span>
        )}
      </div>

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
