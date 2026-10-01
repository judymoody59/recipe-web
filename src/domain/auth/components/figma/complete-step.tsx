import { FigmaButton } from './button';

const buttonClassName = 'absolute top-627 h-90 w-400 rounded-[calc(var(--spacing)*45)]';

// 두 버튼은 아직 어디로도 이동하지 않는다.
export function FigmaCompleteStep() {
  return (
    <>
      <p className="absolute inset-x-0 top-356 text-center text-[length:calc(var(--spacing)*40)] leading-60 font-semibold text-black">
        <span className="block">회원가입이 성공적으로</span>
        <span className="block">완료되었습니다!</span>
      </p>
      <FigmaButton variant="subtle" className={`${buttonClassName} left-535`}>
        마이페이지로 이동
      </FigmaButton>
      <FigmaButton variant="subtle" className={`${buttonClassName} left-985`}>
        홈으로 이동
      </FigmaButton>
    </>
  );
}
