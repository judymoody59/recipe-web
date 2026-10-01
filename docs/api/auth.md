# auth — 사용자와 인증

공통 규칙과 오류 응답의 틀은 [README.md](README.md) 에 있다.

## 데이터 구조

### User

| 필드 | 타입 | 뜻 |
|---|---|---|
| `userId` | number | 사용자 식별자 |
| `loginId` | string | 로그인 아이디. 사용자마다 다르다 |
| `nickname` | string | 닉네임 |
| `email` | string | 이메일 |
| `profileImageUrl` | string \| null | 프로필 사진 URL |
| `preferredCategory` | `Category` \| null | 선호 카테고리. 값의 종류는 [recipe.md](recipe.md) |
| `role` | `Role` | 계정 종류 |
| `createdAt` | string | 가입 시각 |
| `updatedAt` | string | 마지막으로 고친 시각 |

**비밀번호는 User 에 없다.** 회원가입과 로그인의 요청 본문에만 있고 어떤 응답에도 담기지 않는다.

### Role

| 값 | 뜻 |
|---|---|
| `USER` | 일반 사용자. 회원가입으로 만들어지는 계정은 모두 이 값이다 |
| `ADMIN` | 관리자 |

## API

### 회원가입 — `POST /users`

요청

| 필드 | 타입 | 필수 | 뜻 |
|---|---|---|---|
| `loginId` | string | ✓ | 로그인 아이디 |
| `password` | string | ✓ | 비밀번호 |
| `nickname` | string | ✓ | 닉네임 |
| `email` | string | ✓ | 이메일 |
| `profileImageUrl` | string \| null | | [이미지 올리기](upload.md)가 돌려준 URL |
| `preferredCategory` | `Category` \| null | | 선호 카테고리 |

```json
{
  "loginId": "recipe01",
  "password": "pass1234",
  "nickname": "요리왕",
  "email": "recipe01@example.com",
  "profileImageUrl": null,
  "preferredCategory": "KOREAN"
}
```

화면의 "비밀번호 확인" 은 화면에서만 검증하고 보내지 않는다.
길이·문자 종류 같은 입력 제한은 이 문서가 아니라 화면 명세가 정한다.

응답 — 201, 만들어진 User. 가입만으로 로그인되지 않는다. 토큰은 로그인으로 받는다

```json
{
  "userId": 1,
  "loginId": "recipe01",
  "nickname": "요리왕",
  "email": "recipe01@example.com",
  "profileImageUrl": null,
  "preferredCategory": "KOREAN",
  "role": "USER",
  "createdAt": "2024-02-09T09:46:44Z",
  "updatedAt": "2024-02-09T09:46:44Z"
}
```

오류

| HTTP 상태 | `code` | 언제 |
|---|---|---|
| 400 | `VALIDATION_FAILED` | 필수 필드가 없거나 이메일·카테고리 값의 형식이 틀렸다 |
| 409 | `DUPLICATED_LOGIN_ID` | 이미 쓰이는 로그인 아이디다 |

### 로그인 — `POST /auth/login`

요청

```json
{ "loginId": "recipe01", "password": "pass1234" }
```

응답 — 200

| 필드 | 타입 | 뜻 |
|---|---|---|
| `accessToken` | string | 이후 요청의 `Authorization` 헤더에 싣는 토큰 |
| `user` | User | 로그인한 사용자 |

```json
{
  "accessToken": "<토큰>",
  "user": {
    "userId": 1,
    "loginId": "recipe01",
    "nickname": "요리왕",
    "email": "recipe01@example.com",
    "profileImageUrl": null,
    "preferredCategory": "KOREAN",
    "role": "USER",
    "createdAt": "2024-02-09T09:46:44Z",
    "updatedAt": "2024-02-09T09:46:44Z"
  }
}
```

오류

| HTTP 상태 | `code` | 언제 |
|---|---|---|
| 400 | `VALIDATION_FAILED` | `loginId` 또는 `password` 가 없다 |
| 401 | `INVALID_CREDENTIALS` | 아이디가 없거나 비밀번호가 틀렸다 |

아이디가 없는 경우와 비밀번호가 틀린 경우를 **구분해서 알려주지 않는다.** 둘 다 같은 오류다.

### 로그아웃 — `POST /auth/logout`

인증이 필요하다. 요청 본문이 없다. 응답 — 204. 그 뒤로 그 토큰은 쓸 수 없다.

### 내 정보 조회 — `GET /users/me`

인증이 필요하다. 응답 — 200, 토큰의 사용자인 User.

오류

| HTTP 상태 | `code` | 언제 |
|---|---|---|
| 401 | `UNAUTHENTICATED` | 토큰이 없거나 유효하지 않다 |
