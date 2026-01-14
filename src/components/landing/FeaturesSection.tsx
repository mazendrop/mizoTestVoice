"use client";

import { motion } from "framer-motion";
import { Mic, Zap, Shield, Globe } from "lucide-react";

const features = [
    {
        icon: <Zap className="w-6 h-6 text-primary" />,
        title: "Lighting Fast",
        description: "Real-time processing ensures your text is ready almost instantly after you speak."
    },
    {
        icon: <Globe className="w-6 h-6 text-primary" />,
        title: "Multi-Language",
        description: "Support for Arabic and English with high-accuracy dialect recognition."
    },
    {
        icon: <Mic className="w-6 h-6 text-primary" />,
        title: "High Accuracy",
        description: "Powered by advanced AI models to capture every nuance of your speech."
    },
    {
        icon: <Shield className="w-6 h-6 text-primary" />,
        title: "Secure & Private",
        description: "Your data is encrypted and we do not store your voice recordings permanently."
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-black">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Why Mezo Voice?</h2>
                    <p className="text-gray-text max-w-2xl mx-auto">
                        Experience the next generation of voice technology designed for professionals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="p-6 rounded-xl bg-gray-dark border border-gray-medium hover:border-primary/50 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gray-medium flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-text leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
