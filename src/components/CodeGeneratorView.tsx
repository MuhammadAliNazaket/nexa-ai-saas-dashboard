import React, { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  Play,
  Terminal,
  BookOpen,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export const CodeGeneratorView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<"ts" | "python" | "curl" | "go">("ts");
  const [taskInput, setTaskInput] = useState(
    "Write a function that streams Gemini response text using @google/genai TypeScript SDK."
  );
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSynthesizeCode = async () => {
    if (!taskInput.trim()) return;

    setLoading(true);
    setGeneratedCode(null);

    const langMap = {
      ts: "typescript",
      python: "python",
      curl: "curl",
      go: "go",
    };

    try {
      const res = await fetch("/api/gemini/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskInput,
          language: langMap[selectedLang],
          model: "gemini-3.6-flash",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedCode(data.code);
      } else {
        setGeneratedCode(`// Error: ${data.error}`);
      }
    } catch (err: any) {
      setGeneratedCode(`// Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDefaultCode = () => {
    if (selectedLang === "ts") {
      return `import { GoogleGenAI } from "@google/genai";

// 1. Initialize Gemini SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// 2. Generate Content with gemini-3.6-flash
export async function generateResponse(userPrompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: userPrompt,
    config: {
      systemInstruction: "You are a senior software architect.",
      temperature: 0.7,
    }
  });

  return response.text;
}`;
    } else if (selectedLang === "python") {
      return `from google import genai
import os

# Initialize client with GEMINI_API_KEY
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

response = client.models.generate_content(
    model='gemini-3.6-flash',
    contents='Explain distributed consensus algorithms.',
    config={
        'temperature': 0.7,
    }
)

print(response.text)`;
    } else if (selectedLang === "curl") {
      return `# Query NexaAI Server Proxy
curl -X POST "http://localhost:3000/api/gemini/generate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3.6-flash",
    "prompt": "Hello Gemini!",
    "systemInstruction": "Respond concisely."
  }'`;
    } else {
      return `package main

import (
    "context"
    "fmt"
    "os"
    "github.com/google/generative-ai-go/genai"
)

func main() {
    ctx := context.Background()
    client, err := genai.NewClient(ctx)
    if err != nil {
        panic(err)
    }
    defer client.Close()

    model := client.GenerativeModel("gemini-3.6-flash")
    resp, err := model.GenerateContent(ctx, genai.Text("Hello World"))
    if err != nil {
        panic(err)
    }
    fmt.Println(resp.Candidates[0].Content)
}`;
    }
  };

  const activeCodeText = generatedCode || getDefaultCode();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#141b2b]">SDK Code Generator & Documentation</h1>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#e9edff] text-[#3525cd]">
              @google/genai
            </span>
          </div>
          <p className="text-xs text-[#464555] mt-1">
            Synthesize ready-to-run server-side integration code for multi-language platforms.
          </p>
        </div>

        <button
          onClick={() => handleCopy(activeCodeText)}
          className="px-4 py-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied!" : "Copy Active Snippet"}</span>
        </button>
      </div>

      {/* Language Switcher & Interactive Synthesizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Synthesizer Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#141b2b] uppercase tracking-wider font-mono border-b border-[#e5e7eb] pb-3">
              <Sparkles className="w-4 h-4 text-[#3525cd]" />
              <span>AI Code Synthesizer</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#141b2b]">Target Language / SDK</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedLang("ts")}
                  className={`p-2.5 rounded-lg text-xs font-mono border text-left cursor-pointer transition-all ${
                    selectedLang === "ts"
                      ? "bg-[#3525cd] text-white font-semibold border-[#3525cd]"
                      : "bg-[#f9f9ff] text-[#141b2b] border-[#e5e7eb]"
                  }`}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => setSelectedLang("python")}
                  className={`p-2.5 rounded-lg text-xs font-mono border text-left cursor-pointer transition-all ${
                    selectedLang === "python"
                      ? "bg-[#3525cd] text-white font-semibold border-[#3525cd]"
                      : "bg-[#f9f9ff] text-[#141b2b] border-[#e5e7eb]"
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSelectedLang("curl")}
                  className={`p-2.5 rounded-lg text-xs font-mono border text-left cursor-pointer transition-all ${
                    selectedLang === "curl"
                      ? "bg-[#3525cd] text-white font-semibold border-[#3525cd]"
                      : "bg-[#f9f9ff] text-[#141b2b] border-[#e5e7eb]"
                  }`}
                >
                  cURL / REST
                </button>
                <button
                  onClick={() => setSelectedLang("go")}
                  className={`p-2.5 rounded-lg text-xs font-mono border text-left cursor-pointer transition-all ${
                    selectedLang === "go"
                      ? "bg-[#3525cd] text-white font-semibold border-[#3525cd]"
                      : "bg-[#f9f9ff] text-[#141b2b] border-[#e5e7eb]"
                  }`}
                >
                  Go Lang
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#141b2b]">
                Describe Desired Code Logic
              </label>
              <textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="e.g. Write a route that accepts image upload and returns Gemini visual analysis..."
                className="w-full h-28 p-3 text-xs bg-[#f9f9ff] border border-[#e5e7eb] rounded-lg text-[#141b2b] focus:outline-hidden focus:border-[#3525cd] resize-none"
              />
            </div>

            <button
              onClick={handleSynthesizeCode}
              disabled={loading || !taskInput.trim()}
              className="w-full py-2.5 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Code...</span>
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4" />
                  <span>Generate Custom SDK Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Code Display Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#111827] rounded-xl border border-gray-800 shadow-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-xs font-mono text-gray-400 ml-2">
                  server/gemini-integration.{selectedLang}
                </span>
              </div>

              <button
                onClick={() => handleCopy(activeCodeText)}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <pre className="p-5 text-xs font-mono text-gray-200 leading-relaxed overflow-x-auto max-h-[500px]">
              {activeCodeText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
