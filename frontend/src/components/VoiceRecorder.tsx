import { useState, useRef } from "react";
import "./VoiceRecorder.css";

interface Props {
  onResult: (audioBase64: string) => void;
  disabled: boolean;
}

export default function VoiceRecorder({ onResult, disabled }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          onResult(base64);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert(
        "Microphone access is required for voice chat. Please allow microphone access."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      className={`voice-button ${isRecording ? "recording" : ""}`}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled && !isRecording}
      title={isRecording ? "Stop recording" : "Start voice recording"}
    >
      {isRecording ? (
        <span className="recording-icon">
          <span className="pulse-ring"></span>
          ⏹
        </span>
      ) : (
        "🎤"
      )}
    </button>
  );
}
