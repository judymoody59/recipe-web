import { expect, test, type Locator, type Page } from '@playwright/test';

import {
  DARK,
  GRAY,
  PLACEHOLDER,
  RED,
  VIEWPORT,
  STEP_LABELS,
  button,
  field,
  login,
  open,
  passCredentialsStep,
  passProfileStep,
  pill,
  rect,
  style,
} from './support';

test.use({ viewport: VIEWPORT });

const FIELD = { width: 601, height: 120 };
const WHITE = 'rgb(255, 255, 255)';

function signUpLink(page: Page) {
  return page.getByRole('link', { name: '회원가입' });
}

// 채워진 알약이 그 단계 하나뿐인지 본다. 나머지 알약은 점선을 가리는 흰 바탕이다.
async function expectOnlyFilledPill(page: Page, label: string) {
  await expect(page.locator('[aria-current="step"]')).toHaveText(label);
  for (const each of STEP_LABELS) {
    expect(await style(pill(page, each), 'backgroundColor')).toBe(each === label ? GRAY : WHITE);
  }
}

// 입력칸 틀 안에서 글자색을 따라 칠해지는 아이콘
function fieldIcon(control: Locator) {
  return control.locator('..').locator('span[aria-hidden="true"]');
}

test('로그인 대조 화면의 요소가 피그마의 자리에 있다', async ({ page }) => {
  await open(page, '/login2');

  expect(await rect(page.getByRole('banner'))).toEqual({ x: 0, y: 0, width: 1920, height: 150 });
  expect(await rect(page.getByText('로고', { exact: true }))).toEqual({
    x: 870,
    y: 46,
    width: 180,
    height: 58,
  });
  expect(await rect(page.getByRole('heading', { name: '로그인' }))).toMatchObject({
    y: 290,
    height: 25,
  });
  expect(await rect(field(page, '아이디'))).toEqual({ x: 660, y: 392, ...FIELD });
  expect(await rect(field(page, '비밀번호'))).toEqual({ x: 660, y: 542, ...FIELD });
  expect(await rect(fieldIcon(field(page, '아이디')))).toEqual({
    x: 698,
    y: 424,
    width: 55,
    height: 55,
  });
  expect(await rect(button(page, '로그인'))).toEqual({ x: 660, y: 747, ...FIELD });
  expect(await rect(signUpLink(page))).toMatchObject({ y: 897, height: 25 });
});

test('로그인 대조 화면이 피그마의 글꼴과 아이콘을 쓴다', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    const { hostname } = new URL(request.url());
    if (hostname !== 'localhost') externalRequests.push(request.url());
  });
  await open(page, '/login2');

  const heading = page.getByRole('heading', { name: '로그인' });
  expect(await heading.evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(
    /^"?Inter"?,/,
  );
  expect(await page.evaluate(() => document.fonts.check('36px Inter'))).toBe(true);
  expect(
    await fieldIcon(field(page, '아이디')).evaluate(
      (element) => getComputedStyle(element).maskImage,
    ),
  ).toContain('/figma/auth/person.svg');
  expect(externalRequests).toEqual([]);
});

test('로그인 대조 화면도 입력에 따라 입력칸과 버튼의 색이 바뀐다', async ({ page }) => {
  await open(page, '/login2');
  const loginId = field(page, '아이디');
  const password = field(page, '비밀번호');
  const submit = button(page, '로그인');
  const loginIdIcon = fieldIcon(loginId);

  await expect(submit).toBeDisabled();
  expect(await style(submit, 'backgroundColor')).toBe(GRAY);
  expect(await style(loginIdIcon, 'backgroundColor')).toBe(PLACEHOLDER);

  await loginId.fill('recipe01');
  await expect(submit).toBeDisabled();
  expect(await style(loginId, 'color')).toBe(DARK);
  expect(await style(loginIdIcon, 'backgroundColor')).toBe(DARK);

  await password.fill('pass1234');
  await expect(submit).toBeEnabled();
  expect(await style(submit, 'backgroundColor')).toBe(DARK);
  expect(await rect(submit)).toEqual({ x: 660, y: 747, ...FIELD });

  await loginId.fill('');
  await expect(submit).toBeDisabled();
  expect(await style(loginIdIcon, 'backgroundColor')).toBe(PLACEHOLDER);
});

test('로그인 대조 화면의 오류 상태가 피그마의 자리에 있다', async ({ page }) => {
  await open(page, '/login2');
  const linkBefore = await rect(signUpLink(page));

  await login(page, 'recipe01', 'wrong1234');

  const firstLine = page.getByText('아이디 또는 비밀번호를 잘못 입력했습니다.');
  const secondLine = page.getByText('입력하신 내용을 다시 확인해주세요.');
  await expect(firstLine).toBeVisible();
  expect(await style(firstLine, 'color')).toBe(RED);
  expect(await rect(firstLine)).toMatchObject({ y: 703, height: 32 });
  expect(await rect(secondLine)).toMatchObject({ y: 735, height: 32 });
  expect(await rect(field(page, '비밀번호'))).toEqual({ x: 660, y: 542, ...FIELD });
  expect(await rect(button(page, '로그인'))).toEqual({ x: 660, y: 787, ...FIELD });
  expect((await rect(signUpLink(page))).y - linkBefore.y).toBe(40);
  await expect(page).toHaveURL('/login2');
});

test('로그인 대조 화면에서 시드 계정으로 로그인하면 홈으로 이동한다', async ({ page }) => {
  await open(page, '/login2');

  await login(page, 'recipe01', 'pass1234');

  await expect(page).toHaveURL('/');
});

test('대조 화면끼리 오간다', async ({ page }) => {
  await open(page, '/login2');

  await signUpLink(page).click();
  await expect(page).toHaveURL('/signup2');
  await expect(field(page, '비밀번호 확인')).toBeVisible();

  await button(page, '취소').click();
  await expect(page).toHaveURL('/login2');
  await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
});

test('회원가입 대조 화면이 단계마다 피그마의 자리에 있다', async ({ page }) => {
  await open(page, '/signup2');

  await expectOnlyFilledPill(page, '아이디/비밀번호 설정');
  expect(await rect(pill(page, '아이디/비밀번호 설정'))).toEqual({
    x: 242,
    y: 230,
    width: 273,
    height: 70,
  });
  expect(await rect(pill(page, '프로필 설정'))).toMatchObject({ x: 824, y: 230 });
  expect(await rect(pill(page, '회원가입 완료'))).toMatchObject({ x: 1405, y: 230 });
  expect(await rect(field(page, '아이디'))).toEqual({ x: 660, y: 395, ...FIELD });
  expect(await rect(field(page, '비밀번호'))).toEqual({ x: 660, y: 545, ...FIELD });
  expect(await rect(field(page, '비밀번호 확인'))).toEqual({ x: 660, y: 695, ...FIELD });
  expect(await rect(button(page, '취소'))).toEqual({ x: 242, y: 881, width: 200, height: 84 });
  expect(await rect(button(page, '다음'))).toEqual({ x: 1478, y: 881, width: 200, height: 84 });

  await passCredentialsStep(page, 'cook02');

  await expectOnlyFilledPill(page, '프로필 설정');
  expect(await rect(field(page, '닉네임'))).toEqual({ x: 809, y: 395, ...FIELD });
  expect(await rect(field(page, '이메일'))).toEqual({ x: 809, y: 545, ...FIELD });
  expect(await rect(page.getByRole('combobox', { name: '선호 카테고리' }))).toEqual({
    x: 809,
    y: 695,
    ...FIELD,
  });
  expect(await rect(page.locator('label'))).toEqual({ x: 491, y: 477, width: 221, height: 221 });
  expect(await rect(button(page, '이전'))).toEqual({ x: 242, y: 881, width: 200, height: 84 });

  await passProfileStep(page);

  await expectOnlyFilledPill(page, '회원가입 완료');
  expect(await rect(page.getByText('회원가입이 성공적으로'))).toMatchObject({
    y: 506,
    height: 60,
  });
  expect(await rect(button(page, '마이페이지로 이동'))).toEqual({
    x: 535,
    y: 777,
    width: 400,
    height: 90,
  });
  expect(await rect(button(page, '홈으로 이동'))).toEqual({
    x: 985,
    y: 777,
    width: 400,
    height: 90,
  });
  await expect(page).toHaveURL('/signup2');
});

test('회원가입 대조 화면의 오류 문구가 입력칸과 버튼 줄 사이에 보인다', async ({ page }) => {
  await open(page, '/signup2');

  await button(page, '다음').click();

  const message = page.getByText('아이디는 4자 이상 입력해주세요.');
  await expect(message).toBeVisible();
  expect(await style(message, 'color')).toBe(RED);
  const box = await rect(message);
  expect(box.y).toBeGreaterThanOrEqual(815);
  expect(box.y + box.height).toBeLessThanOrEqual(881);
  await expectOnlyFilledPill(page, '아이디/비밀번호 설정');
});

test('창이 1920 보다 넓으면 크기가 같고 가운데에 있다', async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1080 });
  await open(page, '/login2');

  expect(await rect(page.getByRole('banner'))).toMatchObject({ x: 0, width: 2560, height: 150 });
  expect(await rect(page.getByText('로고', { exact: true }))).toEqual({
    x: 1190,
    y: 46,
    width: 180,
    height: 58,
  });
  expect(await rect(field(page, '아이디'))).toEqual({ x: 980, y: 392, ...FIELD });
  expect(await rect(button(page, '로그인'))).toEqual({ x: 980, y: 747, ...FIELD });
});

// 1280 은 1920 의 3분의 2 다.
test('창이 1920 보다 좁으면 화면 전체가 같은 비율로 줄어든다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await open(page, '/login2');

  expect(await rect(page.getByRole('banner'))).toEqual({ x: 0, y: 0, width: 1280, height: 100 });
  expect(await rect(page.getByText('로고', { exact: true }))).toMatchObject({
    x: 580,
    width: 120,
  });
  expect(await rect(field(page, '아이디'))).toEqual({ x: 440, y: 261, width: 401, height: 80 });
  expect(await rect(button(page, '로그인'))).toEqual({ x: 440, y: 498, width: 401, height: 80 });
  expect(
    await page
      .getByRole('heading', { name: '로그인' })
      .evaluate((element) => getComputedStyle(element).fontSize),
  ).toBe('24px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1280);

  await open(page, '/signup2');

  expect(await rect(pill(page, '회원가입 완료'))).toEqual({
    x: 937,
    y: 153,
    width: 182,
    height: 47,
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1280);
});
