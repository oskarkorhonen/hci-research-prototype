import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  progress?: string;
  children: ReactNode;
};

// Centered single-column layout shared by every screen that is not a task.
export default function PageShell({ title, subtitle, progress, children }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        <header className="space-y-1">
          {progress && (
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              {progress}
            </p>
          )}
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-600 leading-relaxed">{subtitle}</p>}
        </header>
        {children}
      </div>
    </main>
  );
}

type CardProps = { children: ReactNode };

export function Card({ children }: CardProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-6 space-y-5">
      {children}
    </section>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
};

export function PrimaryButton({ children, onClick, isDisabled = false }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}
