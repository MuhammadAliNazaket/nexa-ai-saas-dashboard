import React, { useState, useEffect } from "react";
import {
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  Key,
} from "lucide-react";
import { ApiKeyItem } from "../types";

export const ApiKeysView: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<"production" | "test">("production");
  const [newKeyRateLimit, setNewKeyRateLimit] = useState("1,000 RPM");
  const [creating, setCreating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Error fetching keys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          environment: newKeyEnv,
          rateLimit: newKeyRateLimit,
        }),
      });

      if (res.ok) {
        await fetchKeys();
        setShowCreateModal(false);
        setNewKeyName("");
      }
    } catch (err) {
      console.error("Error creating key:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchKeys();
      }
    } catch (err) {
      console.error("Error revoking key:", err);
    }
  };

  const handleCopyKey = (id: string, keyString: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">API Keys & Access Management</h1>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Security
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Provision and manage NexaAI platform access tokens and key rate limits.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-white/20"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Key</span>
        </button>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 space-y-1">
          <p className="font-semibold text-white">
            Server-Side Key Isolation Architecture
          </p>
          <p>
            Your underlying Google Gemini API Key (`GEMINI_API_KEY`) is stored safely on the server container. Client applications authenticate using these NexaAI tokens (`nx_live_...` or `nx_test_...`).
          </p>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Provisioned Access Credentials ({keys.length})
          </h2>
          <button
            onClick={fetchKeys}
            className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-mono text-[11px] uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-4 font-medium">Key Name</th>
                <th className="py-3.5 px-4 font-medium">Token Prefix</th>
                <th className="py-3.5 px-4 font-medium">Environment</th>
                <th className="py-3.5 px-4 font-medium">Rate Limit</th>
                <th className="py-3.5 px-4 font-medium">30D Usage</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Loading provisioned API keys...
                  </td>
                </tr>
              ) : keys.map((k) => (
                <tr key={k.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{k.name}</td>
                  <td className="py-3.5 px-4 font-mono text-indigo-300">
                    {k.key.substring(0, 16)}...
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                        k.environment === "production"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {k.environment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-300">{k.rateLimit}</td>
                  <td className="py-3.5 px-4 font-mono text-white">{k.usage30d}</td>
                  <td className="py-3.5 px-4">
                    {k.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
                        Revoked
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleCopyKey(k.id, k.key)}
                      className="p-1.5 text-indigo-400 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                      title="Copy Key Token"
                    >
                      {copiedKeyId === k.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {k.status === "active" && (
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all cursor-pointer"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Provision New Access Key</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Key Identifier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App Backend V2"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white/10 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Target Environment</label>
                <select
                  value={newKeyEnv}
                  onChange={(e) => setNewKeyEnv(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-white/10 border border-white/15 rounded-xl text-white backdrop-blur-md cursor-pointer"
                >
                  <option value="production" className="bg-[#0a0a0f] text-white">Production (nx_live_...)</option>
                  <option value="test" className="bg-[#0a0a0f] text-white">Test / Staging (nx_test_...)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Rate Limit Tier</label>
                <select
                  value={newKeyRateLimit}
                  onChange={(e) => setNewKeyRateLimit(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white/10 border border-white/15 rounded-xl text-white backdrop-blur-md cursor-pointer"
                >
                  <option value="300 RPM" className="bg-[#0a0a0f] text-white">300 Requests / Min</option>
                  <option value="1,000 RPM" className="bg-[#0a0a0f] text-white">1,000 Requests / Min</option>
                  <option value="5,000 RPM" className="bg-[#0a0a0f] text-white">5,000 Requests / Min</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newKeyName.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 border border-white/20 cursor-pointer disabled:opacity-50 shadow-lg"
                >
                  {creating ? "Provisioning..." : "Generate Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
