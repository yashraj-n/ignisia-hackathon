import { Loader2 } from "lucide-react";

export default function DemoOne() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Loading demo
        </h1>
        <div className="flex justify-center">
          <Loader2 className="h-10 w-10 text-amber-400 animate-spin" aria-hidden />
        </div>
      </div>
    </div>
  );
}