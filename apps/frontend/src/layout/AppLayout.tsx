
import Topnav from './Topnav';
import { ShapeLandingHero } from '../components/ui/shape-landing-hero';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground selection:bg-[#D4AF37]/30 selection:text-white relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <ShapeLandingHero />
      </div>
      <div className="relative z-10 flex h-full w-full">
        <div className="flex flex-col flex-1 min-w-0 bg-transparent">
          <Topnav />
          <main className="flex-1 overflow-auto relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
