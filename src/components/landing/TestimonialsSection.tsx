"use client";

import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Ahmed Ali",
        role: "Marketing Director",
        quote: "Mezo Voice has transformed how I take meeting notes. The accuracy in Arabic is just impressive.",
        initial: "A"
    },
    {
        name: "Sarah Jones",
        role: "Journalist",
        quote: "Fastest transcription tool I've used. It saves me hours of manual work every week.",
        initial: "S"
    },
    {
        name: "Mohamed R.",
        role: "Student",
        quote: "The interface is sleek and easy to use. I love the dark mode design!",
        initial: "M"
    }
];

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-black border-y border-gray-medium/50">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
                    Loved by <span className="text-primary">Professionals</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="bg-gray-dark p-8 rounded-2xl relative"
                        >
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold text-xl text-black border-4 border-black">
                                {t.initial}
                            </div>
                            <p className="mt-4 text-gray-300 italic mb-6">"{t.quote}"</p>
                            <div>
                                <h4 className="font-bold text-white">{t.name}</h4>
                                <p className="text-sm text-gray-text">{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
