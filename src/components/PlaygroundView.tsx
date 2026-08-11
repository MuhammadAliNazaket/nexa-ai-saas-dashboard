import React, { useState } from "react";
import {
  Terminal,
  Send,
  Sparkles,
  Sliders,
  Copy,
  Check,
  Code2,
  RefreshCw,
  BookOpenCheck,
  Zap,
  Info,
  Layers,
} from "lucide-react";
import { GeminiModel } from "../types";
import { PROMPT_TEMPLATES } from "../data/mockData";

export const PlaygroundView: React.FC = () => {
  const [model, setModel] = useState<GeminiModel>("gemini-3.6-flash");
  const [systemInstruction, setSystemInstruction] = useState(
    "You are NexaAI Senior Systems Engineer. Provide clear, concise, accurate, and structured responses."
  );
  const [userPrompt, setUserPrompt] = useState(
    "Synthesize a TypeScript function using Express to query Gemini API safely on the server side."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.95);
  const [maxOutputTokens, setMaxOutputTokens] = useState(1024);

  const [loading, setLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [tokenStats, setTokenStats] = useState<{
    latencyMs: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"ts" | "python" | "curl">("ts");

  const handleRun = async () => {
    if (!userPrompt.trim()) return;

    setLoading(true);
    setResponseOutput(null);
    setTokenStats(null);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          model,
          systemInstruction,
          temperature,
          topP,
          maxOutputTokens,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResponseOutput(data.text);
        setTokenStats({
          latencyMs: data.latencyMs,
          promptTokens: data.promptTokens,
          completionTokens: data.completionTokens,
          totalTokens: data.totalTokens,
        });
      } else {
        setResponseOutput(`[Server Proxy Error]: ${data.error}`);
      }
    } catch (err: any) {
      setResponseOutput(`[Network Error]: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeSnippet = () => {
    if (selectedLanguage === "ts") {
      return `import { GoogleGenAI } from "@google/genai";

// Server-side initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

async function main() {
  const response = await ai.models.generateContent({
    model: "${model}",
    contents: ${JSON.stringify(userPrompt)},
    config: {
      systemInstruction: ${JSON.stringify(systemInstruction)},
      temperature: ${temperature},
      topP: ${topP},
    }
  });

  console.log(response.text);
}

main();`;
    } else if (selectedLanguage === "python") {
      return `from google import genai
import os

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

response = client.models.generate_content(
    model='${model}',
    contents='''${userPrompt}''',
    config={
        'system_instruction': '''${systemInstruction}''',
        'temperature': ${temperature},
        'top_p': ${topP},
    }
)

print(response.text)`;
    } else {
      return `# cURL Request
curl -X POST "http://localhost:3000/api/gemini/generate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "prompt": ${JSON.stringify(userPrompt)},
    "systemInstruction": ${JSON.stringify(systemInstruction)},
    "temperature": ${temperature}
  }'`;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Interactive Model Playground</h1>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Gemini Studio
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Test prompts, tweak hyperparameters, and export server-side @google/genai TypeScript integration code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCodeModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Export Code</span>
          </button>
          <button
            onClick={handleRun}
            disabled={loading || !userPrompt.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-white/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Execute Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Config Panel (1/3) & Workspace (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hyperparameters Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Model & Parameters</span>
            </div>

            {/* Model Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">AI Model Selection</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as GeminiModel)}
                className="w-full text-xs font-mono bg-white/10 border border-white/15 text-white rounded-xl p-2.5 focus:outline-hidden focus:border-indigo-500 backdrop-blur-md cursor-pointer"
              >
                <option value="gemini-3.6-flash" className="bg-[#0a0a0f] text-white">gemini-3.6-flash (Fast & Accurate)</option>
                <option value="gemini-3.1-pro-preview" className="bg-[#0a0a0f] text-white">gemini-3.1-pro-preview (Complex Reasoning)</option>
                <option value="gemini-3.1-flash-lite-image" className="bg-[#0a0a0f] text-white">gemini-3.1-flash-lite-image (Multimodal)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-gray-300">Temperature</label>
                <span className="font-mono text-indigo-400 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400">
                Controls randomness. Lower values are more deterministic.
              </p>
            </div>

            {/* Top P Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-gray-300">Top P</label>
                <span className="font-mono text-indigo-400 font-bold">{topP}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Max Output Tokens</label>
              <input
                type="number"
                value={maxOutputTokens}
                onChange={(e) => setMaxOutputTokens(parseInt(e.target.value) || 512)}
                className="w-full text-xs font-mono bg-white/10 border border-white/15 text-white rounded-xl p-2 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick Preset Templates */}
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
              <BookOpenCheck className="w-4 h-4 text-indigo-400" />
              <span>Prompt Templates</span>
            </div>
            <p className="text-xs text-gray-400">Select a preset to load into the workspace:</p>
            <div className="space-y-2">
              {PROMPT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSystemInstruction(tpl.systemInstruction);
                    setUserPrompt(tpl.userPrompt);
                    setModel(tpl.suggestedModel);
                  }}
                  className="w-full text-left p-2.5 rounded-2xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="text-xs font-semibold text-white">{tpl.title}</div>
                  <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{tpl.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Workspace Column (Input Prompt & Output Response) */}
        <div className="lg:col-span-8 space-y-6">
          {/* System Instruction Field */}
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-xl space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> System Instruction
            </label>
            <textarea
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              placeholder="e.g. You are a helpful AI assistant..."
              className="w-full h-20 p-3 text-xs bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-hidden focus:border-indigo-500 transition-all resize-none font-sans"
            />
          </div>

          {/* User Prompt Field */}
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> User Prompt
              </label>
              <span className="text-[11px] text-gray-400">
                {userPrompt.length} characters
              </span>
            </div>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your query or request..."
              className="w-full h-36 p-3 text-sm bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-hidden focus:border-indigo-500 transition-all resize-none font-sans"
            />
          </div>

          {/* Response Box */}
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Model Output
                </span>
                {tokenStats && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    {tokenStats.latencyMs} ms
                  </span>
                )}
              </div>

              {responseOutput && (
                <button
                  onClick={() => handleCopy(responseOutput)}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Output"}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-8 text-center space-y-3 bg-white/5 rounded-2xl border border-white/5">
                <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs text-gray-400">Querying Gemini model via server proxy...</p>
              </div>
            ) : responseOutput ? (
              <div className="p-4 rounded-2xl bg-black/60 text-gray-100 text-xs font-mono space-y-3 border border-white/10 leading-relaxed overflow-x-auto">
                <p className="whitespace-pre-wrap">{responseOutput}</p>
                {tokenStats && (
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-[10px] text-gray-400">
                    <span>Prompt Tokens: <strong className="text-indigo-300">{tokenStats.promptTokens}</strong></span>
                    <span>Completion Tokens: <strong className="text-indigo-300">{tokenStats.completionTokens}</strong></span>
                    <span>Total Tokens: <strong className="text-indigo-300">{tokenStats.totalTokens}</strong></span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/15 text-gray-400 text-xs">
                Click "Execute Prompt" above to run your prompt against the server-side Gemini engine.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Server Integration Code Snippet</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-gray-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setSelectedLanguage("ts")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                  selectedLanguage === "ts" ? "bg-indigo-600 text-white font-medium" : "text-gray-400 hover:text-white"
                }`}
              >
                TypeScript (@google/genai)
              </button>
              <button
                onClick={() => setSelectedLanguage("python")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                  selectedLanguage === "python" ? "bg-indigo-600 text-white font-medium" : "text-gray-400 hover:text-white"
                }`}
              >
                Python (google-genai)
              </button>
              <button
                onClick={() => setSelectedLanguage("curl")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                  selectedLanguage === "curl" ? "bg-indigo-600 text-white font-medium" : "text-gray-400 hover:text-white"
                }`}
              >
                cURL
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-black/80 text-indigo-200 text-xs font-mono overflow-x-auto max-h-80 border border-white/10 leading-relaxed">
              {getCodeSnippet()}
            </pre>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleCopy(getCodeSnippet())}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code Snippet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
