import { BookOpen, ExternalLink } from "lucide-react";
import type { SummaryBlock as SummaryBlockData } from "../data/types";

type Props = {
  block: SummaryBlockData;
  index: number;
  isClickable: boolean;
  isActive: boolean;
  onCitationClick: (block: SummaryBlockData) => void;
};

export default function SummaryBlock({ block, index, isClickable, isActive, onCitationClick }: Props) {
  return (
    <div
      className={`rounded-lg border p-4 transition-colors duration-150 ${
        isActive ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 leading-relaxed">{block.text}</p>
          <div className="mt-2">
            {isClickable ? (
              <button
                type="button"
                onClick={() => onCitationClick(block)}
                className={`inline-flex items-center gap-1 text-xs font-medium rounded px-2 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                }`}
              >
                <BookOpen size={11} aria-hidden="true" />
                {block.label}
                <ExternalLink size={10} className="opacity-70" aria-hidden="true" />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                <BookOpen size={11} aria-hidden="true" />
                {block.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
