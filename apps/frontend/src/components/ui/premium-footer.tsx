import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const contributors = [
  {
    name: "Ashish Sharma",
    github: "https://github.com/ASHISH9925",
    linkedin: "https://www.linkedin.com/in/ashish-sharma9925/",
    instagram: "https://www.instagram.com/_adamantium_claw_/",
    email: "ashish992005@gmail.com",
    // Stylish, confident, clean look
    avatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=AshishS&top=theCaesarAndSidePart&topProbability=100&facialHairProbability=0&clothing=blazerAndShirt&clothesColor=25557c&skinColor=d08b5b&hairColor=2c1b18&eyes=wink&eyebrows=raisedExcited&mouth=smile&accessoriesProbability=0&backgroundColor=b6e3f4",
  },
  {
    name: "Dhiraj Rajput",
    github: "https://github.com/dhiraj-rajput",
    linkedin: "https://www.linkedin.com/in/dhiraj-rajput-",
    instagram: "https://www.instagram.com/dhiraj_rajput_10/",
    email: "rajputdhiraj1010@gmail.com",
    // Chill hoodie dev vibe
    avatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=DhirajR&top=shortWaved&topProbability=100&facialHair=beardLight&facialHairProbability=60&facialHairColor=2c1b18&clothing=hoodie&clothesColor=5199e4&skinColor=c68642&hairColor=2c1b18&eyes=happy&eyebrows=defaultNatural&mouth=smile&accessoriesProbability=0&backgroundColor=ffd5dc",
  },
  {
    name: "Sushant Kumar",
    github: "https://github.com/rsk807",
    linkedin: "https://www.linkedin.com/in/sushant-kumar-csf/",
    instagram: "https://www.instagram.com/_rana_sushant_kumar_singh_/",
    email: "ranasushant807@gmail.com",
    // Smart, clean, slight nerd vibe (young, not old)
    avatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=SushantK&top=shortFlat&topProbability=100&facialHairProbability=0&clothing=shirtCrewNeck&clothesColor=3d5afe&skinColor=d08b5b&hairColor=2c1b18&eyes=default&eyebrows=defaultNatural&mouth=smile&accessories=prescription01&accessoriesProbability=100&accessoriesColor=3d5afe&backgroundColor=e0e7ff",
  },
  {
    name: "Yashraj Narke",
    github: "https://github.com/yashraj-n",
    linkedin: "https://www.linkedin.com/in/yashraj-narke/",
    instagram: "https://www.instagram.com/yashraj_narke/",
    email: "ynnarke52@gmail.com",
    // Clean, young, curly hair, no beard
    avatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=YashrajSimple&top=shortCurly&topProbability=100&facialHairProbability=0&clothing=shirtCrewNeck&clothesColor=ff6f61&skinColor=c68642&hairColor=2c1b18&eyes=default&eyebrows=defaultNatural&mouth=smile&accessoriesProbability=0&backgroundColor=ffe0b2",
  },
];

export function PremiumFooter() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (email: string, name: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(name);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <footer className="relative bg-[#020202] pt-32 pb-12 overflow-hidden border-t border-white/10">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-1/4 w-[400px] h-[300px] bg-[#D4AF37]/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Pre-Footer CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-16 border-b border-white/10 gap-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Start winning with <span className="text-[#D4AF37]">BidForge.</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              Join the future of enterprise bidding. Secure, accurate, and completely autonomous RFP generation.
            </p>
          </div>
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg cursor-pointer hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-shadow duration-300"
            >
              Get Started Now
              <ArrowUpRight className="w-5 h-5 opacity-70" />
            </motion.button>
          </Link>
        </div>

        {/* Creators Section */}
        <div className="mb-16 pb-16 border-b border-white/10">
          <h4 className="text-[#D4AF37] font-bold text-lg mb-8 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            Meet the Creators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributors.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/5 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group flex flex-col"
              >
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <img src={c.avatar} alt={c.name} className="w-20 h-20 rounded-full bg-white/10 shadow-lg ring-2 ring-white/5" />
                  <div>
                    <p className="text-white text-base font-bold">{c.name}</p>
                    {c.email ? (
                      <button
                        onClick={() => handleCopy(c.email, c.name)}
                        className="text-white/40 text-xs hover:text-[#D4AF37] transition-colors block mt-1 cursor-pointer"
                        title={`Copy ${c.name}'s email`}
                      >
                        {copiedId === c.name ? (
                          <span className="text-[#D4AF37] font-bold">Copied!</span>
                        ) : (
                          c.email
                        )}
                      </button>
                    ) : (
                      <span className="text-white/20 text-[10px] block mt-0.5">Contact via Socials</span>
                    )}
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-center gap-4 pt-2">
                  <a href={c.github} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="GitHub">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.003-.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                  <a href={c.linkedin} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#0a66c2] transition-colors" title="LinkedIn">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href={c.instagram} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#E1306C] transition-colors" title="Instagram">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 font-light text-sm">
            © {new Date().getFullYear()} BidForge AI. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
