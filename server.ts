import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI server-side safely
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// In-memory API Keys store for the developer dashboard
let apiKeys = [
  {
    id: "key-1",
    name: "Production App - Primary",
    key: "nx_live_98a72b10f842a9d80312",
    environment: "production",
    created: "2026-05-12",
    lastUsed: "2 mins ago",
    rateLimit: "1,000 RPM",
    status: "active",
    usage30d: "1.42M tokens",
  },
  {
    id: "key-2",
    name: "Staging / Internal Benchmarks",
    key: "nx_test_41c09e33bf9012a95e01",
    environment: "test",
    created: "2026-07-01",
    lastUsed: "14 hours ago",
    rateLimit: "300 RPM",
    status: "active",
    usage30d: "210k tokens",
  },
  {
    id: "key-3",
    name: "Legacy Fine-Tuned Model Test",
    key: "nx_test_77d121aa90f111e29088",
    environment: "test",
    created: "2026-02-18",
    lastUsed: "12 days ago",
    rateLimit: "100 RPM",
    status: "revoked",
    usage30d: "0 tokens",
  },
];

// Endpoint: Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "NexaAI API Platform Engine",
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: Gemini Text & Prompt Generation
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const {
      prompt,
      model = "gemini-3.6-flash",
      systemInstruction,
      temperature = 0.7,
      topP = 0.95,
      maxOutputTokens,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt parameter is required." });
    }

    const ai = getGenAI();
    const config: any = {};

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (temperature !== undefined) {
      config.temperature = Number(temperature);
    }
    if (topP !== undefined) {
      config.topP = Number(topP);
    }
    if (maxOutputTokens) {
      config.maxOutputTokens = Number(maxOutputTokens);
    }

    const startTime = Date.now();
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: Object.keys(config).length > 0 ? config : undefined,
    });
    const latencyMs = Date.now() - startTime;

    const outputText = response.text || "No response text generated.";

    return res.json({
      success: true,
      text: outputText,
      model: model,
      latencyMs,
      promptTokens: Math.round(prompt.length / 4),
      completionTokens: Math.round(outputText.length / 4),
      totalTokens: Math.round((prompt.length + outputText.length) / 4),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred while generating content.",
    });
  }
});

// Endpoint: Code Generation & SDK Snippet Synthesis
app.post("/api/gemini/code", async (req, res) => {
  try {
    const { task, language = "typescript", model = "gemini-3.6-flash" } = req.body;

    if (!task) {
      return res.status(400).json({ error: "Task description is required." });
    }

    const prompt = `You are NexaAI SDK Code Architect. Produce clean, idiomatic production-ready code in ${language} to solve the following developer request:
"${task}"

Requirements:
1. Provide only executable, standard code and comments.
2. Ensure correct type annotations if applicable.
3. Keep the code focused, efficient, and well-structured.`;

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const codeOutput = response.text || "";

    return res.json({
      success: true,
      language,
      code: codeOutput,
      model,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Code generation error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to synthesize code.",
    });
  }
});

// Endpoint: AI Workflow Pipeline Execution
app.post("/api/gemini/workflow", async (req, res) => {
  try {
    const { steps, input } = req.body;
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ error: "At least one workflow step is required." });
    }

    const ai = getGenAI();
    let currentData = input || "";
    const stepResults = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepPrompt = `[Workflow Step ${i + 1}: ${step.title || step.type}]
Task Instruction: ${step.prompt}
Current Context / Input Data:
${typeof currentData === "object" ? JSON.stringify(currentData, null, 2) : currentData}`;

      const stepStart = Date.now();
      const response = await ai.models.generateContent({
        model: step.model || "gemini-3.6-flash",
        contents: stepPrompt,
      });
      const durationMs = Date.now() - stepStart;
      const resultText = response.text || "";

      stepResults.push({
        stepIndex: i + 1,
        title: step.title || `Step ${i + 1}`,
        type: step.type,
        output: resultText,
        durationMs,
      });

      currentData = resultText;
    }

    return res.json({
      success: true,
      workflowResult: currentData,
      stepResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Workflow execution error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Workflow execution failed.",
    });
  }
});

// Endpoint: API Keys Management
app.get("/api/keys", (_req, res) => {
  res.json({ keys: apiKeys });
});

app.post("/api/keys", (req, res) => {
  const { name, environment = "production", rateLimit = "500 RPM" } = req.body;
  const randomHex = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  const newKeyObj = {
    id: `key-${Date.now()}`,
    name: name || "New API Key",
    key: `nx_${environment === "production" ? "live" : "test"}_${randomHex}`,
    environment,
    created: new Date().toISOString().split("T")[0],
    lastUsed: "Never",
    rateLimit,
    status: "active",
    usage30d: "0 tokens",
  };
  apiKeys.unshift(newKeyObj);
  res.json({ success: true, key: newKeyObj });
});

app.delete("/api/keys/:id", (req, res) => {
  const { id } = req.params;
  const keyIndex = apiKeys.findIndex((k) => k.id === id);
  if (keyIndex !== -1) {
    apiKeys[keyIndex].status = "revoked";
    res.json({ success: true, message: "Key revoked successfully." });
  } else {
    res.status(404).json({ error: "Key not found." });
  }
});

// Endpoint: Platform Metrics
app.get("/api/metrics", (_req, res) => {
  res.json({
    totalRequests24h: 184920,
    activeKeys: apiKeys.filter((k) => k.status === "active").length,
    averageLatencyMs: 142,
    errorRate: "0.02%",
    totalTokens30d: "48.2M",
    recentActivity: [
      { id: "act-1", keyName: "Production App - Primary", endpoint: "/api/gemini/generate", model: "gemini-3.6-flash", latency: 128, status: 200, time: "10s ago" },
      { id: "act-2", keyName: "Production App - Primary", endpoint: "/api/gemini/code", model: "gemini-3.1-pro-preview", latency: 284, status: 200, time: "28s ago" },
      { id: "act-3", keyName: "Staging / Internal Benchmarks", endpoint: "/api/gemini/generate", model: "gemini-3.6-flash", latency: 110, status: 200, time: "1m ago" },
      { id: "act-4", keyName: "Production App - Primary", endpoint: "/api/gemini/workflow", model: "gemini-3.6-flash", latency: 312, status: 200, time: "3m ago" },
      { id: "act-5", keyName: "Staging / Internal Benchmarks", endpoint: "/api/gemini/generate", model: "gemini-3.6-flash", latency: 95, status: 200, time: "5m ago" },
    ],
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NexaAI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
