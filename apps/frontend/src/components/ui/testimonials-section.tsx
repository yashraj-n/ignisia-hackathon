"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "VP of Sales, Nexus Systems",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 5,
    text: "BidForge cut our RFP turnaround from 2 weeks to 3 days. The AI agents accurately pulled from our 500+ past proposals — no more copy-paste marathons. Our win rate jumped 40% in Q3.",
  },
  {
    name: "David Chen",
    role: "Head of Operations, Prism Tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 5,
    text: "The competitor analysis agent is a game-changer. It identified pricing gaps we'd been missing for years. We now bid with surgical precision — every proposal is strategically priced.",
  },
  {
    name: "Maria Rodriguez",
    role: "Director of Business Dev, Apex Corp",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 5,
    text: "We process 50+ RFPs a month. Before BidForge, we'd reject half just due to capacity. Now our AI pipeline handles parsing and drafting, and our team focuses on strategy and client relationships.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/10"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 px-6 relative z-10 bg-[#030303] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-medium mb-6">
            <Quote className="w-4 h-4 text-[#D4AF37]" />
            Customer Stories
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200">
              winning teams.
            </span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light">
            See how enterprises are closing deals faster with AI-powered proposal automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-7 backdrop-blur-md overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#D4AF37]/5 to-transparent opacity-30 z-0 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Rating */}
                <div className="mb-5">
                  <StarRating rating={t.rating} />
                </div>

                {/* Quote */}
                <p className="text-white/60 text-sm leading-relaxed font-light flex-1 mb-6">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto pt-5 border-t border-white/5 ">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-white/35 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
