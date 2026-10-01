# recipe — 레시피

공통 규칙, 오류 응답의 틀, `Author` 는 [README.md](README.md) 에 있다.

## 데이터 구조

### Recipe

| 필드 | 타입 | 뜻 |
|---|---|---|
| `recipeId` | number | 레시피 식별자 |
| `title` | string | 제목 |
| `content` | string | 조리법 본문 |
| `ingredients` | string | 재료. 한 문자열이다 |
| `imageUrl` | string \| null | 대표 이미지 URL |
| `category` | `Category` | 음식 종류 |
| `difficulty` | `Difficulty` | 난이도 |
| `author` | `Author` | 작성자 |
| `createdAt` | string | 등록 시각 |
| `updatedAt` | string | 마지막으로 고친 시각 |

### RecipeSummary

목록에 쓰는 형태다. Recipe 에서 `content` 와 `ingredients` 를 뺀 것이다.

### Category

| 값 | 뜻 |
|---|---|
| `KOREAN` | 한식 |
| `CHINESE` | 중식 |
| `JAPANESE` | 일식 |
| `WESTERN` | 양식 |
| `OTHERS` | 기타 |

### Difficulty

| 값 | 뜻 |
|---|---|
| `VERY_EASY` | 매우 쉬움 |
| `EASY` | 쉬움 |
| `NORMAL` | 보통 |
| `HARD` | 어려움 |
| `VERY_HARD` | 매우 어려움 |

## API

### 레시피 목록 — `GET /recipes`

응답 — 200, RecipeSummary 의 배열. 최근에 등록한 것이 앞이다.

```json
[
  {
    "recipeId": 1,
    "title": "김치찌개",
    "imageUrl": "https://images.example.com/3f2a9c.png",
    "category": "KOREAN",
    "difficulty": "EASY",
    "author": { "userId": 1, "nickname": "요리왕", "profileImageUrl": null },
    "createdAt": "2024-02-09T09:46:44Z",
    "updatedAt": "2024-02-09T09:46:44Z"
  }
]
```

### 레시피 상세 — `GET /recipes/{recipeId}`

응답 — 200, Recipe.

```json
{
  "recipeId": 1,
  "title": "김치찌개",
  "content": "1. 김치를 볶는다. 2. 물을 붓고 끓인다.",
  "ingredients": "김치, 돼지고기, 두부",
  "imageUrl": "https://images.example.com/3f2a9c.png",
  "category": "KOREAN",
  "difficulty": "EASY",
  "author": { "userId": 1, "nickname": "요리왕", "profileImageUrl": null },
  "createdAt": "2024-02-09T09:46:44Z",
  "updatedAt": "2024-02-09T09:46:44Z"
}
```

오류 — 404 `RECIPE_NOT_FOUND`

### 레시피 등록 — `POST /recipes`

인증이 필요하다.

| 필드 | 타입 | 필수 | 뜻 |
|---|---|---|---|
| `title` | string | ✓ | 제목 |
| `content` | string | ✓ | 조리법 본문 |
| `ingredients` | string | ✓ | 재료 |
| `category` | `Category` | ✓ | 음식 종류 |
| `difficulty` | `Difficulty` | ✓ | 난이도 |
| `imageUrl` | string \| null | | [이미지 올리기](upload.md)가 돌려준 URL |

```json
{
  "title": "김치찌개",
  "content": "1. 김치를 볶는다. 2. 물을 붓고 끓인다.",
  "ingredients": "김치, 돼지고기, 두부",
  "category": "KOREAN",
  "difficulty": "EASY",
  "imageUrl": "https://images.example.com/3f2a9c.png"
}
```

응답 — 201, 만들어진 Recipe.

오류 — 400 `VALIDATION_FAILED` · 401 `UNAUTHENTICATED`

### 레시피 수정 — `PATCH /recipes/{recipeId}`

인증이 필요하다. 작성자 본인만 할 수 있다. 요청은 등록과 같은 필드이고 전부 선택이다.

응답 — 200, 고쳐진 Recipe.

오류 — 400 `VALIDATION_FAILED` · 401 `UNAUTHENTICATED` · 403 `FORBIDDEN` · 404 `RECIPE_NOT_FOUND`

### 레시피 삭제 — `DELETE /recipes/{recipeId}`

인증이 필요하다. 작성자 본인만 할 수 있다. 그 레시피의 댓글도 함께 지워진다.

응답 — 204.

오류 — 401 `UNAUTHENTICATED` · 403 `FORBIDDEN` · 404 `RECIPE_NOT_FOUND`

## 화면과의 대응

홈의 인기·랜덤 레시피를 따로 주는 API 는 없다. 목록 하나에서 화면이 골라 쓴다.
인기를 가를 값(조회 수·좋아요 수)은 Recipe 에 없다.
