import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import {
  FileText,
  Brain,
  Database,
  LineChart,
  Users,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Quote,
  ArrowRight,
  Sparkles
} from 'lucide-react'

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
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans selection:bg-[#D4AF37]/30 overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <CarouselSection />
      <SocialProofSection />
      <MetricsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const glowY = useTransform(scrollY, [0, 500], [0, -150])

  return (
    <section className="relative h-[100svh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background grid/glow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        <motion.div style={{ y, opacity }} className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none"></motion.div>
        <motion.div style={{ y: glowY, opacity }} className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none"></motion.div>
        
        {/* Floating golden light streaks */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[2px] h-[150px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent rotate-45 blur-[1px]"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 50, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-[2px] h-[200px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent -rotate-45 blur-[1px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 backdrop-blur-md mb-8 cursor-default"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-medium tracking-wide text-gray-300">BidForge Intelligence Framework 2.0</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
        >
          Win More Bids <br className="hidden md:block" /> with <span className="text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">AI.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
        >
          AI-powered RFP intelligence that drafts, analyzes, and optimizes your responses in minutes. Set a new standard for luxury and performance.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/auth">
            <button className="group relative px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(212,175,55,0.4)]">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center gap-2 text-lg">
                Start Winning Bids <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          <Link to="/auth">
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-white font-medium rounded-2xl transition-all duration-300 hover:bg-white/10 backdrop-blur-md text-lg">
              See Demo
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

const features = [
  { icon: FileText, title: "AI RFP Parsing", desc: "Instantly decompose complex RFPs into actionable requirements." },
  { icon: Brain, title: "Auto Proposal Drafting", desc: "Generate highly compelling, compliant responses in seconds." },
  { icon: Database, title: "Knowledge Base Integration", desc: "Syncs with your historic wins to emulate your brand voice exactly." },
  { icon: LineChart, title: "Bid Scoring Intelligence", desc: "Predict win probabilities and identify key areas of improvement." },
  { icon: Users, title: "Team Collaboration", desc: "Real-time multiplayer editing and workflow approvals." },
  { icon: ShieldCheck, title: "Compliance Automation", desc: "Ensure every clause and mandate is robustly addressed." },
]

function FeatureCard({ feature, index }: { feature: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${(y - centerY) / -20}deg) rotateY(${(x - centerX) / 20}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent transition-all duration-500 hover:from-[#D4AF37]/50 will-change-transform"
      style={{ transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }}
    >
      <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-3xl pointer-events-none" />
      <div className="relative h-full bg-[#0A0A0A]/90 backdrop-blur-xl p-8 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-start border border-white/5 group-hover:border-[#D4AF37]/20 transition-colors">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-colors duration-500">
          <feature.icon className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-500" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  )
}

function FeaturesSection() {
  return (
    <section className="py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Unfair Advantage <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-200">Built-In.</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg md:text-xl font-light">Equip your team with an arsenal of capabilities designed exclusively for top-tier enterprise deals.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  )
}

const carouselItems = [
  { title: "AI RFP Analyzer", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000", desc: "Breakdown complex documents instantly." },
  { title: "Smart Proposal Builder", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000", desc: "Auto-generate winning content blocks." },
  { title: "Knowledge Engine", img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1000", desc: "Search past wins natively." },
  { title: "Analytics Dashboard", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000", desc: "Monitor win rates dynamically." },
]

function CarouselSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-32 overflow-hidden relative border-t border-white/5 bg-gradient-to-b from-transparent to-[#050505]">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
        <motion.div
           initial={{ opacity: 0, x: -40 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">The Platform of <br/><span className="text-[#D4AF37]">Champions.</span></h2>
          <p className="text-gray-400 max-w-lg text-lg font-light">Experience unprecedented control and visibility over your entire bidding lifecycle.</p>
        </motion.div>
        <motion.div 
           initial={{ opacity: 0, x: 40 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="hidden md:flex gap-4"
        >
          <button onClick={() => setActive(Math.max(0, active - 1))} className="p-4 rounded-full border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-all text-white"><ChevronLeft className="w-6 h-6"/></button>
          <button onClick={() => setActive(Math.min(carouselItems.length - 1, active + 1))} className="p-4 rounded-full border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-all text-white"><ChevronRight className="w-6 h-6"/></button>
        </motion.div>
      </div>

      <div className="pl-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2))] flex gap-6 overflow-x-auto pb-16 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {carouselItems.map((item, idx) => (
          <motion.div 
            key={idx}
            className={`flex-none w-[85vw] md:w-[60vw] lg:w-[45vw] snap-center rounded-[2.5rem] p-[1px] ${active === idx ? 'bg-gradient-to-b from-[#D4AF37] to-white/5 shadow-[0_0_50px_-12px_rgba(212,175,55,0.3)]' : 'bg-gradient-to-b from-white/10 to-transparent opacity-60 hover:opacity-100'} transition-all duration-700 cursor-pointer`}
            onClick={() => setActive(idx)}
          >
            <div className="bg-[#080808] h-full rounded-[2.5rem] p-4 lg:p-8 overflow-hidden relative group backdrop-blur-3xl">
              <div className="relative h-[300px] md:h-[450px] w-full rounded-[1.5rem] overflow-hidden mb-8 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60 group-hover:opacity-20 transition-opacity duration-700" />
                <img src={item.img} alt={item.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 blur-[2px] group-hover:blur-0" />
              </div>
              <h4 className={`text-3xl font-bold mb-3 transition-colors duration-500 ${active === idx ? 'text-white' : 'text-gray-400'}`}>{item.title}</h4>
              <p className="text-gray-500 text-lg font-light">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

const companies = ["META", "STRIPE", "MICROSOFT", "HUBSPOT", "ORACLE"]

function SocialProofSection() {
  return (
    <section className="py-32 relative bg-[#0B0B0B]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm font-semibold tracking-widest text-gray-500 uppercase mb-16">Trusted by Forward-Thinking Enterprises</p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 mb-32">
          {companies.map((c, i) => (
            <motion.span 
              key={c} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-3xl font-black text-gray-400 hover:text-[#D4AF37] transition-all duration-300 cursor-default"
            >
              {c}
            </motion.span>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -5 }}
            className="p-10 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group backdrop-blur-md"
          >
            <div className="absolute top-0 left-0 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <Quote className="w-12 h-12 text-[#D4AF37]/30 mb-8 transform group-hover:scale-110 group-hover:text-[#D4AF37]/50 transition-all duration-500" />
            <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light mb-10">"BidForge reduced our proposal turnaround by 60%. The AI precision feels entirely bespoke to our corporate tone."</p>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-tr from-[#D4AF37] to-gray-800 rounded-full" />
              <div>
                <p className="font-semibold text-white text-lg">Sarah Jenkins</p>
                <p className="text-sm text-[#D4AF37]">VP Sales, TechCorp</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="p-10 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group backdrop-blur-md"
          >
            <div className="absolute top-0 right-0 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <Quote className="w-12 h-12 text-[#D4AF37]/30 mb-8 transform group-hover:scale-110 group-hover:text-[#D4AF37]/50 transition-all duration-500" />
            <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light mb-10">"It's like having an entire legal and writing team instantaneously available. An absolute game changer for our RFPs."</p>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-tr from-gray-600 to-gray-800 rounded-full" />
              <div>
                <p className="font-semibold text-white text-lg">David Chen</p>
                <p className="text-sm text-[#D4AF37]">Director of Bids, InnovateInc</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Counter({ value, suffix, text, delay = 0 }: { value: number, suffix: string, text: string, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
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
    <section className="py-32 relative z-10 overflow-hidden border-y border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 gap-y-12">
        <Counter value={3} suffix="x" text="Faster Pipeline" delay={0.1} />
        <Counter value={70} suffix="%" text="Manual Work Saved" delay={0.3} />
        <Counter value={500} suffix="+" text="Companies Onboarded" delay={0.5} />
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-40 px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-5xl mx-auto rounded-[3rem] p-[1px] bg-gradient-to-b from-[#D4AF37]/40 via-white/5 to-transparent relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[#0A0A0A] rounded-[3rem] z-0 m-px backdrop-blur-3xl" />
        
        {/* Animated glow */}
        <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,#2a220b_0%,transparent_70%)] z-0 opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
        
        <div className="relative z-10 p-16 md:p-32 text-center flex flex-col items-center">
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-12" />
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight leading-tight">
            Turn RFP Chaos Into <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37]">Winning Deals.</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mb-14 font-light leading-relaxed">
            Join the elite circle of enterprises closing faster, smarter, and with absolute precision. Stop writing, start winning.
          </p>
          <Link to="/auth">
            <button className="px-12 py-6 bg-white text-black font-semibold rounded-full hover:bg-[#D4AF37] transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] transform hover:scale-105 active:scale-95 text-xl flex items-center gap-3">
              Start Your First AI-Powered Bid <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050505] pt-20 pb-10 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,#D4AF37_0%,transparent_40%)] opacity-5" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-700 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <span className="text-black font-black text-lg">B</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">BidForge</span>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 text-base text-gray-400 font-light">
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Product</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Solutions</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Pricing</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Company</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Contact</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 font-light gap-4 relative z-10">
        <p>© 2026 BidForge AI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
