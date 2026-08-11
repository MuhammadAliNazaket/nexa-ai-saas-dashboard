import React from "react";
import { Cpu, Terminal, ShieldCheck, Zap, Sparkles, ExternalLink } from "lucide-react";

interface HeaderProps {
  onOpenPlayground: () => void;
  activeKeyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPlayground, activeKeyCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/80 border border-white/20 flex items-center justify-center text-white shadow-lg font-semibold tracking-tight backdrop-blur-md">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">NexaAI</span>
              <span className="text-[11px] font-mono font-medium uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Developer Studio
              </span>
            </div>
            <p className="text-xs text-gray-400 font-normal hidden sm:block">
              Architectural Engine for Gemini AI Workflows
            </p>
          </div>
        </div>

        {/* Status badges & Quick Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white font-medium">Server API Online</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">Gemini 3.6 & 3.1 Ready</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>{activeKeyCount} Active Keys</span>
          </div>

          <button
            onClick={onOpenPlayground}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-medium text-xs sm:text-sm border border-white/20 shadow-lg backdrop-blur-md transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Launch Playground</span>
          </button>
        </div>
      </div>
    </header>
  );
};
