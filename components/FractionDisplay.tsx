"use client";

type Props = {
  numerator: string;
  denominator: string;
  activePart: "num" | "den";
  onSelectPart: (part: "num" | "den") => void;
};

export function FractionDisplay({
  numerator,
  denominator,
  activePart,
  onSelectPart,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-1" aria-label="분수 입력">
      <button
        type="button"
        onClick={() => onSelectPart("num")}
        className={`min-w-[4.5rem] rounded-xl px-4 py-2 text-3xl font-bold tabular-nums transition ${
          activePart === "num"
            ? "bg-teal-600 text-white ring-4 ring-teal-200"
            : "bg-white text-teal-950 ring-2 ring-teal-100"
        }`}
        aria-pressed={activePart === "num"}
        aria-label="분자"
      >
        {numerator || "?"}
      </button>
      <div className="h-1 w-20 rounded-full bg-teal-800" />
      <button
        type="button"
        onClick={() => onSelectPart("den")}
        className={`min-w-[4.5rem] rounded-xl px-4 py-2 text-3xl font-bold tabular-nums transition ${
          activePart === "den"
            ? "bg-teal-600 text-white ring-4 ring-teal-200"
            : "bg-white text-teal-950 ring-2 ring-teal-100"
        }`}
        aria-pressed={activePart === "den"}
        aria-label="분모"
      >
        {denominator || "?"}
      </button>
    </div>
  );
}
