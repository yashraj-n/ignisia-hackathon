import { ShaderAnimation } from "./components/ui/shader-lines";

export default function DemoOne() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-black m-0 p-0 text-white">
      <ShaderAnimation/>
      <span className="pointer-events-none z-10 text-center text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap text-white">
        Shader Lines
      </span>
    </div>
  )
}
