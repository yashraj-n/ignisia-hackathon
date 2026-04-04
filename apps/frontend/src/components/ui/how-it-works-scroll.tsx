"use client";

import { motion } from "framer-motion";
import { FileDown, DatabaseZap, FileCheck2 } from "lucide-react";

const steps = [
    {
        id: "step-1",
        title: "1. Deconstruct",
        description:
            "Upload any RFP document—regardless of length or formatting complexity. BidForge's advanced local AI engines instantly parse the document, extracting core deliverables, compliance requirements, and hidden criteria into actionable data structures.",
        icon: <FileDown className="w-10 h-10 text-emerald-400" />,
        visualColor: "from-emerald-900/40 to-emerald-500/10",
        visualMockup: "Analyzing 400-page enterprise RFP...",
        visualMockupColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        barWidths: ["75%", "45%"],
    },
    {
        id: "step-2",
        title: "2. Sync Portfolio",
        description:
            "Our proprietary RAG (Retrieval-Augmented Generation) engine scans your entire organizational inventory. It matches current RFP queries against your historical wins, verified security postures, and past technical architectures.",
        icon: <DatabaseZap className="w-10 h-10 text-violet-400" />,
        visualColor: "from-violet-900/40 to-violet-500/10",
        visualMockup: "Retrieving 34 verified answers from Knowledge Base...",
        visualMockupColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
        barWidths: ["60%", "85%"],
    },
    {
        id: "step-3",
        title: "3. Auto-Draft & Review",
        description:
            "BidForge synthesizes the parsed requirements and your historical data into a highly compliant, cohesive draft response. Your team collaborates in real-time to refine the final output—slashing proposal turnaround by up to 70%.",
        icon: <FileCheck2 className="w-10 h-10 text-[#D4AF37]" />,
        visualColor: "from-amber-900/40 to-[#D4AF37]/20",
        visualMockup: "Proposal Generation Complete. Ready for human review.",
        visualMockupColor: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20",
        barWidths: ["90%", "70%"],
    },
];

function StepCard({ step }: { step: typeof steps[0] }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full rounded-[2rem] bg-[#0A0A0A] border border-white/10 relative overflow-hidden shadow-2xl"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${step.visualColor} opacity-50`} />
            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        {step.icon}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-28 bg-white/30 rounded-full" />
                        <div className="h-2 w-20 bg-white/20 rounded-full" />
                    </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-4">
                    {step.barWidths.map((width, i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <div className="w-5 h-5 rounded-md bg-white/10 shrink-0" />
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white/30 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.2 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status badge */}
                <div className="mt-8 pt-5 border-t border-white/10">
                    <p className={`text-sm text-center font-mono py-2.5 px-3 rounded-lg border ${step.visualMockupColor}`}>
                        {step.visualMockup}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export function HowItWorksScroll() {
    return (
        <section className="relative z-10 bg-[#030303] border-t border-white/5 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                {/* Section header */}
                <div className="mb-16">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-4">
                        Pipeline Acceleration
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        How BidForge <br />Works.
                    </h3>
                    <p className="text-gray-400 text-lg md:text-xl font-light max-w-md">
                        The most sophisticated architecture strictly engineered for winning enterprise bids.
                    </p>
                </div>

                {/* Steps — each is its own full-width row */}
                <div className="flex flex-col gap-24">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                        >
                            {/* Left: text */}
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                                    {step.icon}
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-white mb-4">{step.title}</h4>
                                    <p className="text-gray-400 leading-relaxed text-lg max-w-md font-light">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Right: card */}
                            <StepCard step={step} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}