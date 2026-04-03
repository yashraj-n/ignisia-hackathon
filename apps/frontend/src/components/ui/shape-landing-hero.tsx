import { motion } from "framer-motion";

export function ShapeLandingHero() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 top-0 h-[500px] w-full bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[80px]"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[50%] right-[10%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[60px]"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 60, -60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Structural subtle grid behind */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      <div className="absolute inset-0 z-0">
         {/* The user requested hiding title/subtitle which originally existed here in a typical hero. It's fully structural now. */}
      </div>
    </div>
  );
}
