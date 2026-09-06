type Props = {
  isCorrect: boolean;
  explanation: string;
  displayAnswer: string;
  onNext: () => void;
  isLast: boolean;
};

export function FeedbackBanner({
  isCorrect,
  explanation,
  displayAnswer,
  onNext,
  isLast,
}: Props) {
  return (
    <div
      className={`animate-pop rounded-2xl border p-4 ${
        isCorrect
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : "border-amber-200 bg-amber-50 text-amber-950"
      }`}
      role="status"
      aria-live="polite"
    >
      <p className="font-[family-name:var(--font-display)] text-xl font-bold">
        {isCorrect ? "정답이에요! 잘했어요" : "아깝워요! 다시 보면 쉬워요"}
      </p>
      {!isCorrect && (
        <p className="mt-1 text-base font-semibold">정답: {displayAnswer}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed opacity-90">{explanation}</p>
      <button type="button" onClick={onNext} className="btn-primary mt-4 w-full">
        {isLast ? "결과 보기" : "다음 문제"}
      </button>
    </div>
  );
}
