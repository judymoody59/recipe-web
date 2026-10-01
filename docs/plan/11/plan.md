# 로그인·회원가입 화면 — 분해

명세 [`docs/spec/11-login-signup-screens.md`](../../spec/11-login-signup-screens.md) 를 task 10건으로
나눈다. task 의 본문은 [`task.md`](task.md) 에 있다.

## 1. 분해 개요

| task | 태그 | 요약 | 선행 |
|---|---|---|---|
| T1 | feat | Category 타입과 더미 이미지 올리기 함수 추가 | — |
| T2 | feat | 더미 계정과 로그인·회원가입 함수 추가 | T1 |
| T3 | feat | 회원가입 입력 검증 규칙 추가 | — |
| T4 | feat | 공용 아이콘과 입력칸 컴포넌트 추가 | — |
| T5 | feat | 공용 버튼과 상단 바·화면 틀 추가 | — |
| T6 | feat | 로그인 화면 추가 | T2, T4, T5 |
| T7 | feat | 회원가입 단계 표시와 1단계 입력 화면 추가 | T4, T5, T6 |
| T8 | feat | 회원가입 2단계 프로필 입력 화면 추가 | T1, T7 |
| T9 | feat | 회원가입 단계 흐름과 완료 화면 추가 | T2, T3, T8 |
| T10 | feat | 로그인·회원가입 E2E 테스트 추가 | T6, T9 |

순서는 계층을 따른다 — 도메인의 타입·데이터 접근·검증(T1–T3), 공용 UI(T4–T5), 도메인 컴포넌트와
라우트(T6–T9), 화면을 가로지르는 흐름의 검증(T10).

| 계층 | 이 분해가 만드는 것 | task |
|---|---|---|
| `src/lib/` | 오류 틀 `{ code, message }` 를 담는 오류 클래스 | T2 |
| `src/components/` | 아이콘 7종, 입력칸, 버튼, 상단 바, 화면 틀 | T4, T5 |
| `src/domain/recipe/types/` | `Category` 타입, 값 목록, 화면 글자 대응 | T1 |
| `src/domain/upload/api/` | 더미 이미지 올리기 함수 | T1 |
| `src/domain/auth/` | `types/` · `api/` · `hooks/` · `utils/` · `components/` | T2, T3, T6–T9 |
| `src/app/login/`, `src/app/signup/` | 라우트 페이지 | T6, T9 |
| `tests/e2e/` | 로그인·회원가입 흐름 | T10 |

## 2. 브랜치·리뷰 요청·커밋

- 브랜치는 `feat/11-login-signup-screens` 하나다. `develop` 에서 분기하고 task 10건이 함께 쓴다
- 리뷰 요청은 하나다. 대상은 `develop`
- task 하나가 커밋 하나다. 제목은 `feat: <task 요약>(#<task 이슈 번호>)`, 본문 마지막 줄은
  `relates to #11`
- task 이슈 번호는 `script/sync-task-issues.sh 11` 의 출력(`T<N> #<번호>`)에서 읽는다
- 커밋은 T1 부터 번호 순서로 쌓는다. 각 커밋에서 `script/run-lint-test.sh` 가 통과한다

## 3. 전 task 공통 사항

### 코드

- 새 의존 패키지를 더하지 않는다. `package.json` 의 의존 목록이 바뀌지 않는다
- 파일 이름은 kebab-case 다. 테스트는 대상 파일 옆에 `<이름>.test.ts(x)` 로 둔다
- `src/components` 는 `src/domain`·`src/app` 을 import 하지 않는다. 도메인 사이의 import 는
  `auth` → `upload`(올리기 함수), `auth` → `recipe`(`Category`) 둘뿐이다
- `'use client'` 는 상태·이벤트·브라우저 API 를 쓰는 컴포넌트에만 둔다. `src/app/login/page.tsx`·
  `src/app/signup/page.tsx` 는 Server Component 이고 도메인 컴포넌트를 그리기만 한다
- 조건부 클래스 병합은 `src/lib/cn.ts` 의 `cn` 으로 한다
- 디렉터리에 첫 파일이 들어가면 그 디렉터리의 `.gitkeep` 을 지운다

### 더미 데이터

- 더미 계정은 `src/domain/auth/api/` 의 모듈 변수에 둔다. 브라우저 저장소·쿠키·Zustand store·
  TanStack Query 캐시에 넣지 않는다
- 더미 함수(로그인·회원가입·이미지 올리기)는 `Promise` 를 돌려준다. 실패는 오류 틀
  `{ code, message }` 를 담은 오류로 거부한다
- 더미 함수는 클라이언트 컴포넌트에서만 부른다. 화면은 `src/domain/auth/hooks/` 의 TanStack Query
  mutation 훅을 거쳐 부른다
- 화면 사이의 이동은 전부 화면 안의 이동(`next/link`, `next/navigation` 의 라우터)이다.
  문서를 다시 읽어 오는 이동은 메모리의 계정을 비운다

### 모양

- 크기·위치·색·글자 값은 명세 4–6장의 값을 그대로 쓴다. 값을 이 분해에 다시 적지 않는다
- 명세의 x 좌표는 기준 폭 1920px 에서의 값이다. 화면은 가로 가운데(x 960)를 기준으로 배치하고,
  창 폭이 달라져도 가운데에서의 거리가 같다
- 명세의 y 좌표는 문서 맨 위에서의 값이다. 상단 바(높이 150px)가 그 안에 들어 있다
- 색은 Tailwind 의 임의 값 표기로 쓴다. 전역 색 변수나 테마 설정을 더하지 않는다
- 화면에 보이는 문구는 명세의 문구와 글자 하나까지 같다

### 테스트

- 단위·컴포넌트 테스트는 Vitest + Testing Library 다. 사용자가 보는 글자·역할·placeholder 로
  요소를 찾고, 클래스 이름과 내부 상태를 단언하지 않는다
- 테스트 이름은 무엇을 검증하는지 한국어 문장으로 쓴다. 이슈 번호와 테스트 항목 ID 를 넣지 않는다
- 컴포넌트 테스트는 더미 함수를 대역 없이 그대로 쓴다. 각 테스트 앞에서 계정 저장을 시드 상태로
  되돌린다(T2 가 되돌리는 함수를 둔다)
- mutation 훅을 쓰는 컴포넌트는 테스트마다 새 `QueryClient` 로 감싸 그린다
- `next/navigation` 의 라우터는 `vi.mock` 으로 대신하고, 불린 주소를 단언한다
- jsdom 에는 `URL.createObjectURL` 이 없다. 쓰는 테스트는 `vi.stubGlobal` 또는 `vi.spyOn` 으로
  정해진 주소를 돌려주게 한다
- 가입 시각은 `vi.useFakeTimers()` · `vi.setSystemTime()` 으로 고정한다
- 색·위치·크기는 컴포넌트 테스트로 단언하지 않는다. T10 의 E2E 가 계산된 스타일과 요소의 위치·
  크기로 검증한다
- E2E 는 `script/run-lint-test.sh` 에 들어 있지 않다. T10 에서 `pnpm test:e2e` 를 직접 돌리고
  결과를 리뷰 요청에 적는다

## 4. 이번 이슈에서 정하지 않는 값

| 값 | 이번 이슈에서의 상태 |
|---|---|
| 로그인 상태(`accessToken`·`user`)를 두는 곳 | 두지 않는다. 로그인 응답은 버린다 |
| 리포 전체의 데이터 소스 방침 | 정하지 않는다. 메모리 보관은 `auth` 의 더미 계정에만 해당한다 |
| 완료 화면 두 버튼의 이동처 | 연결하지 않는다 |
| 기준 폭과 다른 창에서의 축소·반응형 배치 | 만들지 않는다 |
| 프로필 사진 파일의 크기 제한 | 두지 않는다 |
