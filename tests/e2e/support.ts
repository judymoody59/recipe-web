import { expect, type Locator, type Page } from '@playwright/test';

export const VIEWPORT = { width: 1920, height: 1080 };

export const GRAY = 'rgb(176, 176, 176)';
export const DARK = 'rgb(41, 45, 50)';
export const PLACEHOLDER = 'rgb(171, 171, 171)';
export const RED = 'rgb(255, 0, 0)';
export const TRANSPARENT = 'rgba(0, 0, 0, 0)';

export const STEP_LABELS = ['아이디/비밀번호 설정', '프로필 설정', '회원가입 완료'];

// 주소를 직접 열고, 입력을 받을 수 있을 때까지 기다린다.
export async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' });
}

export async function rect(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('요소가 화면에 없다');
  return {
    x: Math.round(box.x),
    y: Math.round(box.y),
    width: Math.round(box.width),
    height: Math.round(box.height),
  };
}

export function style(locator: Locator, property: 'color' | 'backgroundColor') {
  return locator.evaluate((element, name) => getComputedStyle(element)[name], property);
}

export function field(page: Page, placeholder: string) {
  return page.getByPlaceholder(placeholder, { exact: true });
}

export function button(page: Page, name: string) {
  return page.getByRole('button', { name, exact: true });
}

export function pill(page: Page, label: string) {
  return page.getByRole('listitem').filter({ hasText: label });
}

// 채워진 알약이 그 단계 하나뿐인지 본다.
export async function expectOnlyFilledPill(page: Page, label: string) {
  await expect(page.locator('[aria-current="step"]')).toHaveText(label);
  for (const each of STEP_LABELS) {
    expect(await style(pill(page, each), 'backgroundColor')).toBe(
      each === label ? GRAY : TRANSPARENT,
    );
  }
}

export async function login(page: Page, loginId: string, password: string) {
  await field(page, '아이디').fill(loginId);
  await field(page, '비밀번호').fill(password);
  await button(page, '로그인').click();
}

export async function passCredentialsStep(page: Page, loginId: string) {
  await field(page, '아이디').fill(loginId);
  await field(page, '비밀번호').fill('password2');
  await field(page, '비밀번호 확인').fill('password2');
  await button(page, '다음').click();
}

export async function passProfileStep(page: Page) {
  await field(page, '닉네임').fill('집밥');
  await field(page, '이메일').fill('cook02@example.com');
  await button(page, '다음').click();
}

// 로그인 화면에서 "회원가입 →" 으로 회원가입 화면에 들어간다.
export async function enterSignUpFromLogin(page: Page) {
  await open(page, '/login');
  await page.getByRole('link', { name: '회원가입' }).click();
  await expect(page).toHaveURL('/signup');
  await expect(field(page, '아이디')).toBeVisible();
}

// 한 점짜리 PNG. 색만 다른 두 장이다.
const PNG_BASE64 = {
  red: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
  blue: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==',
};

export async function choosePhoto(page: Page, color: keyof typeof PNG_BASE64) {
  await page.getByLabel('프로필 사진', { exact: true }).setInputFiles({
    name: `${color}.png`,
    mimeType: 'image/png',
    buffer: Buffer.from(PNG_BASE64[color], 'base64'),
  });
}
