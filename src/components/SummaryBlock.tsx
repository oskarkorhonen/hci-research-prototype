import React from "react";
import { ExternalLink, BookOpen } from "lucide-react";
import type { SummaryBlock as SummaryBlockType } from "../data/scenario";

type Mode = "baseline" | "voluntary" | "forced";

interface SummaryBlockProps {
  block: SummaryBlockType;
  index: number;
  mode: Mode;
  isActive: boolean;
  onCitationClick?: (block: SummaryBlockType) => void;
}

export default function SummaryBlock({
  block,
  index,
  mode,
  isActive,
  onCitationClick,
}: SummaryBlockProps) {
  const isClickable = mode === "voluntary" || mode === "forced";

  return (
    <div
      className={`rounded-lg border p-4 transition-colors duration-150 ${
        isActive
          ? "border-blue-400 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Index badge */}
        <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 leading-relaxed">{block.text}</p>

          {/* Citation row */}
          <div className="mt-2 flex items-center gap-1.5">
            {isClickable ? (
              <button
                onClick={() => onCitationClick?.(block)}
                className={`inline-flex items-center gap-1 text-xs font-medium rounded px-2 py-1 transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                }`}
                title="Click to verify this claim in the source document"
              >
                <BookOpen size={11} />
                {block.label}
                <ExternalLink size={10} className="opacity-70" />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                <BookOpen size={11} />
                {block.label}
              </span>
            )}

            {isClickable && (
              <span className="text-xs text-slate-400">
                click to verify in source
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
