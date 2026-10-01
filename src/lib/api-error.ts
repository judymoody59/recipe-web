// 오류 응답의 틀 `{ code, message }` 를 담는다. 화면은 `code` 로 분기한다.
export class ApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}
