import { SCALE_POINTS } from "../study/questionnaire";

type Props = {
  id: string;
  number?: number;
  question: string;
  anchors: readonly string[];
  value: number | undefined;
  onChange: (value: number) => void;
};

export default function RatingScale({ id, number, question, anchors, value, onChange }: Props) {
  return (
    <fieldset className="space-y-3">
      <legend className="flex items-start gap-2 text-sm font-medium text-slate-800">
        {number !== undefined && (
          <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
            {number}
          </span>
        )}
        <span>{question}</span>
      </legend>
      <div className="grid grid-cols-5 gap-2">
        {SCALE_POINTS.map((point) => {
          const isSelected = value === point;
          return (
            <label
              key={point}
              className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-400 ${
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
              }`}
            >
              <input
                type="radio"
                name={id}
                value={point}
                checked={isSelected}
                onChange={() => onChange(point)}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{point}</span>
              <span className="text-[11px] leading-tight">{anchors[point - 1]}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
