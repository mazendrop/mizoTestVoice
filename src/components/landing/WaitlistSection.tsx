"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function WaitlistSection() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Mock submission
            setTimeout(() => setSubmitted(true), 1000);
        }
    };

    return (
        <section className="py-24 bg-primary/5 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto text-center space-y-8"
                >
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                        Join the Waitlist
                    </h2>
                    <p className="text-gray-text text-lg">
                        Be the first to experience the future of voice-to-text.
                        Get early access and special transcription quotas.
                    </p>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-md bg-gray-dark border border-gray-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button type="submit" size="lg" className="whitespace-nowrap">
                                Join Now <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gray-dark border border-green-500/30 text-green-400 p-6 rounded-xl flex flex-col items-center gap-3"
                        >
                            <CheckCircle2 className="w-12 h-12" />
                            <h3 className="text-xl font-bold">You're on the list!</h3>
                            <p className="text-sm text-gray-text">We'll notify you when we launch.</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
