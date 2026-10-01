export function TopBar() {
  return (
    <header className="relative h-[150px] w-full bg-white">
      <div className="absolute top-[46px] left-1/2 flex h-[58px] w-[180px] -translate-x-1/2 items-center justify-center rounded-[6px] bg-[#F4F4F4] text-[18px] font-bold text-[#ABABAB]">
        로고
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-full left-0 h-[40px] w-full bg-linear-to-b from-[#F1F1F1] to-white"
      />
    </header>
  );
}
