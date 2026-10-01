import { expect, test } from '@playwright/test';

import {
  DARK,
  GRAY,
  PLACEHOLDER,
  RED,
  VIEWPORT,
  button,
  field,
  login,
  open,
  rect,
  style,
} from './support';

test.use({ viewport: VIEWPORT });

const ERROR_LINE_1 = '아이디 또는 비밀번호를 잘못 입력했습니다.';
const ERROR_LINE_2 = '입력하신 내용을 다시 확인해주세요.';

test('로그인 화면의 요소가 시안의 자리에 있다', async ({ page }) => {
  await open(page, '/login');

  expect(await rect(field(page, '아이디'))).toEqual({ x: 660, y: 392, width: 600, height: 120 });
  expect(await rect(field(page, '비밀번호'))).toEqual({ x: 660, y: 542, width: 600, height: 120 });
  expect(await rect(button(page, '로그인'))).toEqual({ x: 660, y: 747, width: 600, height: 120 });
  expect(await rect(page.getByRole('banner'))).toMatchObject({
    x: 0,
    y: 0,
    width: 1920,
    height: 150,
  });
  await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
  await expect(page.getByRole('link', { name: '회원가입' })).toBeVisible();
  await expect(field(page, '비밀번호')).toHaveAttribute('type', 'password');
});

test('입력에 따라 입력칸과 로그인 버튼의 색이 바뀐다', async ({ page }) => {
  await open(page, '/login');
  const loginId = field(page, '아이디');
  const password = field(page, '비밀번호');
  const submit = button(page, '로그인');
  const loginIdIcon = loginId.locator('..').locator('svg');
  const placeholderColor = () =>
    loginId.evaluate((element) => getComputedStyle(element, '::placeholder').color);

  await expect(submit).toBeDisabled();
  expect(await style(submit, 'backgroundColor')).toBe(GRAY);
  expect(await placeholderColor()).toBe(PLACEHOLDER);
  expect(await style(loginIdIcon, 'color')).toBe(PLACEHOLDER);

  await loginId.fill('recipe01');
  await expect(submit).toBeDisabled();
  expect(await style(submit, 'backgroundColor')).toBe(GRAY);
  expect(await style(loginId, 'color')).toBe(DARK);
  expect(await style(loginIdIcon, 'color')).toBe(DARK);

  await password.fill('pass1234');
  await expect(submit).toBeEnabled();
  expect(await style(submit, 'backgroundColor')).toBe(DARK);
  expect(await style(password, 'color')).toBe(DARK);

  expect(await rect(loginId)).toEqual({ x: 660, y: 392, width: 600, height: 120 });
  expect(await rect(password)).toEqual({ x: 660, y: 542, width: 600, height: 120 });
  expect(await rect(submit)).toEqual({ x: 660, y: 747, width: 600, height: 120 });

  await loginId.fill('');
  await expect(submit).toBeDisabled();
  expect(await style(submit, 'backgroundColor')).toBe(GRAY);
  expect(await style(loginIdIcon, 'color')).toBe(PLACEHOLDER);
});

test('로그인 오류 상태의 배치가 시안과 같다', async ({ page }) => {
  await open(page, '/login');
  const linkBefore = await rect(page.getByRole('link', { name: '회원가입' }));

  await login(page, 'nobody', 'pass1234');

  const firstLine = page.getByText(ERROR_LINE_1);
  const secondLine = page.getByText(ERROR_LINE_2);
  await expect(firstLine).toBeVisible();
  await expect(secondLine).toBeVisible();
  expect(await style(firstLine, 'color')).toBe(RED);
  expect(await style(secondLine, 'color')).toBe(RED);

  const password = await rect(field(page, '비밀번호'));
  const submit = await rect(button(page, '로그인'));
  const first = await rect(firstLine);
  const second = await rect(secondLine);
  expect(await rect(field(page, '아이디'))).toEqual({ x: 660, y: 392, width: 600, height: 120 });
  expect(password).toEqual({ x: 660, y: 542, width: 600, height: 120 });
  expect(submit).toEqual({ x: 660, y: 785, width: 600, height: 120 });
  expect(first.y).toBeGreaterThanOrEqual(password.y + password.height);
  expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
  expect(second.y + second.height).toBeLessThanOrEqual(submit.y);

  const linkAfter = await rect(page.getByRole('link', { name: '회원가입' }));
  expect(linkAfter.y - linkBefore.y).toBe(38);
  await expect(page).toHaveURL('/login');
});

test('있는 아이디에 틀린 비밀번호도 같은 오류 문구를 보여준다', async ({ page }) => {
  await open(page, '/login');

  await login(page, 'recipe01', 'wrong1234');

  await expect(page.getByText(ERROR_LINE_1)).toBeVisible();
  await expect(page.getByText(ERROR_LINE_2)).toBeVisible();
  await expect(field(page, '아이디')).toHaveValue('recipe01');
  await expect(field(page, '비밀번호')).toHaveValue('wrong1234');
});

test('시드 계정으로 로그인하면 홈으로 이동하고 저장소가 비어 있다', async ({ page }) => {
  await open(page, '/login');

  await login(page, 'recipe01', 'pass1234');

  await expect(page).toHaveURL('/');
  const stored = await page.evaluate(() =>
    [localStorage, sessionStorage].flatMap((storage) => [
      storage.getItem('accessToken'),
      storage.getItem('user'),
    ]),
  );
  expect(stored).toEqual([null, null, null, null]);
});

// 1280 은 내용의 가장 넓은 폭(1436)보다 좁은 창이다.
for (const width of [2560, 1440, 1280]) {
  test(`창 폭 ${width} 에서 로그인 화면의 크기가 같고 가운데에 있다`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1080 });
    await open(page, '/login');

    const logo = await rect(page.getByText('로고', { exact: true }));
    expect(logo).toMatchObject({ width: 180, height: 58 });
    expect(logo.x + logo.width / 2).toBe(width / 2);

    for (const placeholder of ['아이디', '비밀번호']) {
      const box = await rect(field(page, placeholder));
      expect(box).toMatchObject({ width: 600, height: 120 });
      expect(box.x + box.width / 2).toBe(width / 2);
    }
    const submit = await rect(button(page, '로그인'));
    expect(submit).toMatchObject({ width: 600, height: 120 });
    expect(submit.x + submit.width / 2).toBe(width / 2);
  });
}
