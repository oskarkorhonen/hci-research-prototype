// Shared types for the study materials. One scenario = one trial = one
// fictional source report plus the three-claim AI summary shown next to it.

export type Domain = "library" | "model" | "postmortem";
export type TrialType = "AI-Correct" | "AI-Incorrect";
export type BlockId = "b1" | "b2" | "b3";
export type Answer = "Yes" | "No";

export interface PageSection {
  heading?: string;
  body: string;
}

export interface PageContent {
  pageNum: number;
  sections: PageSection[];
}

export interface Citation {
  // Copied verbatim from exactly one section body on page_num, so the viewer
  // can find and highlight it.
  exact_text: string;
  page_num: number;
}

export interface SummaryBlock {
  id: BlockId;
  text: string;
  label: string;
  citation: Citation;
}

export interface SourceDocument {
  id: string;
  title: string;
  authors: string;
  journal: string;
  pages: PageContent[];
}

export interface Scenario {
  id: string;
  domain: Domain;
  // AI-Incorrect: the key block misstates its cited passage and the correct
  // answer is "No". AI-Correct: all three blocks are accurate, answer "Yes".
  trial_type: TrialType;
  research_question: string;
  correct_answer: Answer;
  // The claim the decision hinges on. The Forced interface opens this block's
  // passage for its mandatory review, on accurate and inaccurate trials alike.
  key_block_id: BlockId;
  document: SourceDocument;
  ai_summary_blocks: SummaryBlock[];
}
