import { PromptTemplate, WorkflowStep } from "../types";

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "tpl-1",
    title: "TypeScript API Route Generator",
    category: "Coding",
    description: "Synthesize full-stack Express & Gemini API route code with Zod validation.",
    systemInstruction: "You are an expert TypeScript backend engineer specializing in Node.js, Express, and @google/genai SDK.",
    userPrompt: "Create a POST /api/summarize route that takes a raw text body, validates it, and calls Gemini gemini-3.6-flash to return a concise bulleted summary.",
    suggestedModel: "gemini-3.1-pro-preview",
    tags: ["Express", "TypeScript", "Backend", "API"],
  },
  {
    id: "tpl-2",
    title: "Structured JSON Entity Extractor",
    category: "Extraction",
    description: "Extract names, dates, amounts, and action items into strictly typed JSON schema.",
    systemInstruction: "Always output valid JSON adhering strictly to requested keys without conversational filler.",
    userPrompt: "Extract structured data from this email: 'Hi Sarah, please review the Q3 budget report ($45,000) by Friday August 14th before our sync with Mark.'",
    suggestedModel: "gemini-3.6-flash",
    tags: ["JSON", "Extraction", "NLP", "Schema"],
  },
  {
    id: "tpl-3",
    title: "Code Refactorer & Security Auditor",
    category: "Coding",
    description: "Analyze code for vulnerabilities, edge-case bugs, and performance bottlenecks.",
    systemInstruction: "You are a Principal Security Auditor. Spot memory leaks, unhandled exceptions, and API key exposures.",
    userPrompt: "Audit this function:\nasync function getUser(id) {\n  const res = await fetch('http://api.internal/users/' + id);\n  return res.json();\n}",
    suggestedModel: "gemini-3.1-pro-preview",
    tags: ["Security", "Code Audit", "Performance"],
  },
  {
    id: "tpl-4",
    title: "Step-by-Step Chain-of-Thought Reasoner",
    category: "Reasoning",
    description: "Break down multi-variable engineering or business math problems logically.",
    systemInstruction: "Think through complex logical problems step-by-step before stating the final answer.",
    userPrompt: "A distributed system processes 12,000 req/sec. Each request requires 3 database queries taking 4ms each. How many parallel DB connections are required assuming no connection pooling?",
    suggestedModel: "gemini-3.1-pro-preview",
    tags: ["Reasoning", "System Architecture", "Math"],
  },
  {
    id: "tpl-5",
    title: "Autonomous Task Planning Agent",
    category: "Agents",
    description: "Break high-level product goals into ordered sub-tasks with dependency graphs.",
    systemInstruction: "Act as an AI Agent Orchestrator. Deconstruct complex software milestones into execution sub-agents.",
    userPrompt: "Plan the full architecture and implementation phases for building a real-time collaborative code editor.",
    suggestedModel: "gemini-3.1-pro-preview",
    tags: ["Agents", "Planning", "Architecture"],
  },
];

export const INITIAL_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "wf-step-1",
    title: "Text Summarizer & Key Points",
    type: "summary",
    prompt: "Summarize the input text into 3 key executive bullet points.",
    model: "gemini-3.6-flash",
  },
  {
    id: "wf-step-2",
    title: "Action Item Entity Extraction",
    type: "extract",
    prompt: "Extract all actionable tasks, assignees, and deadlines into a structured JSON list.",
    model: "gemini-3.6-flash",
  },
  {
    id: "wf-step-3",
    title: "SDK Client Integration Code",
    type: "code",
    prompt: "Write a TypeScript function that takes these action items and pushes them to a database or task queue.",
    model: "gemini-3.1-pro-preview",
  },
];
