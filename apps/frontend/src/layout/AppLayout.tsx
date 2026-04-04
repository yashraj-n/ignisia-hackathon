
import Topnav from './Topnav';
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#030303] text-foreground selection:bg-[#D4AF37]/30 selection:text-white relative">
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
