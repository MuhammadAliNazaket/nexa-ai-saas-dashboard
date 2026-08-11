export type ScreenTab =
  | "dashboard"
  | "playground"
  | "workflow"
  | "apikeys"
  | "codegenerator"
  | "promptlibrary"
  | "settings";

export type GeminiModel =
  | "gemini-3.6-flash"
  | "gemini-3.1-pro-preview"
  | "gemini-3.1-flash-lite-image";

export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  environment: "production" | "test";
  created: string;
  lastUsed: string;
  rateLimit: string;
  status: "active" | "revoked";
  usage30d: string;
}

export interface ActivityLog {
  id: string;
  keyName: string;
  endpoint: string;
  model: string;
  latency: number;
  status: number;
  time: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  type: "transform" | "extract" | "code" | "summary" | "custom";
  prompt: string;
  model: GeminiModel;
  output?: string;
  durationMs?: number;
  isExecuting?: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: "Coding" | "Extraction" | "Reasoning" | "Agents" | "Creative";
  description: string;
  systemInstruction: string;
  userPrompt: string;
  suggestedModel: GeminiModel;
  tags: string[];
}

export interface PlatformMetrics {
  totalRequests24h: number;
  activeKeys: number;
  averageLatencyMs: number;
  errorRate: string;
  totalTokens30d: string;
  recentActivity: ActivityLog[];
}
