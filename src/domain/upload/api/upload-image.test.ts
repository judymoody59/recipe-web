import { afterEach, describe, expect, it, vi } from 'vitest';

import { uploadImage } from './upload-image';

describe('uploadImage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('올리기 함수가 파일의 브라우저 안 주소를 돌려준다', async () => {
    const createObjectURL = vi.fn(() => 'blob:test/1');
    vi.stubGlobal('URL', { createObjectURL });
    const file = new File(['png'], 'photo.png', { type: 'image/png' });

    await expect(uploadImage(file)).resolves.toEqual({ url: 'blob:test/1' });

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(createObjectURL).toHaveBeenCalledWith(file);
  });
});
