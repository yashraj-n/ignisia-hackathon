import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import {

  ArrowRight,
} from 'lucide-react'

// Custom Components
import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import { AnimatedFeatureGrid } from '@/components/ui/animated-feature-grid'
import { HowItWorksScroll } from '@/components/ui/how-it-works-scroll'
import { PremiumFooter } from '@/components/ui/premium-footer'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-[#D4AF37]/30 overflow-hidden">
      <HeroGeometric
        title1="Win More Bids"
        title2="with AI."
      />
      <div className="absolute z-50 top-6 right-6 md:top-8 md:right-8">
        <Link to="/auth">
          <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-[#D4AF37] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] text-sm md:text-base cursor-pointer">
            Sign In / Get Started
          </button>
        </Link>
      </div>

      <AnimatedFeatureGrid />

      <HowItWorksScroll />

      <MetricsSection />

      <CTASection />

      <PremiumFooter />
    </div>
  )
}



function Counter({ value, suffix, text, delay = 0 }: { value: number, suffix: string, text: string, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: "-100px" })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 40, stiffness: 50 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        motionValue.set(value)
      }, delay * 1000)
    }
  }, [inView, motionValue, value, delay])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplay(Math.floor(latest))
    })
  }, [springValue])

  return (
    <div ref={ref} className="text-center p-8 relative flex flex-col items-center justify-center">
      <div className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-[#D4AF37]/70 mb-4 drop-shadow-sm flex items-center">
        {display}<span className="text-[#D4AF37] font-medium ml-1">{suffix}</span>
      </div>
      <p className="text-base md:text-lg text-gray-400 font-light tracking-wide uppercase">{text}</p>
    </div>
  )
}

function MetricsSection() {
  return (
    <section className="py-32 relative z-10 overflow-hidden border-y border-white/5 bg-[#030303]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 gap-y-12">
        <Counter value={3} suffix="x" text="Faster Pipeline" delay={0.1} />
        <Counter value={70} suffix="%" text="Manual Work Saved" delay={0.3} />
      </div>
    </section>
  )
}


function CTASection() {
  return (
    <section className="py-40 px-6 relative z-10 bg-[#030303]">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-5xl mx-auto rounded-[3rem] p-[1px] bg-gradient-to-b from-[#D4AF37]/40 via-white/5 to-transparent relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[#0A0A0A] rounded-[3rem] z-0 m-px backdrop-blur-3xl" />

        {/* Animated glow */}
        <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,#2a220b_0%,transparent_70%)] z-0 opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />

        <div className="relative z-10 p-16 md:p-32 text-center flex flex-col items-center">
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-12" />
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight leading-tight">
            Turn RFP Chaos Into <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37]">Winning Deals.</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mb-14 font-light leading-relaxed">
            Join the elite circle of enterprises closing faster, smarter, and with absolute precision. Stop writing, start winning.
          </p>
          <Link to="/auth">
            <button className="px-12 py-6 bg-white text-black font-semibold rounded-full hover:bg-[#D4AF37] transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] transform hover:scale-105 active:scale-95 text-xl flex items-center gap-3 cursor-pointer">
              Start Your First AI-Powered Bid <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}