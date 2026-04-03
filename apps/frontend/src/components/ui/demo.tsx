import { AiLoader } from "@/components/ui/ai-loader";

export default function DemoOne() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          AI Loader Demo
        </h1>
        <AiLoader />
      </div>
    </div>
  );
}