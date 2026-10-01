# comment — 댓글

공통 규칙, 오류 응답의 틀, `Author` 는 [README.md](README.md) 에 있다.

## 데이터 구조

### Comment

| 필드 | 타입 | 뜻 |
|---|---|---|
| `commentId` | number | 댓글 식별자 |
| `recipeId` | number | 댓글이 달린 레시피 |
| `content` | string | 댓글 본문 |
| `author` | `Author` | 작성자 |
| `createdAt` | string | 작성 시각 |
| `updatedAt` | string | 마지막으로 고친 시각 |

## API

### 댓글 목록 — `GET /recipes/{recipeId}/comments`

응답 — 200, Comment 의 배열. 먼저 쓴 것이 앞이다.

```json
[
  {
    "commentId": 1,
    "recipeId": 1,
    "content": "맛있어요",
    "author": { "userId": 2, "nickname": "집밥러", "profileImageUrl": null },
    "createdAt": "2024-02-10T03:12:00Z",
    "updatedAt": "2024-02-10T03:12:00Z"
  }
]
```

오류 — 404 `RECIPE_NOT_FOUND`

### 댓글 등록 — `POST /recipes/{recipeId}/comments`

인증이 필요하다.

```json
{ "content": "맛있어요" }
```

응답 — 201, 만들어진 Comment.

오류 — 400 `VALIDATION_FAILED` · 401 `UNAUTHENTICATED` · 404 `RECIPE_NOT_FOUND`

### 댓글 수정 — `PATCH /comments/{commentId}`

인증이 필요하다. 작성자 본인만 할 수 있다.

```json
{ "content": "정말 맛있어요" }
```

응답 — 200, 고쳐진 Comment.

오류 — 400 `VALIDATION_FAILED` · 401 `UNAUTHENTICATED` · 403 `FORBIDDEN` · 404 `COMMENT_NOT_FOUND`

### 댓글 삭제 — `DELETE /comments/{commentId}`

인증이 필요하다. 작성자 본인만 할 수 있다.

응답 — 204.

오류 — 401 `UNAUTHENTICATED` · 403 `FORBIDDEN` · 404 `COMMENT_NOT_FOUND`
