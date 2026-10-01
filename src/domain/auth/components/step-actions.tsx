import { Button } from '@/components/button';

type StepActionsProps = {
  leftLabel: string;
  onLeftClick: () => void;
  onNextClick: () => void;
};

// 1·2단계 아래의 버튼 줄. "다음" 은 언제나 눌린다.
export function StepActions({ leftLabel, onLeftClick, onNextClick }: StepActionsProps) {
  return (
    <div className="flex w-[1436px] justify-between">
      <Button variant="outline" onClick={onLeftClick} className="h-[84px] w-[200px]">
        {leftLabel}
      </Button>
      <Button variant="muted" onClick={onNextClick} className="h-[84px] w-[200px]">
        다음
      </Button>
    </div>
  );
}
