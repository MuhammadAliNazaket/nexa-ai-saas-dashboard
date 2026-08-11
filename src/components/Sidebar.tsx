import React from "react";
import {
  LayoutDashboard,
  Terminal,
  Workflow,
  KeyRound,
  Code2,
  BookOpenCheck,
  Settings,
  Sparkles,
  Layers,
} from "lucide-react";
import { ScreenTab } from "../types";

interface SidebarProps {
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: ScreenTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "playground", label: "Model Playground", icon: Terminal, badge: "Interactive" },
    { id: "workflow", label: "Workflow Builder", icon: Workflow, badge: "Multi-Step" },
    { id: "apikeys", label: "API Keys & Metrics", icon: KeyRound },
    { id: "codegenerator", label: "SDK Code & Docs", icon: Code2 },
    { id: "promptlibrary", label: "Prompt Library", icon: BookOpenCheck },
    { id: "settings", label: "Studio Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 shrink-0 p-4 flex flex-col justify-between min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600/80 text-white font-semibold shadow-lg border border-white/20 backdrop-blur-md"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-white/20 text-white font-medium"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Gemini Active Models Banner */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Supported AI Models</span>
          </div>
          <ul className="text-[11px] space-y-1 text-gray-300 font-mono mt-2">
            <li className="flex items-center justify-between">
              <span>gemini-3.6-flash</span>
              <span className="text-[10px] text-emerald-400 font-sans font-medium">Default</span>
            </li>
            <li className="flex items-center justify-between">
              <span>gemini-3.1-pro-preview</span>
              <span className="text-[10px] text-indigo-400 font-sans font-medium">Reasoning</span>
            </li>
            <li className="flex items-center justify-between">
              <span>gemini-3.1-flash-lite-image</span>
              <span className="text-[10px] text-amber-400 font-sans font-medium">Visual</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Layers className="w-3.5 h-3.5" />
          <span>NexaAI Engine v2.6.4</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 font-mono">
          Cloud Run • 0.0.0.0:3000
        </p>
      </div>
    </aside>
  );
};
