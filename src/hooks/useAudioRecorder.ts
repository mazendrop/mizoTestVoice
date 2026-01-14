import { useState, useRef, useCallback } from "react";

export interface AudioRecorderState {
    isRecording: boolean;
    isPaused: boolean;
    recordingTime: number;
    mediaRecorder: MediaRecorder | null;
    audioBlob: Blob | null;
    error: string | null;
}

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [mimeType, setMimeType] = useState<string>("audio/webm");

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Check supported mime types
            const types = [
                "audio/webm;codecs=opus",
                "audio/webm",
                "audio/mp4",
                "audio/ogg;codecs=opus"
            ];

            const selectedType = types.find(type => MediaRecorder.isTypeSupported(type)) || "";
            if (selectedType) {
                setMimeType(selectedType);
            }

            const mediaRecorder = new MediaRecorder(stream, selectedType ? { mimeType: selectedType } : undefined);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Use the determined mime type for the blob
                const type = selectedType || "audio/webm";
                const blob = new Blob(chunksRef.current, { type });
                setAudioBlob(blob);
                chunksRef.current = [];

                // Stop all tracks
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);

            // Start timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (err: any) {
            setError("Microphone access denied or not available.");
            console.error("Error accessing microphone:", err);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    const resetRecording = useCallback(() => {
        setAudioBlob(null);
        setRecordingTime(0);
        setError(null);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return {
        isRecording,
        recordingTime,
        audioBlob,
        error,
        mimeType,
        startRecording,
        stopRecording,
        resetRecording,
        formatTime,
    };
};
