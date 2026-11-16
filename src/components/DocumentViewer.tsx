import { useEffect, useRef } from "react";
import type { ReactNode, RefObject, UIEvent } from "react";
import type { SourceDocument } from "../data/types";

export interface Highlight {
  pageNum: number;
  text: string;
  // Changes on every citation click so clicking the same citation twice
  // scrolls back to the passage.
  token: number;
}

type Props = {
  document: SourceDocument;
  highlight: Highlight | null;
  onUserScroll?: (scrollFraction: number) => void;
};

// Scroll events that follow a citation jump are the viewer moving itself, not
// the participant reading. They are ignored for this long after a jump.
const PROGRAMMATIC_SCROLL_WINDOW_MS = 300;

function renderBody(body: string, target: string | null, markRef: RefObject<HTMLElement>): ReactNode {
  if (!target) return body;
  const start = body.indexOf(target);
  if (start === -1) return body;
  return (
    <>
      {body.slice(0, start)}
      <mark ref={markRef} className="bg-yellow-300 text-yellow-900 rounded px-0.5 highlight-pulse">
        {target}
      </mark>
      {body.slice(start + target.length)}
    </>
  );
}

export default function DocumentViewer({ document: doc, highlight, onUserScroll }: Props) {
  const markRef = useRef<HTMLElement>(null);
  const lastJumpAt = useRef(0);
  const shortCitation = `${doc.authors.split(",")[0]} et al. · ${doc.journal}`;

  useEffect(() => {
    if (!highlight || !markRef.current) return;
    lastJumpAt.current = Date.now();
    markRef.current.scrollIntoView({ behavior: "auto", block: "center" });
  }, [highlight]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    if (!onUserScroll) return;
    if (Date.now() - lastJumpAt.current < PROGRAMMATIC_SCROLL_WINDOW_MS) return;
    const element = event.currentTarget;
    const scrollable = element.scrollHeight - element.clientHeight;
    onUserScroll(scrollable > 0 ? element.scrollTop / scrollable : 0);
  }

  return (
    <div className="h-full flex flex-col bg-slate-300 overflow-hidden">
      <div className="flex-shrink-0 bg-slate-700 text-slate-100 px-4 py-2 flex items-center gap-3 text-sm">
        <span className="font-semibold truncate">{doc.title}</span>
        <span className="text-slate-400 text-xs flex-shrink-0">{shortCitation}</span>
      </div>

      <div
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
        onScroll={handleScroll}
        tabIndex={0}
        role="region"
        aria-label="Source report"
      >
        {doc.pages.map((page) => {
          const target = highlight?.pageNum === page.pageNum ? highlight.text : null;
          return (
            <article
              key={page.pageNum}
              className={`doc-page transition-shadow duration-300 ${
                target ? "ring-2 ring-blue-400 ring-offset-2" : ""
              }`}
            >
              <p className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">
                Page {page.pageNum}
              </p>
              {page.sections.map((section, index) => (
                <div key={`${page.pageNum}-${index}`} className="mb-4">
                  {section.heading && (
                    <h3 className="text-sm font-bold text-slate-800 mb-1 mt-3 first:mt-0">
                      {section.heading}
                    </h3>
                  )}
                  {section.body && (
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {renderBody(section.body, target, markRef)}
                    </p>
                  )}
                </div>
              ))}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between px-14 text-xs text-slate-400">
                <span>{shortCitation}</span>
                <span>{page.pageNum}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
