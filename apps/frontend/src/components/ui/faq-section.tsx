"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "What is BidForge and how does it work?",
    answer:
      "BidForge is an AI-powered RFP (Request for Proposal) response automation platform. It uses a pipeline of 5 specialized AI agents to parse incoming RFP documents, search your company's knowledge base, analyze competitor pricing, generate strategic pricing summaries, and produce fully-formatted, compliant proposal PDFs — all with minimal human intervention.",
  },
  {
    question: "How does the email integration work?",
    answer:
      "BidForge connects to your company email via Cloudflare Workers. When an RFP arrives as an email attachment, our system automatically queues it for processing through RabbitMQ. The Parser Agent extracts and structures the document, and the full pipeline runs automatically — notifying you when a draft is ready for review.",
  },
  {
    question: "What AI models does BidForge use?",
    answer:
      "BidForge leverages Google's latest Gemini 2.5 Pro and Gemini 2.5 Flash models through LangChain and LangGraph orchestration. Pro handles complex reasoning tasks like document parsing and final generation, while Flash handles rapid retrieval and competitive analysis with lower latency.",
  },
  {
    question: "How does the Inventory RAG system work?",
    answer:
      "When you upload your company's past proposals, technical specifications, and product catalogs, BidForge generates vector embeddings and stores them in MongoDB Atlas. When a new RFP arrives, the RAG agent performs semantic search across your entire knowledge base to find the most relevant matches for every requirement — ensuring accurate, consistent responses.",
  },
  {
    question: "Can I review and edit proposals before sending?",
    answer:
      "Absolutely. BidForge follows a human-in-the-loop architecture. After the AI agents generate pricing options and draft responses, you review the Summariser output, select preferred pricing strategies for each line item, and then trigger final document generation. The system never sends anything without your explicit approval.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. All documents are stored in encrypted Amazon S3 buckets. Authentication uses JWT tokens with secure password hashing. Your company data is isolated — no cross-tenant access is possible. The AI processing happens through secure API calls to Google's Gemini models with enterprise-grade SLAs.",
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: typeof faqData[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="border-b border-white/5 last:border-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 px-2 text-left cursor-pointer group"
      >
        <span className="text-lg font-medium text-white/90 group-hover:text-white transition-colors pr-8">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 px-2 text-white/40 leading-relaxed font-light">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 px-6 relative z-10 bg-[#030303] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
            Common Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Frequently asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200">
              questions.
            </span>
          </h2>
        </motion.div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8 backdrop-blur-md">
          {faqData.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
