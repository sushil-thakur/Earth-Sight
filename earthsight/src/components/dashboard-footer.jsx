export function DashboardFooter() {
  return (
    <footer className="relative border-t border-slate-800/50 backdrop-blur-xl bg-slate-950/80 mt-20">
      <div className="absolute inset-x-0 top-0 h-[2px] animate-rgb-line"></div>
      <div className="container mx-auto px-6 py-10">
        <p className="text-center text-sm text-slate-400">
          © 2025{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent font-bold">
            EarthSight
          </span>{" "}
          • Powered by Advanced Machine Learning & AI
        </p>
      </div>
    </footer>
  )
}