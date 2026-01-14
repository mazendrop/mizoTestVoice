"use client";

import { useState, useRef, useEffect } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Mic, Square, Loader2, Copy, RefreshCw, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function VoiceRecorder() {
    const {
        isRecording,
        recordingTime,
        audioBlob,
        startRecording,
        stopRecording,
        resetRecording,
        formatTime,
        mimeType,
    } = useAudioRecorder();

    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [displayedText, setDisplayedText] = useState("");
    const [webhookUrl, setWebhookUrl] = useState("https://dropghost.app.n8n.cloud/webhook/Mizo-Test-n8n");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Sound Effects
    const startSound = useRef<HTMLAudioElement | null>(null);
    const stopSound = useRef<HTMLAudioElement | null>(null);
    const successSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            startSound.current = new Audio("/sounds/record-start.mp3");
            stopSound.current = new Audio("/sounds/record-stop.mp3");
            successSound.current = new Audio("/sounds/success.mp3");
        }
    }, []);

    // Typewriter Effect
    useEffect(() => {
        if (transcription) {
            setDisplayedText("");
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(prev => prev + transcription.charAt(i));
                i++;
                if (i >= transcription.length) clearInterval(interval);
            }, 20); // Speed of typing
            return () => clearInterval(interval);
        }
    }, [transcription]);

    const handleStartRecording = async () => {
        startSound.current?.play().catch(() => { });
        await startRecording();
    };

    const handleStop = () => {
        stopSound.current?.play().catch(() => { });
        stopRecording();
        setTimeout(() => setIsProcessing(true), 100);
    };

    const processAudio = async (blob: Blob) => {
        try {
            const formData = new FormData();
            const extension = mimeType.includes("mp4") ? "mp4" : "webm";
            formData.append("audio", blob, `recording.${extension}`);

            const response = await axios.post(webhookUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            let text = "";
            if (typeof response.data === 'string') text = response.data;
            else if (response.data.text) text = response.data.text;
            else if (response.data.transcription) text = response.data.transcription;
            else if (response.data.output) text = response.data.output;
            else text = JSON.stringify(response.data, null, 2);

            setTranscription(text);
            successSound.current?.play().catch(() => { });
        } catch (err) {
            console.error("Upload failed", err);
            setTranscription(`Error: Failed to connect to N8N. \n${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (isProcessing && audioBlob && !transcription) {
            processAudio(audioBlob);
        }
    }, [isProcessing, audioBlob, transcription]);

    const handleCopy = () => {
        if (!transcription) return;
        navigator.clipboard.writeText(transcription);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">

            {/* Settings Toggle */}
            <div className="flex justify-end mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="text-gray-text hover:text-primary gap-2"
                >
                    <Settings className="w-4 h-4" />
                    {isSettingsOpen ? "Hide Config" : "Configure Webhook"}
                </Button>
            </div>

            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="bg-gray-dark border border-gray-medium rounded-xl p-4 flex gap-2 items-center">
                            <span className="text-sm text-gray-text whitespace-nowrap">Webhook URL:</span>
                            <input
                                type="text"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                className="flex-1 bg-black/50 border border-gray-medium rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-gray-dark border border-gray-medium rounded-3xl p-10 min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl transition-all">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <AnimatePresence mode="wait">
                    {/* IDLE STATE */}
                    {!isRecording && !isProcessing && !transcription && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <div className="relative group cursor-pointer" onClick={handleStartRecording}>
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                                <div className="w-28 h-28 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 shadow-[0_0_40px_rgba(255,215,0,0.3)]">
                                    <Mic className="w-12 h-12 text-black" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl text-white font-bold tracking-tight">Tap to Speak</h3>
                                <p className="text-gray-text font-light">Your voice will be transcribed instantly</p>
                            </div>
                        </motion.div>
                    )}

                    {/* RECORDING STATE */}
                    {isRecording && (
                        <motion.div
                            key="recording"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-10 w-full"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 text-red-500 animate-pulse">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Recording</span>
                                </div>
                                <div className="text-6xl font-mono text-white font-light tracking-wider tabular-nums">
                                    {formatTime(recordingTime)}
                                </div>
                            </div>

                            {/* Minimalist Waveform */}
                            <div className="flex items-center gap-1.5 h-16">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 bg-gradient-to-t from-primary/50 to-primary rounded-full"
                                        animate={{ height: ["20%", "100%", "20%"] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.5 + Math.random() * 0.5,
                                            ease: "easeInOut",
                                            delay: i * 0.05,
                                        }}
                                    />
                                ))}
                            </div>

                            <Button
                                onClick={handleStop}
                                size="lg"
                                className="rounded-full px-10 h-14 bg-red-600/90 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                            >
                                <Square className="w-5 h-5 mr-2 fill-current" /> Stop Recording
                            </Button>
                        </motion.div>
                    )}

                    {/* PROCESSING STATE */}
                    {isProcessing && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                            </div>
                            <p className="text-xl text-white font-light animate-pulse">Transcribing...</p>
                        </motion.div>
                    )}

                    {/* RESULT STATE */}
                    {transcription && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full h-full flex flex-col max-w-2xl"
                        >
                            <div className="flex-1 min-h-[200px] mb-8 relative">
                                {/* Typewriter Text Area */}
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-xl md:text-2xl text-gray-100 leading-relaxed font-light text-right" dir="auto">
                                        {displayedText}
                                        <span className="inline-block w-1 h-6 ml-1 align-middle bg-primary animate-pulse" />
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-gray-medium/30">
                                <Button
                                    onClick={() => {
                                        resetRecording();
                                        setTranscription(null);
                                        setDisplayedText("");
                                    }}
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" /> New Recording
                                </Button>

                                <Button
                                    onClick={handleCopy}
                                    className="bg-primary hover:bg-primary-dark text-black px-8 h-12 rounded-full font-bold shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all active:scale-95"
                                >
                                    {isCopied ? (
                                        <>
                                            <Check className="w-5 h-5 mr-2" /> Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5 mr-2" /> Copy Text
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
