import Sidebar from './Sidebar';
import Topnav from './Topnav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground selection:bg-[#D4AF37]/30 selection:text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topnav />
        <main className="flex-1 overflow-auto bg-background/50 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
