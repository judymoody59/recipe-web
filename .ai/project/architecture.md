<!--
이 파일은 프로젝트가 소유한다. 하네스 갱신이 덮지 않는다.
**보호 문서다** — 에이전트가 근거로 읽고 스스로 고치지 못한다.

실제 디렉터리 구조에서 읽어낸 것만 적는다. 없는 구조를 지어내지 않는다.
-->

### 계층과 의존 방향

Next.js App Router 위의 도메인 기반 폴더 구조다. `@/*` 는 `src/*` 를 가리킨다.

| 디렉터리 | 역할 | import 할 수 있는 곳 |
|---|---|---|
| `src/app/` | 라우팅 엔트리. 페이지·레이아웃만 두고 로직은 최소로 | 전부 |
| `src/domain/<이름>/` | 도메인 모듈 (recipe · comment · auth · upload). 아직 비어 있다 | `lib` `hooks` `components` `global` |
| `src/components/` | 도메인에 묶이지 않는 공용 UI. 아직 비어 있다 | `lib` `hooks` `global` |
| `src/hooks/` | 공용 커스텀 훅. 아직 비어 있다 | `lib` `global` |
| `src/global/` | 횡단 관심사 — `config/env.ts`(환경 변수 zod 검증), `providers/query-provider.tsx` | `lib` |
| `src/lib/` | 비도메인 유틸 — `cn.ts` | 외부 패키지만 |
| `src/test/` | Vitest 설정 파일 | — |

도메인 모듈 안은 필요한 것만 만든다 — `api/`(데이터 접근 함수), `hooks/`(TanStack Query 래퍼),
`store/`(도메인 Zustand store), `components/`, `types/`, `utils/`.

- 서버 상태는 TanStack Query 가, 클라이언트 UI 상태는 Zustand 가 갖는다
- 기본은 Server Component 다. `'use client'` 는 상태·이벤트·브라우저 API 가 필요한 곳에만 둔다
- 환경 변수는 `src/global/config/env.ts` 의 zod 스키마를 거쳐 읽는다

### 검사하는 것

- `src/lib` `src/hooks` `src/components` `src/global` 이 `src/domain`·`src/app` 을 import 하지 않는다
- `src/domain` 이 `src/app` 을 import 하지 않는다

`from '…'` 형태의 정적 import 만 본다 — `@/` 별칭과 `../` 상대 경로 둘 다. 동적 `import()`,
공용 계층 사이의 방향(`lib` → `global` 등), 도메인 간 import 는 검사하지 않는다.

### 검사하지 않는 것 (현재 상태 기록)

없음

### 아키텍처 특성

<!--
새 구조를 만들기 전에 기존 방식으로 해결되는지 먼저 확인하게 하는 항목들.
**최소 둘은 채운다** — 비면 리뷰어가 과설계를 지적할 근거를 잃는다.
-->

- 공용 유틸·훅·UI 는 이미 있는 자리(`src/lib` · `src/hooks` · `src/components`)에 더한다.
  새 최상위 디렉터리를 만들기 전에 여섯 자리(`app` `domain` `components` `hooks` `lib` `global`)로
  해결되는지 먼저 본다
- 원격 데이터 캐시는 `QueryProvider` 의 TanStack Query 로 한다. 별도 캐시 계층이나 전역 store 를
  새로 만들지 않는다
- 조건부 클래스 병합은 `src/lib/cn.ts` 의 `cn` 으로 한다
- 외부 백엔드가 없다. HTTP 클라이언트·인터셉터 같은 원격 연동 계층을 미리 만들지 않는다
