"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, Database, PenTool, BarChart3 } from "lucide-react";

export function AnimatedFeatureGrid() {
    return (
        <section className="py-24 px-6 relative z-10 bg-[#030303] border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        The ultimate pipeline <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200">
                            acceleration engine.
                        </span>
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        Built symmetrically around your enterprise data to parse, write, and review bids at an unprecedented velocity.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: RFP Processing - Wide */}
                    <FeatureCard
                        className="md:col-span-2"
                        title="Intelligent RFP Processing"
                        description="Instantly upload and decompose monumental RFP documents into core requirements using localized AI extraction."
                        icon={<FileSearch className="w-8 h-8 text-[#D4AF37]" />}
                        gradient="from-[#D4AF37]/20 to-transparent"
                    />

                    {/* Card 2: Inventory RAG - Square */}
                    <FeatureCard
                        className="md:col-span-1"
                        title="Context-Aware Inventory"
                        description="Seamlessly syncs with your historic wins and knowledge base to guarantee every response matches your precise corporate standards."
                        icon={<Database className="w-8 h-8 text-[#D4AF37]" />}
                        gradient="from-indigo-500/20 to-transparent"
                    />

                    {/* Card 3: Drafting - Square */}
                    <FeatureCard
                        className="md:col-span-1"
                        title="Auto-Draft Generation"
                        description="Generate fully-compliant, high-fidelity draft responses in seconds, featuring human-in-the-loop review architecture."
                        icon={<PenTool className="w-8 h-8 text-[#D4AF37]" />}
                        gradient="from-rose-500/20 to-transparent"
                    />

                    {/* Card 4: Analytics - Wide */}
                    <FeatureCard
                        className="md:col-span-2"
                        title="Performance Analytics"
                        description="Centralize your proposal metrics. Track win rates, ROI, and pipeline acceleration across your entire bidding process."
                        icon={<BarChart3 className="w-8 h-8 text-[#D4AF37]" />}
                        gradient="from-emerald-500/20 to-transparent"
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({
    title,
    description,
    icon,
    className,
    gradient,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
    gradient?: string;
}) {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 md:p-10 backdrop-blur-md shadow-2xl ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 rounded-3xl"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(212,175,55,.15), transparent 40%)`,
                }}
            />

            <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${gradient} opacity-20 z-0 pointer-events-none`} />

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/10 shadow-inner">
                    {icon}
                </div>
                
                <div className="mt-auto">
                    <h3 className="mb-3 text-2xl font-semibold tracking-tight text-white">
                        {title}
                    </h3>
                    <p className="text-white/50 leading-relaxed font-light">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
