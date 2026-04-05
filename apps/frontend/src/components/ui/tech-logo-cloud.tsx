import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import {
  Bot,
  Zap,
  Workflow,
  Terminal,
  Database,
  Cloud,
  Globe,
  ChevronRight,
  Layers,
  Layout,
  Palette,
  Shield,
  Server,
  Code2,
  Box,
  Wind
} from 'lucide-react';

const technologies = [
  { name: "Gemini 2.5 Pro", icon: Bot },
  { name: "Gemini 2.5 Flash", icon: Zap },
  { name: "LangChain", icon: Workflow },
  { name: "LangGraph", icon: Terminal },
  { name: "Fastify", icon: Zap },
  { name: "Prisma", icon: Database },
  { name: "MongoDB Atlas", icon: Database },
  { name: "Cloudflare", icon: Cloud },
  { name: "React 19", icon: Globe },
  { name: "TanStack", icon: ChevronRight },
  { name: "Tailwind CSS", icon: Wind },
  { name: "Bun", icon: Box },
  { name: "TypeScript", icon: Code2 },
  { name: "Node.js", icon: Server },
  { name: "Zod", icon: Shield },
  { name: "Vite", icon: Zap },
  { name: "Next.js", icon: Layout },
  { name: "Lucide", icon: Palette },
];

function TechIcon({ tech }: { tech: typeof technologies[0] }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const slug = useMemo(() => tech.name.toLowerCase().replace(/[^a-z0-9]/g, '-'), [tech.name]);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setStatus('loading');
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth > 0) setStatus('success');
      else setStatus('error');
    }
  }, [slug]);

  return (
    <div className="relative w-25 h-25 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
      <img
        key={slug}
        ref={imgRef}
        src={`/logos/${slug}.svg`}
        alt={tech.name}
        onLoad={() => setStatus('success')}
        onError={() => setStatus('error')}
        className={`w-full h-full object-contain transition-all duration-300 z-10 p-2 ${status === 'success' ? "opacity-100" : "opacity-0 absolute invisible"
          }`}
      />

      {status !== 'success' && (
        <tech.icon
          className={`w-14 h-14 transition-all duration-300 absolute inset-0 m-auto
            ${status === 'error'
              ? "text-[#D4AF37] opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              : "text-white/10 opacity-40 group-hover/item:text-[#D4AF37]/40 group-hover/item:opacity-60"
            }`}
        />
      )}
    </div>
  );
}

export function TechLogoCloud() {
  const controls = useAnimationControls();

  useEffect(() => {
    // Single start call ensures no "speed up" bugs on hydration/re-render
    controls.start({
      x: [0, -33.33 + "%"],
      transition: {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
      }
    });
  }, [controls]);

  return (
    <div className="w-full py-20 overflow-hidden bg-black/40 border-y border-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h3 className="text-xs font-bold text-center text-muted-foreground uppercase tracking-[0.5em] opacity-60">
          Powered by industry-leading technology
        </h3>
      </div>

      <div className="relative overflow-hidden py-12 bg-white/[0.03] border-y border-white/5">
        <motion.div
          className="flex w-max shrink-0 gap-16 sm:gap-24 lg:gap-32 px-16 will-change-transform"
          animate={controls}
        >
          {/* Trio for absolutely seamless loop on all screen widths */}
          {[0, 1, 2].map((setIndex) => (
            <div
              key={setIndex}
              className="flex items-center gap-16 sm:gap-24 lg:gap-32 shrink-0"
            >
              {technologies.map((tech, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="flex items-center gap-6 group/item transition-all duration-300"
                >
                  <TechIcon tech={tech} />
                  <span className="text-lg font-bold text-white/40 group-hover/item:text-white transition-colors whitespace-nowrap tracking-wider">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Thick Vignette Gradients for premium "Fade" look */}
        <div className="absolute inset-y-0 left-0 w-64 bg-linear-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-64 bg-linear-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
