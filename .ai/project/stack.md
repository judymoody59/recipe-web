<!--
이 파일은 프로젝트가 소유한다. 하네스 갱신이 덮지 않는다.
**버전을 여기 복제하지 않는다.** 의존성 매니페스트를 가리킨다 — 복제하면 반드시 낡는다.
매니페스트만 봐서는 알 수 없는 대조 결과(예: 설계상 예정이나 아직 미도입인 것)만 여기 남긴다.
-->

TypeScript(strict) · Next.js App Router · React. 패키지 매니저는 pnpm(`packageManager` 로 고정),
스타일은 Tailwind CSS v4, 린트는 ESLint flat config, 포맷은 Prettier, 단위 테스트는 Vitest(jsdom) +
Testing Library, E2E 는 Playwright.

- 공통 라이브러리 중 Zustand · react-hook-form · Radix UI · date-fns / date-fns-tz 는 설치만 되어 있고
  아직 쓰는 코드가 없다
- E2E 는 설정만 있고 테스트가 없다

**정확한 버전과 의존성 목록은 `package.json` 과 `pnpm-lock.yaml` 이 정본이다.**
