<!--
이 파일은 프로젝트가 소유한다. 하네스 갱신이 덮지 않는다.
`.ai/templates/code-reviewer.md` 의 마지막 장이 이 파일을 읽는다.

**이 리포에서만 성립하는 점검을 심각도와 함께 적는다.** 일반론은 적지 않는다 —
계약의 앞 장들이 이미 덮는다. 비워 두면 그 장을 건너뛴다.
-->

| 점검 | 심각도 |
|---|---|
| 서버 상태(원격·API 라우트에서 오는 캐시 가능한 데이터)를 Zustand 에 넣었다. 서버 상태는 TanStack Query 가 갖는다 | major |
| `NEXT_PUBLIC_` 이 아닌 환경 변수를 클라이언트 컴포넌트(`'use client'`)에서 참조한다 | major |
| 환경 변수를 `process.env` 로 직접 읽고 `src/global/config/env.ts` 의 zod 스키마를 거치지 않는다 | minor |
| 외부 백엔드 호출을 추가했다. 이 리포는 외부 백엔드와 연동하지 않는다 | blocker |
