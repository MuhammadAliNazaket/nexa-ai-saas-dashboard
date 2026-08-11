import React, { useState, useEffect } from "react";
import {
  Settings,
  Key,
  ShieldCheck,
  Server,
  Terminal,
  CheckCircle2,
  RefreshCw,
  Info,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const [healthInfo, setHealthInfo] = useState<{
    geminiKeyConfigured: boolean;
    service: string;
    timestamp: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealthInfo(data);
      }
    } catch (err) {
      console.error("Health check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#3525cd]" />
          <h1 className="text-xl font-bold text-[#141b2b]">Studio & Environment Settings</h1>
        </div>
        <p className="text-xs text-[#464555] mt-1">
          Verify server proxy settings, secrets configuration, and Gemini API telemetry parameters.
        </p>
      </div>

      {/* Secret Key Status Panel */}
      <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#3525cd]" />
            <h2 className="font-bold text-sm text-[#141b2b]">Gemini API Key Secret Status</h2>
          </div>
          <button
            onClick={fetchHealth}
            className="text-xs text-[#3525cd] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-check Status
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#f1f3ff] border border-[#e1e8fd] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#141b2b]">GEMINI_API_KEY</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e9edff] text-[#3525cd]">
                Environment Variable
              </span>
            </div>
            <p className="text-xs text-[#464555]">
              Stored securely inside server environment variables. Never transmitted or exposed to browser code.
            </p>
          </div>

          <div>
            {loading ? (
              <span className="text-xs font-mono text-[#777587]">Checking...</span>
            ) : healthInfo?.geminiKeyConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" /> Configured & Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs">
                Key Injected at Runtime
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e5e7eb] space-y-2 text-xs text-[#464555]">
          <div className="flex items-center gap-2 font-semibold text-[#141b2b]">
            <Info className="w-4 h-4 text-[#3525cd]" />
            <span>How API Secrets Work in AI Studio</span>
          </div>
          <p>
            Your API key can be configured in the <strong>Settings &gt; Secrets</strong> panel in the AI Studio platform interface. The server proxy automatically injects `process.env.GEMINI_API_KEY` when handling `/api/gemini/*` requests.
          </p>
        </div>
      </div>

      {/* Container Runtime Metadata */}
      <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs space-y-4">
        <h2 className="font-bold text-sm text-[#141b2b] border-b border-[#e5e7eb] pb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-[#3525cd]" /> Container Execution Runtime
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#f9f9ff] border border-[#e5e7eb]">
            <span className="text-[#777587] block text-[10px] uppercase font-bold">Binding Host & Port</span>
            <span className="font-bold text-[#141b2b]">0.0.0.0:3000 (Cloud Run)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#f9f9ff] border border-[#e5e7eb]">
            <span className="text-[#777587] block text-[10px] uppercase font-bold">SDK Telemetry Header</span>
            <span className="font-bold text-[#3525cd]">User-Agent: aistudio-build</span>
          </div>
          <div className="p-3 rounded-lg bg-[#f9f9ff] border border-[#e5e7eb]">
            <span className="text-[#777587] block text-[10px] uppercase font-bold">Framework</span>
            <span className="font-bold text-[#141b2b]">React 19 + Vite + Express + @google/genai</span>
          </div>
          <div className="p-3 rounded-lg bg-[#f9f9ff] border border-[#e5e7eb]">
            <span className="text-[#777587] block text-[10px] uppercase font-bold">Default AI Model</span>
            <span className="font-bold text-[#3525cd]">gemini-3.6-flash</span>
          </div>
        </div>
      </div>
    </div>
  );
};
