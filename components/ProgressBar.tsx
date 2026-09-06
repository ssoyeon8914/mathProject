type Props = {
  /** Completed count for the bar fill */
  completed: number;
  total: number;
  /** Displayed problem number (1-based) */
  currentLabel: number;
};

export function ProgressBar({ completed, total, currentLabel }: Props) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full" aria-label={`문제 ${currentLabel} / ${total}, 완료 ${completed}`}>
      <div className="mb-1 flex items-center justify-between text-sm font-semibold text-teal-900/70">
        <span>
          {currentLabel} / {total} 문제
        </span>
        <span>완료 {percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-teal-100">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
