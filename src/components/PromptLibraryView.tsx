import React, { useState } from "react";
import {
  BookOpenCheck,
  Search,
  ArrowRight,
  Sparkles,
  Tag,
  Copy,
  Check,
  Filter,
} from "lucide-react";
import { PromptTemplate, ScreenTab } from "../types";
import { PROMPT_TEMPLATES } from "../data/mockData";

interface PromptLibraryViewProps {
  onSelectTemplate: (template: PromptTemplate) => void;
}

export const PromptLibraryView: React.FC<PromptLibraryViewProps> = ({
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Coding", "Extraction", "Reasoning", "Agents"];

  const filteredTemplates = PROMPT_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || tpl.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#141b2b]">System Prompt & Template Library</h1>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#e9edff] text-[#3525cd]">
              Curated Patterns
            </span>
          </div>
          <p className="text-xs text-[#464555] mt-1">
            Production-tested system instructions and zero-shot prompt engineering blueprints.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                selectedCategory === cat
                  ? "bg-[#3525cd] text-white font-semibold"
                  : "bg-[#f1f3ff] text-[#464555] hover:bg-[#e1e8fd]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#777587]" />
          <input
            type="text"
            placeholder="Search templates or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#f9f9ff] border border-[#c7c4d8] rounded-lg text-[#141b2b] focus:outline-hidden focus:border-[#3525cd]"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-xs space-y-4 hover:border-[#3525cd] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#e9edff] text-[#3525cd] font-bold">
                  {tpl.category}
                </span>
                <span className="text-[11px] font-mono text-[#777587]">
                  Model: {tpl.suggestedModel}
                </span>
              </div>

              <h3 className="font-bold text-base text-[#141b2b]">{tpl.title}</h3>
              <p className="text-xs text-[#464555]">{tpl.description}</p>

              {/* System Instruction snippet */}
              <div className="p-3 rounded-lg bg-[#f9f9ff] border border-[#e5e7eb] text-xs space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-[#777587]">
                  System Instruction:
                </span>
                <p className="font-mono text-[11px] text-[#141b2b] line-clamp-2">
                  {tpl.systemInstruction}
                </p>
              </div>

              {/* User Prompt snippet */}
              <div className="p-3 rounded-lg bg-[#111827] text-gray-200 text-xs font-mono space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-400">
                  User Prompt Blueprint:
                </span>
                <p className="line-clamp-3 text-indigo-200">{tpl.userPrompt}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {tpl.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono bg-[#f1f3ff] text-[#464555] px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-between">
              <button
                onClick={() => handleCopyPrompt(tpl.id, tpl.userPrompt)}
                className="text-xs text-[#3525cd] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                {copiedId === tpl.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === tpl.id ? "Copied Prompt" : "Copy Prompt"}</span>
              </button>

              <button
                onClick={() => onSelectTemplate(tpl)}
                className="px-3.5 py-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>Load in Playground</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
