"use client";

import { motion } from "framer-motion";
import { Bot, Brain, Search, FileText, Shield } from "lucide-react";

const agents = [
  {
    name: "Parser Agent",
    model: "Gemini 2.5 Pro",
    description:
      "Breaks down any RFP document — regardless of length, format, or complexity — into structured, actionable requirement blocks. Extracts deliverables, compliance criteria, and hidden constraints automatically.",
    icon: <FileText className="w-7 h-7" />,
    color: "from-emerald-500/20 to-emerald-900/5",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    tag: "Document Intelligence",
  },
  {
    name: "Inventory RAG Agent",
    model: "Gemini 2.5 Flash",
    description:
      "Scans your entire company knowledge base, past proposals, and inventory using Retrieval-Augmented Generation. Surfaces the most relevant past wins and verified specifications for every requirement.",
    icon: <Search className="w-7 h-7" />,
    color: "from-violet-500/20 to-violet-900/5",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    tag: "RAG Pipeline",
  },
  {
    name: "Competitor Intel Agent",
    model: "Gemini 2.5 Flash",
    description:
      "Analyzes competitor pricing strategies, strengths, and weaknesses from your uploaded competitor data. Generates actionable pricing recommendations and differentiation points for every bid.",
    icon: <Shield className="w-7 h-7" />,
    color: "from-rose-500/20 to-rose-900/5",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-400",
    tag: "Competitive Analysis",
  },
  {
    name: "Summariser Agent",
    model: "Gemini 2.5 Pro",
    description:
      "Synthesizes parsed requirements, inventory matches, and competitor insights into a unified pricing summary with multiple strategic options per line item for human review.",
    icon: <Brain className="w-7 h-7" />,
    color: "from-amber-500/20 to-amber-900/5",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    tag: "Decision Intelligence",
  },
  {
    name: "Document Generator Agent",
    model: "Gemini 2.5 Pro",
    description:
      "Produces fully-formatted, compliance-ready RFP response documents with your company branding, pricing tables, and executive summaries — exported as professional PDF proposals.",
    icon: <Bot className="w-7 h-7" />,
    color: "from-cyan-500/20 to-cyan-900/5",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    tag: "Auto-Generation",
  },
];

export function AIAgentsShowcase() {
  return (
    <section id="ai-agents" className="py-28 px-6 relative z-10 bg-[#030303] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-sm font-medium mb-6">
            <Bot className="w-4 h-4" />
            Agentic Architecture
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            5 Specialized AI Agents.{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200">
              One Unified Pipeline.
            </span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light">
            Each agent is purpose-built for a specific stage of the RFP lifecycle, powered by Google's latest Gemini models.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border border-white/5 bg-white/[0.02] p-7 backdrop-blur-md shadow-xl overflow-hidden group hover:border-white/10 transition-all duration-300 ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
            >
              <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${agent.color} opacity-30 z-0 pointer-events-none group-hover:opacity-50 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${agent.iconBg} border flex items-center justify-center ${agent.iconColor}`}>
                    {agent.icon}
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 font-medium">
                    {agent.tag}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-1.5">{agent.name}</h3>
                <p className="text-xs text-[#D4AF37]/80 font-mono mb-4">
                  Powered by {agent.model}
                </p>
                <p className="text-white/45 text-sm leading-relaxed font-light">
                  {agent.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
