import { Button } from '@/components/button';

// 두 버튼은 아직 어디로도 이동하지 않는다.
export function CompleteStep() {
  return (
    <div className="relative h-[581px] w-[1436px]">
      <p className="absolute inset-x-0 top-[206px] text-center text-[40px] leading-[60px] font-bold text-black">
        <span className="block">회원가입이 성공적으로</span>
        <span className="block">완료되었습니다!</span>
      </p>
      <Button variant="subtle" className="absolute top-[477px] left-[293px] h-[90px] w-[400px]">
        마이페이지로 이동
      </Button>
      <Button variant="subtle" className="absolute top-[477px] left-[743px] h-[90px] w-[400px]">
        홈으로 이동
      </Button>
    </div>
  );
}
