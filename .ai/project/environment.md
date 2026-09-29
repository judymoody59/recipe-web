<!--
이 파일은 프로젝트가 소유한다. 하네스 갱신이 덮지 않는다.
**값을 적지 않는다.** 항목명과 취득 경로만 적는다 — 시크릿은 리포에 남기지 않는다.
-->

### 필요한 도구

- Node.js — 의존성이 선언한 `engines` 의 교집합은 `^20.19.0 || ^22.13.0 || >=24.0.0` 이다(jsdom 이 가장
  좁다). `package.json` 에 `engines` 를 두지 않았으므로 설치 시 강제되지 않는다
- pnpm — 버전은 `package.json` 의 `packageManager` 가 정본이다. `corepack enable` 로 맞춘다
- Playwright 브라우저 — E2E 를 돌릴 때만. `pnpm exec playwright install chromium`
- git 훅(`script/githooks/`)은 **git 실행 파일의 CPU 아키텍처로** node 를 띄운다. Apple Silicon 에서
  x86_64 git 을 쓰면 훅 안의 `pnpm test` 가 x64 네이티브 바인딩을 찾다 실패한다 —
  arm64 git 을 쓰거나 두 아키텍처의 바인딩을 함께 설치한다

### 환경 변수

| 이름 | 용도 | 어디서 얻나 |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | 실행 환경 `local` · `dev` · `prod`. 비우면 `local`. `prod` 가 아니면 React Query Devtools 를 붙인다 | 로컬은 `.env.example` 을 `.env.local` 로 복사한다. 배포 환경은 아직 없다 |

### 외부 시스템

없음. 외부 백엔드와 연동하지 않는다.
