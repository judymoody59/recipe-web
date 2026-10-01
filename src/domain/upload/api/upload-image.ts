export type UploadImageResponse = {
  url: string;
};

// 서버에 올리지 않고 브라우저 안에서 그 파일을 가리키는 주소를 만들어 돌려준다.
export async function uploadImage(file: File): Promise<UploadImageResponse> {
  return { url: URL.createObjectURL(file) };
}
