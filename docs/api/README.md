# API·데이터 구조

이 리포가 가정하는 API 계약과 데이터 구조다. **실제 서버는 없다.** 화면은 이 구조를 따르는
더미 데이터로 동작하고, 더미 데이터의 필드 이름·타입·응답 형태는 이 문서와 같아야 한다.

## 문서

| 문서 | 도메인 | 다루는 것 |
|---|---|---|
| [auth.md](auth.md) | `auth` | 사용자, 회원가입, 로그인, 로그아웃 |
| [recipe.md](recipe.md) | `recipe` | 레시피 등록·조회·수정·삭제 |
| [comment.md](comment.md) | `comment` | 댓글 등록·조회·수정·삭제 |
| [upload.md](upload.md) | `upload` | 이미지 올리기 |

## 공통 규칙

- 요청·응답 본문은 JSON 이다. 이미지 올리기의 요청만 `multipart/form-data` 다
- 필드 이름은 camelCase 다 (`recipeId`, `createdAt`)
- 경로의 자원 이름은 복수형이다 (`/recipes`, `/comments`, `/users`)
- 식별자(`userId`, `recipeId`, `commentId`)는 서버가 1부터 올려 가며 매기는 정수다
- 시각은 UTC 기준 ISO 8601 문자열이다 — 예 `2024-02-09T09:46:44Z`
- 값이 없는 필드는 빼지 않고 `null` 로 보낸다
- 수정(`PATCH`)은 보낸 필드만 바꾼다
- 목록은 전체를 배열로 돌려준다. 페이지 나누기·정렬·검색 조건이 없다

### 성공 응답

| 경우 | HTTP 상태 | 본문 |
|---|---|---|
| 조회·수정 | 200 | 자원 |
| 등록 | 201 | 만들어진 자원 |
| 삭제·로그아웃 | 204 | 없음 |

### 오류 응답

모든 오류는 같은 틀이다.

```json
{ "code": "RECIPE_NOT_FOUND", "message": "레시피를 찾을 수 없습니다." }
```

| HTTP 상태 | `code` | 언제 |
|---|---|---|
| 400 | `VALIDATION_FAILED` | 필수 필드가 없거나 값의 형식이 틀렸다 |
| 401 | `INVALID_CREDENTIALS` | 로그인 아이디 또는 비밀번호가 틀렸다 |
| 401 | `UNAUTHENTICATED` | 토큰이 없거나 유효하지 않다 |
| 403 | `FORBIDDEN` | 자기 것이 아닌 레시피·댓글을 고치거나 지우려 했다 |
| 404 | `USER_NOT_FOUND` | 사용자가 없다 |
| 404 | `RECIPE_NOT_FOUND` | 레시피가 없다 |
| 404 | `COMMENT_NOT_FOUND` | 댓글이 없다 |
| 409 | `DUPLICATED_LOGIN_ID` | 이미 쓰이는 로그인 아이디다 |
| 500 | `INTERNAL_ERROR` | 서버 오류 |

`message` 는 사람이 읽는 설명이다. **화면에 보이는 문구는 `message` 가 아니라 화면 명세가 정한다.**
화면은 `code` 로 분기한다.

## 인증

로그인이 돌려준 `accessToken` 을 요청 헤더에 싣는다.

```
Authorization: Bearer <accessToken>
```

| 인증이 필요 없다 | 인증이 필요하다 |
|---|---|
| 회원가입, 로그인 | 로그아웃, 내 정보 조회 |
| 레시피·댓글 조회 | 레시피·댓글 등록·수정·삭제 |
| 이미지 올리기 | |

레시피와 댓글의 수정·삭제는 **작성자 본인만** 할 수 있다.

## 작성자 표기

레시피와 댓글은 작성자를 같은 형태로 담는다.

### Author

| 필드 | 타입 | 뜻 |
|---|---|---|
| `userId` | number | 작성자의 사용자 식별자 |
| `nickname` | string | 작성자의 닉네임 |
| `profileImageUrl` | string \| null | 작성자의 프로필 사진 URL |

작성자는 요청 본문으로 보내지 않는다. 서버가 토큰의 사용자로 채운다.
