import React, { useState } from "react";
import {
  Workflow,
  Play,
  Plus,
  Trash2,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Code,
  Layers,
  Terminal,
} from "lucide-react";
import { WorkflowStep, GeminiModel } from "../types";
import { INITIAL_WORKFLOW_STEPS } from "../data/mockData";

export const WorkflowView: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_WORKFLOW_STEPS);
  const [initialInput, setInitialInput] = useState(
    "Customer Support Escalation Email: 'Hello NexaAI team, our mobile client crashed during checkout with Error 504 on endpoint /api/v2/payment. User email: customer@company.com. Time: 10:14 AM EST.'"
  );

  const [executing, setExecuting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [finalOutput, setFinalOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `wf-step-${Date.now()}`,
      title: `Pipeline Step ${steps.length + 1}`,
      type: "transform",
      prompt: "Transform or process the previous step's output.",
      model: "gemini-3.6-flash",
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleUpdateStep = (id: string, field: keyof WorkflowStep, value: any) => {
    setSteps(
      steps.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRunWorkflow = async () => {
    setExecuting(true);
    setFinalOutput(null);
    setActiveStepIndex(0);

    // Reset previous step outputs
    setSteps((prev) => prev.map((s) => ({ ...s, output: undefined, durationMs: undefined })));

    try {
      const res = await fetch("/api/gemini/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steps: steps.map((s) => ({
            title: s.title,
            type: s.type,
            prompt: s.prompt,
            model: s.model,
          })),
          input: initialInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.stepResults) {
        // Update step results with outputs and durations
        setSteps((prev) =>
          prev.map((step, idx) => {
            const stepRes = data.stepResults.find((r: any) => r.stepIndex === idx + 1);
            return {
              ...step,
              output: stepRes ? stepRes.output : "Completed",
              durationMs: stepRes ? stepRes.durationMs : 150,
            };
          })
        );
        setFinalOutput(data.workflowResult);
      } else {
        setFinalOutput(`Workflow Error: ${data.error}`);
      }
    } catch (err: any) {
      setFinalOutput(`Execution failed: ${err.message}`);
    } finally {
      setExecuting(false);
      setActiveStepIndex(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">AI Workflow Pipeline Builder</h1>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Multi-Step Engine
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Chain multiple specialized AI models together into sequential execution flows.
          </p>
        </div>

        <button
          onClick={handleRunWorkflow}
          disabled={executing || !initialInput.trim()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-white/20 disabled:opacity-50"
        >
          {executing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Executing Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Pipeline Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pipeline Input & Step Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Initial Data Ingestion */}
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-xl space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Pipeline Input / Raw Payload
            </label>
            <textarea
              value={initialInput}
              onChange={(e) => setInitialInput(e.target.value)}
              placeholder="Paste raw text, logs, or JSON payload to ingest into step 1..."
              className="w-full h-28 p-3 text-xs bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-hidden focus:border-indigo-500 transition-all resize-none font-sans"
            />
          </div>

          {/* Sequential Pipeline Steps */}
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div
                  className={`bg-white/5 backdrop-blur-md rounded-3xl border p-5 shadow-xl transition-all ${
                    activeStepIndex === idx
                      ? "border-indigo-500 ring-2 ring-indigo-500/30"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center border border-white/20">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(step.id, "title", e.target.value)}
                        className="font-bold text-sm text-white bg-transparent focus:outline-hidden border-b border-transparent focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={step.model}
                        onChange={(e) =>
                          handleUpdateStep(step.id, "model", e.target.value as GeminiModel)
                        }
                        className="text-[11px] font-mono bg-white/10 border border-white/15 text-white rounded-lg px-2 py-1 backdrop-blur-md cursor-pointer"
                      >
                        <option value="gemini-3.6-flash" className="bg-[#0a0a0f] text-white">gemini-3.6-flash</option>
                        <option value="gemini-3.1-pro-preview" className="bg-[#0a0a0f] text-white">gemini-3.1-pro-preview</option>
                      </select>

                      {steps.length > 1 && (
                        <button
                          onClick={() => handleRemoveStep(step.id)}
                          className="text-gray-400 hover:text-red-400 p-1 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono uppercase font-semibold text-gray-400">
                      Step Instruction / Prompt
                    </label>
                    <textarea
                      value={step.prompt}
                      onChange={(e) => handleUpdateStep(step.id, "prompt", e.target.value)}
                      className="w-full h-18 p-2.5 text-xs bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-hidden focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {step.output && (
                    <div className="mt-3 p-3 rounded-2xl bg-black/60 border border-white/10 text-gray-100 text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/10 pb-1">
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Step Output
                        </span>
                        {step.durationMs && <span>{step.durationMs} ms</span>}
                      </div>
                      <p className="line-clamp-3 text-indigo-100">{step.output}</p>
                    </div>
                  )}
                </div>

                {/* Arrow connector between steps */}
                {idx < steps.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center border border-indigo-500/30 backdrop-blur-md">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={handleAddStep}
            className="w-full py-3 rounded-2xl border border-dashed border-white/20 hover:border-indigo-500 text-indigo-300 font-semibold text-xs flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pipeline Execution Step</span>
          </button>
        </div>

        {/* Right Column: Pipeline Final Output Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Final Pipeline Result</h2>
              </div>

              {finalOutput && (
                <button
                  onClick={() => handleCopy(finalOutput)}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Result"}</span>
                </button>
              )}
            </div>

            {executing ? (
              <div className="p-12 text-center space-y-3 bg-white/5 rounded-2xl border border-dashed border-white/15">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs font-semibold text-white">
                  Executing Workflow Pipeline...
                </p>
                <p className="text-[11px] text-gray-400">
                  Chaining responses across {steps.length} sequential steps on server container.
                </p>
              </div>
            ) : finalOutput ? (
              <div className="p-4 rounded-2xl bg-black/60 text-gray-100 text-xs font-mono border border-white/10 leading-relaxed max-h-[500px] overflow-y-auto">
                <p className="whitespace-pre-wrap text-indigo-100">{finalOutput}</p>
              </div>
            ) : (
              <div className="p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/15 text-gray-400 text-xs space-y-2">
                <Workflow className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="font-medium text-white">No Workflow Run Executed</p>
                <p className="text-[11px] text-gray-400">
                  Click "Run Pipeline Flow" to run all configured steps sequentially.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
