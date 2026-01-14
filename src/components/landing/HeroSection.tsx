"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import VoiceRecorder from "@/components/recorder/VoiceRecorder";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
            {/* Background Gradient Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 max-w-3xl"
                >


                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-tight text-white mb-6">
                        Capture Your <br />
                        <span className="text-primary font-bold italic">Thoughts</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-[500px] mx-auto font-light leading-relaxed">
                        Effortless transcription. Professional accuracy. <br />
                        Secure and instant processing for your voice.
                    </p>
                </motion.div>

                {/* Recorder Component */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full max-w-3xl z-10"
                >
                    <VoiceRecorder />
                </motion.div>

                {/* Decorative Waveforms underneath */}
                <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 opacity-10 pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-4 bg-primary rounded-t-sm"
                            initial={{ height: 20 }}
                            animate={{ height: [20, 100, 40, 120, 20] }}
                            transition={{
                                repeat: Infinity,
                                duration: 2 + Math.random(),
                                ease: "easeInOut",
                                delay: i * 0.05
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
