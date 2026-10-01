type FigmaErrorMessageProps = {
  // 화면에 보일 줄 단위의 문구
  lines: string[];
};

export function FigmaErrorMessage({ lines }: FigmaErrorMessageProps) {
  return (
    <p
      role="alert"
      className="text-center text-[length:calc(var(--spacing)*24)] leading-32 font-normal whitespace-nowrap text-[#ff0000]"
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}
