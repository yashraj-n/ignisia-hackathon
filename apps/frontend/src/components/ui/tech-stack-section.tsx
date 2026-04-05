"use client";

import { motion } from "framer-motion";
import { Cpu, Cloud, Zap, Globe } from "lucide-react";

const techItems = [
  {
    category: "AI / LLM",
    items: [
      { name: "Gemini 2.5 Pro", desc: "Advanced reasoning & document generation" },
      { name: "Gemini 2.5 Flash", desc: "Fast retrieval & competitive analysis" },
      { name: "LangChain", desc: "Agent orchestration framework" },
      { name: "LangGraph", desc: "Multi-step agentic workflows" },
    ],
    icon: <Cpu className="w-6 h-6 text-[#D4AF37]" />,
    gradient: "from-amber-500/15",
  },
  {
    category: "Backend & Cloud",
    items: [
      { name: "Fastify Node.js", desc: "High-performance API server" },
      { name: "Prisma ORM", desc: "Type-safe database access" },
      { name: "MongoDB Atlas", desc: "Vector search & document storage" },
      { name: "Cloudflare Workers", desc: "Edge email ingestion pipeline" },
    ],
    icon: <Cloud className="w-6 h-6 text-violet-400" />,
    gradient: "from-violet-500/15",
  },
  {
    category: "Frontend",
    items: [
      { name: "React", desc: "Latest concurrent rendering" },
      { name: "TanStack Router", desc: "Type-safe file-based routing" },
      { name: "Framer Motion", desc: "Production-grade animations" },
      { name: "Tailwind CSS", desc: "Utility-first styling" },
    ],
    icon: <Globe className="w-6 h-6 text-cyan-400" />,
    gradient: "from-cyan-500/15",
  },
];

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-28 px-6 relative z-10 bg-[#030303] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-[#D4AF37]" />
            Built for Scale
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Powered by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200">
              cutting-edge
            </span>{" "}
            tech.
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light">
            Enterprise-grade architecture with the latest AI models, cloud infrastructure, and modern web technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techItems.map((category, ci) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.5, delay: ci * 0.15 }}
              className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${category.gradient} to-transparent opacity-30 z-0 pointer-events-none`} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                </div>

                <div className="space-y-5">
                  {category.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 mt-2 shrink-0" />
                      <div>
                        <p className="text-white font-medium text-sm">{item.name}</p>
                        <p className="text-white/35 text-xs font-light">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
