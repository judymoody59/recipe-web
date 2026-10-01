# upload — 이미지

공통 규칙과 오류 응답의 틀은 [README.md](README.md) 에 있다.

## API

### 이미지 올리기 — `POST /uploads`

인증이 필요 없다. 회원가입 도중 프로필 사진을 올릴 때는 아직 계정이 없기 때문이다.

요청 — `multipart/form-data`

| 이름 | 타입 | 뜻 |
|---|---|---|
| `file` | 파일 | 올릴 이미지 한 개 |

응답 — 201

```json
{ "url": "https://images.example.com/3f2a9c.png" }
```

- 저장 이름은 서버가 새로 매긴다. 같은 이름의 파일을 올려도 서로 덮어쓰지 않는다
- 이미지는 돌려받은 URL 로 바로 읽는다. 내려받기용 API 가 따로 없다

오류 — 400 `VALIDATION_FAILED` (`file` 이 없거나 이미지가 아니다)

## 올린 이미지를 쓰는 곳

올리기가 돌려준 `url` 을 **그대로** 아래 필드에 넣는다.

| 쓰는 곳 | 필드 |
|---|---|
| 회원가입 | `profileImageUrl` |
| 레시피 등록·수정 | `imageUrl` |
