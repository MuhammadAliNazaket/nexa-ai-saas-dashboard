import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { PlaygroundView } from "./components/PlaygroundView";
import { WorkflowView } from "./components/WorkflowView";
import { ApiKeysView } from "./components/ApiKeysView";
import { CodeGeneratorView } from "./components/CodeGeneratorView";
import { PromptLibraryView } from "./components/PromptLibraryView";
import { SettingsView } from "./components/SettingsView";
import { ScreenTab, PromptTemplate } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>("dashboard");
  const [activeKeyCount, setActiveKeyCount] = useState(2);

  const handleSelectTemplate = (template: PromptTemplate) => {
    setActiveTab("playground");
  };

  const handleRunQuickPrompt = (prompt: string) => {
    setActiveTab("playground");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-white relative overflow-hidden font-sans">
      {/* Frosted Glass Background Ambient Blur Spheres */}
      <div className="fixed top-[-150px] right-[-100px] w-[500px] h-[500px] bg-indigo-600/25 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] left-[-50px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Header */}
      <Header
        onOpenPlayground={() => setActiveTab("playground")}
        activeKeyCount={activeKeyCount}
      />

      {/* Main Container with Sidebar & View Area */}
      <div className="flex flex-1 overflow-hidden z-10">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto min-h-[calc(100vh-61px)] relative z-10">
          {activeTab === "dashboard" && (
            <DashboardView
              setActiveTab={setActiveTab}
              onRunQuickPrompt={handleRunQuickPrompt}
            />
          )}

          {activeTab === "playground" && <PlaygroundView />}

          {activeTab === "workflow" && <WorkflowView />}

          {activeTab === "apikeys" && <ApiKeysView />}

          {activeTab === "codegenerator" && <CodeGeneratorView />}

          {activeTab === "promptlibrary" && (
            <PromptLibraryView onSelectTemplate={handleSelectTemplate} />
          )}

          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
