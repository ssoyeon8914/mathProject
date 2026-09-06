"use client";

type Props = {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onDecimal?: () => void;
  showDecimal?: boolean;
  disabled?: boolean;
};

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export function NumberKeypad({
  onDigit,
  onBackspace,
  onClear,
  onDecimal,
  showDecimal = false,
  disabled = false,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="숫자 키패드">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(key)}
          className="keypad-btn"
        >
          {key}
        </button>
      ))}
      <button type="button" disabled={disabled} onClick={onClear} className="keypad-btn keypad-btn-muted">
        지움
      </button>
      <button type="button" disabled={disabled} onClick={() => onDigit("0")} className="keypad-btn">
        0
      </button>
      {showDecimal ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onDecimal}
          className="keypad-btn keypad-btn-muted"
        >
          .
        </button>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={onBackspace}
          className="keypad-btn keypad-btn-muted"
          aria-label="지우기"
        >
          ←
        </button>
      )}
      {showDecimal && (
        <button
          type="button"
          disabled={disabled}
          onClick={onBackspace}
          className="keypad-btn keypad-btn-muted col-span-3"
          aria-label="한 글자 지우기"
        >
          ← 한 글자 지우기
        </button>
      )}
    </div>
  );
}
