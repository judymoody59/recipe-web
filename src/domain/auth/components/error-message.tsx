type ErrorMessageProps = {
  // 화면에 보일 줄 단위의 문구
  lines: string[];
};

export function ErrorMessage({ lines }: ErrorMessageProps) {
  return (
    <p role="alert" className="text-center text-[24px] leading-[32px] font-normal text-[#FF0000]">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}
