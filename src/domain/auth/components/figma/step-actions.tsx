import { FigmaButton } from './button';

type FigmaStepActionsProps = {
  leftLabel: string;
  onLeftClick: () => void;
  onNextClick: () => void;
};

const buttonClassName = 'h-[calc(var(--spacing)*84.211)] w-200 rounded-[calc(var(--spacing)*70)]';

// 1·2단계 아래의 버튼 줄. "다음" 은 언제나 눌린다.
export function FigmaStepActions({ leftLabel, onLeftClick, onNextClick }: FigmaStepActionsProps) {
  return (
    <div className="absolute top-731 left-242 flex w-1436 justify-between">
      <FigmaButton variant="outline" onClick={onLeftClick} className={buttonClassName}>
        {leftLabel}
      </FigmaButton>
      <FigmaButton variant="muted" onClick={onNextClick} className={buttonClassName}>
        다음
      </FigmaButton>
    </div>
  );
}
