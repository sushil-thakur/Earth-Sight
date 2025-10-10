import { Brain } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-950/80">
      <div className="absolute inset-x-0 bottom-0 h-[2px] animate-rgb-line"></div>
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-2xl shadow-indigo-500/50">
              <div className="absolute inset-0 rounded-2xl animate-rgb-border-slow opacity-50"></div>
              <Brain className="w-8 h-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                EarthSight
              </h1>
              <p className="text-sm text-indigo-300 font-medium">AI-Powered Real Estate Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-sm text-emerald-400 font-bold">AI ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  )
}