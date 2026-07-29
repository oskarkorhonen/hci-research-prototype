import React, { useEffect, useRef } from "react";
import { documentPagesByDoc } from "../data/documentContent";
import type { Document } from "../data/scenario";

interface DocumentViewerProps {
  document: Document;
  highlightedPageNum: number | null;
  highlightedText: string | null;
  highlightedBlockId: string | null;
}

function highlightText(
  text: string,
  target: string | null,
  markRef: React.RefObject<HTMLElement>
) {
  if (!target) return <>{text}</>;
  const idx = text.indexOf(target);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        ref={markRef}
        className="bg-yellow-300 text-yellow-900 rounded px-0.5 highlight-pulse"
      >
        {text.slice(idx, idx + target.length)}
      </mark>
      {text.slice(idx + target.length)}
    </>
  );
}

export default function DocumentViewer({
  document: doc,
  highlightedPageNum,
  highlightedText,
  highlightedBlockId,
}: DocumentViewerProps) {
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const markRef = useRef<HTMLElement | null>(null);
  const documentPages = documentPagesByDoc[doc.id] ?? [];
  const shortCitation = `${doc.authors.split(",")[0]} et al. · ${doc.journal}`;

  useEffect(() => {
    // Scroll the highlighted sentence itself into view (centered), not just
    // the top of the page, so participants don't have to hunt for it.
    if (markRef.current) {
      markRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (highlightedPageNum !== null && pageRefs.current[highlightedPageNum]) {
      pageRefs.current[highlightedPageNum]!.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [highlightedPageNum, highlightedText, highlightedBlockId]);

  return (
    <div className="h-full flex flex-col bg-slate-300 overflow-hidden">
      {/* Toolbar */}
      <div className="flex-shrink-0 bg-slate-700 text-slate-100 px-4 py-2 flex items-center gap-3 text-sm">
        <span className="font-semibold truncate">{doc.title}</span>
        <span className="text-slate-400 text-xs flex-shrink-0">
          {doc.authors} · {doc.journal}
        </span>
      </div>

      {/* Pages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {documentPages.map((page) => {
          const isHighlightedPage = page.pageNum === highlightedPageNum;
          return (
            <div
              key={page.pageNum}
              ref={(el) => {
                pageRefs.current[page.pageNum] = el;
              }}
              className={`doc-page transition-shadow duration-300 ${
                isHighlightedPage
                  ? "ring-2 ring-blue-400 ring-offset-2"
                  : ""
              }`}
            >
              {/* Page number header */}
              <div className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">
                Page {page.pageNum}
              </div>

              {page.sections.map((section, si) => (
                <div key={si} className="mb-4">
                  {section.heading && (
                    <h3 className="text-sm font-bold text-slate-800 mb-1 mt-3 first:mt-0">
                      {section.heading}
                    </h3>
                  )}
                  {section.body && (
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {isHighlightedPage
                        ? highlightText(section.body, highlightedText, markRef)
                        : section.body}
                    </p>
                  )}
                </div>
              ))}

              {/* Page footer */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between px-14 text-xs text-slate-400">
                <span>{shortCitation}</span>
                <span>{page.pageNum}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
