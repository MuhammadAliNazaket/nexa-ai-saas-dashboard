import React, { useState, useEffect } from "react";
import {
  Activity,
  Zap,
  Key,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Send,
  Code,
  Terminal,
  RefreshCw,
} from "lucide-react";
import { PlatformMetrics, ScreenTab } from "../types";

interface DashboardViewProps {
  setActiveTab: (tab: ScreenTab) => void;
  onRunQuickPrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onRunQuickPrompt,
}) => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [quickPromptText, setQuickPromptText] = useState("");
  const [quickPromptResult, setQuickPromptResult] = useState<string | null>(null);
  const [quickPromptLoading, setQuickPromptLoading] = useState(false);
  const [selectedQuickModel, setSelectedQuickModel] = useState("gemini-3.6-flash");

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPromptText.trim()) return;

    setQuickPromptLoading(true);
    setQuickPromptResult(null);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: quickPromptText,
          model: selectedQuickModel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuickPromptResult(data.text);
      } else {
        setQuickPromptResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setQuickPromptResult(`Request failed: ${err.message}`);
    } finally {
      setQuickPromptLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Hero */}
      <div className="p-6 md:p-8 rounded-3xl bg-indigo-600/20 backdrop-blur-md border border-white/10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-15 flex items-center pr-12 pointer-events-none">
          <Sparkles className="w-96 h-96 text-indigo-400" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-mono text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            NexaAI Core Engine Active • Server Proxy Enabled
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            AI Platform Overview & Real-Time Monitoring
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            Architect, monitor, and run high-performance AI workflows with Gemini models. Secure server-side proxy handles all key operations seamlessly.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab("playground")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm border border-white/20 shadow-lg backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              Open Playground
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 border border-white/15"
            >
              <Zap className="w-4 h-4" />
              Build AI Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider font-medium">
              24h API Volume
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : (metrics?.totalRequests24h || 184920).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% from yesterday</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider font-medium">
              Avg Latency
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">
            {loading ? "..." : `${metrics?.averageLatencyMs || 142} ms`}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fast response tier</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider font-medium">
              Active API Keys
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : metrics?.activeKeys || 2} Keys
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>1 Production • 1 Test</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase tracking-wider font-medium">
              30-Day Token Usage
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight font-mono">
            {loading ? "..." : metrics?.totalTokens30d || "48.2M"}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
            <span>SLA: 99.99% uptime</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Interactive Testbench & Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Testbench (7 cols) */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Instant Model Prompt Testbench
              </h2>
              <p className="text-xs text-gray-400">
                Send a quick request directly through the server proxy.
              </p>
            </div>
            <select
              value={selectedQuickModel}
              onChange={(e) => setSelectedQuickModel(e.target.value)}
              className="text-xs font-mono bg-white/10 border border-white/15 text-white rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-indigo-500 backdrop-blur-md cursor-pointer"
            >
              <option value="gemini-3.6-flash" className="bg-[#0a0a0f] text-white">gemini-3.6-flash</option>
              <option value="gemini-3.1-pro-preview" className="bg-[#0a0a0f] text-white">gemini-3.1-pro-preview</option>
            </select>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-3">
            <textarea
              value={quickPromptText}
              onChange={(e) => setQuickPromptText(e.target.value)}
              placeholder="e.g. Explain how Gemini server-side proxy improves API key security in two concise sentences."
              className="w-full h-24 p-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none font-sans"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Model: <span className="font-mono text-indigo-400">{selectedQuickModel}</span>
              </span>
              <button
                type="submit"
                disabled={quickPromptLoading || !quickPromptText.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
              >
                {quickPromptLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Query</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {quickPromptResult && (
            <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-white/10 text-gray-200 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-gray-400 border-b border-white/10 pb-2 text-[11px]">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  <Terminal className="w-3.5 h-3.5" /> Server Proxy Response
                </span>
                <span>Latency: ~120ms</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-indigo-100">{quickPromptResult}</p>
            </div>
          )}
        </div>

        {/* Real-time Health & Performance Stats (5 cols) */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-white">
                Engine Status & Routing
              </h2>
              <button
                onClick={fetchMetrics}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              All Gemini API requests are routed through the local server container proxy on port 3000.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-medium text-white">Server API Proxy</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px]">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-medium text-white">Gemini SDK User-Agent</span>
                <span className="font-mono text-indigo-300">aistudio-build</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-medium text-white">Error Rate</span>
                <span className="font-mono text-emerald-400 font-bold">0.02%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 backdrop-blur-md space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setActiveTab("apikeys")}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 font-medium text-left cursor-pointer transition-all"
              >
                Manage API Keys →
              </button>
              <button
                onClick={() => setActiveTab("codegenerator")}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 font-medium text-left cursor-pointer transition-all"
              >
                SDK Code Docs →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log Table */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Recent API Execution Logs
            </h2>
            <p className="text-xs text-gray-400">
              Real-time trace log of requests sent through NexaAI proxy
            </p>
          </div>
          <button
            onClick={() => setActiveTab("apikeys")}
            className="text-xs text-indigo-400 font-medium hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All Traffic Logs →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-medium">Key Name</th>
                <th className="py-2.5 px-3 font-medium">Endpoint</th>
                <th className="py-2.5 px-3 font-medium">Model</th>
                <th className="py-2.5 px-3 font-medium">Latency</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(metrics?.recentActivity || []).map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-medium text-white">{log.keyName}</td>
                  <td className="py-3 px-3 font-mono text-gray-400">{log.endpoint}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {log.model}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-300">{log.latency} ms</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> {log.status} OK
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-400 font-mono">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
