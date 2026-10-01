import { expect, test } from '@playwright/test';

import {
  DARK,
  RED,
  STEP_LABELS,
  VIEWPORT,
  button,
  choosePhoto,
  enterSignUpFromLogin,
  expectOnlyFilledPill,
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

const DUPLICATED_MESSAGE = '이미 사용 중인 아이디입니다.';
const LOGIN_ERROR = '아이디 또는 비밀번호를 잘못 입력했습니다.';

test('회원가입 1단계의 요소가 시안의 자리에 있다', async ({ page }) => {
  await enterSignUpFromLogin(page);

  const pillXs = [242, 824, 1405];
  for (const [index, label] of STEP_LABELS.entries()) {
    expect(await rect(pill(page, label))).toEqual({
      x: pillXs[index],
      y: 230,
      width: 273,
      height: 70,
    });
  }
  await expectOnlyFilledPill(page, '아이디/비밀번호 설정');
  expect(await rect(field(page, '아이디'))).toEqual({ x: 660, y: 395, width: 600, height: 120 });
  expect(await rect(field(page, '비밀번호'))).toEqual({ x: 660, y: 545, width: 600, height: 120 });
  expect(await rect(field(page, '비밀번호 확인'))).toEqual({
    x: 660,
    y: 695,
    width: 600,
    height: 120,
  });
  expect(await rect(button(page, '취소'))).toEqual({ x: 242, y: 881, width: 200, height: 84 });
  expect(await rect(button(page, '다음'))).toEqual({ x: 1478, y: 881, width: 200, height: 84 });
});

test('1단계 취소가 로그인 화면으로 간다', async ({ page }) => {
  await open(page, '/signup');

  await button(page, '취소').click();

  await expect(page).toHaveURL('/login');
});

test('1단계 규칙에 걸리면 처음 걸린 문구 하나만 보이고 넘어가지 않는다', async ({ page }) => {
  await open(page, '/signup');
  await field(page, '아이디').fill('abc');
  await field(page, '비밀번호').fill('short');
  await field(page, '비밀번호 확인').fill('other');

  await button(page, '다음').click();

  const message = page.getByText('아이디는 4자 이상 입력해주세요.');
  await expect(message).toBeVisible();
  await expect(page.getByText('비밀번호는 8자 이상 입력해주세요.')).toHaveCount(0);
  await expect(page.getByText('비밀번호가 일치하지 않습니다.')).toHaveCount(0);
  expect(await style(message, 'color')).toBe(RED);
  await expectOnlyFilledPill(page, '아이디/비밀번호 설정');
  expect(await rect(button(page, '다음'))).toEqual({ x: 1478, y: 881, width: 200, height: 84 });
});

test('회원가입 2단계의 요소가 시안의 자리에 있다', async ({ page }) => {
  await open(page, '/signup');

  await passCredentialsStep(page, 'cook02');

  await expect(page).toHaveURL('/signup');
  await expectOnlyFilledPill(page, '프로필 설정');
  const fileInput = page.getByLabel('프로필 사진', { exact: true });
  const circle = page.locator('label').filter({ has: fileInput });
  expect(await rect(circle)).toEqual({ x: 491, y: 477, width: 221, height: 221 });
  expect(await rect(field(page, '닉네임'))).toEqual({ x: 809, y: 395, width: 600, height: 120 });
  expect(await rect(field(page, '이메일'))).toEqual({ x: 809, y: 545, width: 600, height: 120 });
  const category = page.getByRole('combobox', { name: '선호 카테고리' });
  expect(await rect(category)).toEqual({ x: 809, y: 695, width: 600, height: 120 });
  await expect(fileInput).toHaveAttribute('accept', 'image/*');
  expect(await rect(button(page, '이전'))).toEqual({ x: 242, y: 881, width: 200, height: 84 });
  expect(await rect(button(page, '다음'))).toEqual({ x: 1478, y: 881, width: 200, height: 84 });
});

test('고른 사진이 원을 채운다', async ({ page }) => {
  await open(page, '/signup');
  await passCredentialsStep(page, 'cook02');
  const photo = page.getByRole('img', { name: '선택한 프로필 사진' });

  await choosePhoto(page, 'red');

  await expect(photo).toBeVisible();
  expect(await rect(photo)).toEqual({ x: 491, y: 477, width: 221, height: 221 });
  const firstSrc = (await photo.getAttribute('src')) ?? '';
  expect(firstSrc).toMatch(/^blob:/);

  await choosePhoto(page, 'blue');

  await expect(photo).not.toHaveAttribute('src', firstSrc);
  await expect(photo).toHaveAttribute('src', /^blob:/);
});

test('선호 카테고리를 고르면 그 화면 글자가 보인다', async ({ page }) => {
  await open(page, '/signup');
  await passCredentialsStep(page, 'cook02');
  const category = page.getByRole('combobox', { name: '선호 카테고리' });
  await expect(category.locator('option:not([hidden])')).toHaveText([
    '한식',
    '중식',
    '일식',
    '양식',
    '기타',
  ]);

  await category.selectOption({ label: '양식' });

  await expect(category).toHaveValue('WESTERN');
  expect(await style(category, 'color')).toBe(DARK);
});

test('단계를 오가도 양쪽 입력값이 그대로 있다', async ({ page }) => {
  await open(page, '/signup');
  await passCredentialsStep(page, 'cook02');
  const category = page.getByRole('combobox', { name: '선호 카테고리' });
  const photo = page.getByRole('img', { name: '선택한 프로필 사진' });
  await field(page, '닉네임').fill('집밥');
  await field(page, '이메일').fill('cook02@example.com');
  await choosePhoto(page, 'red');
  await category.selectOption({ label: '양식' });
  await expect(photo).toBeVisible();
  const photoSrc = (await photo.getAttribute('src')) ?? '';

  await button(page, '이전').click();

  await expect(field(page, '아이디')).toHaveValue('cook02');
  await expect(field(page, '비밀번호')).toHaveValue('password2');
  await expect(field(page, '비밀번호 확인')).toHaveValue('password2');

  await button(page, '다음').click();

  await expect(field(page, '닉네임')).toHaveValue('집밥');
  await expect(field(page, '이메일')).toHaveValue('cook02@example.com');
  await expect(category).toHaveValue('WESTERN');
  await expect(photo).toHaveAttribute('src', photoSrc);
});

test('2단계 규칙에 걸리면 처음 걸린 문구 하나만 보이고 넘어가지 않는다', async ({ page }) => {
  await open(page, '/signup');
  await passCredentialsStep(page, 'cook02');
  await field(page, '이메일').fill('cook02');

  await button(page, '다음').click();

  await expect(page.getByText('닉네임을 입력해주세요.')).toBeVisible();
  await expect(page.getByText('이메일 형식이 올바르지 않습니다.')).toHaveCount(0);
  await expectOnlyFilledPill(page, '프로필 설정');
});

test('가입한 계정으로 로그인된다', async ({ page }) => {
  await enterSignUpFromLogin(page);
  await passCredentialsStep(page, 'cook02');
  await passProfileStep(page);

  await expect(page.getByText('회원가입이 성공적으로')).toBeVisible();
  await expect(page.getByText('완료되었습니다!')).toBeVisible();
  await expectOnlyFilledPill(page, '회원가입 완료');
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
  await expect(button(page, '이전')).toHaveCount(0);
  await expect(button(page, '다음')).toHaveCount(0);
  await expect(page).toHaveURL('/signup');

  await page.goBack();
  await expect(page).toHaveURL('/login');

  await login(page, 'cook02', 'password2');
  await expect(page).toHaveURL('/');
});

test('완료 화면의 버튼은 눌러도 이동하지 않는다', async ({ page }) => {
  await open(page, '/signup');
  await passCredentialsStep(page, 'cook02');
  await passProfileStep(page);
  await expect(page.getByText('회원가입이 성공적으로')).toBeVisible();

  await button(page, '마이페이지로 이동').click();
  await button(page, '홈으로 이동').click();

  await expect(page).toHaveURL('/signup');
  await expect(page.getByText('회원가입이 성공적으로')).toBeVisible();
});

test('새로고침하면 가입한 계정이 사라진다', async ({ page }) => {
  await enterSignUpFromLogin(page);
  await passCredentialsStep(page, 'cook02');
  await passProfileStep(page);
  await expect(page.getByText('회원가입이 성공적으로')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL('/login');

  await page.reload({ waitUntil: 'networkidle' });
  await login(page, 'cook02', 'password2');

  await expect(page.getByText(LOGIN_ERROR)).toBeVisible();
  await expect(page).toHaveURL('/login');
});

test('회원가입 도중 새로고침하면 1단계이고 비어 있다', async ({ page }) => {
  await open(page, '/signup');
  await passCredentialsStep(page, 'cook02');
  await field(page, '닉네임').fill('집밥');
  await field(page, '이메일').fill('cook02@example.com');

  await page.reload({ waitUntil: 'networkidle' });

  await expectOnlyFilledPill(page, '아이디/비밀번호 설정');
  await expect(field(page, '아이디')).toHaveValue('');
  await expect(field(page, '비밀번호')).toHaveValue('');
  await expect(field(page, '비밀번호 확인')).toHaveValue('');
});

test('뒤로가기가 단계를 되돌리지 않는다', async ({ page }) => {
  await enterSignUpFromLogin(page);
  await passCredentialsStep(page, 'cook02');
  await expectOnlyFilledPill(page, '프로필 설정');

  await page.goBack();

  await expect(page).toHaveURL('/login');
});

test('이미 있는 아이디로 가입하면 1단계에서 알린다', async ({ page }) => {
  await open(page, '/signup');
  await passCredentialsStep(page, 'recipe01');
  await passProfileStep(page);

  const message = page.getByText(DUPLICATED_MESSAGE);
  await expect(message).toBeVisible();
  await expectOnlyFilledPill(page, '아이디/비밀번호 설정');
  expect(await style(message, 'color')).toBe(RED);
  await expect(field(page, '아이디')).toHaveValue('recipe01');
  await expect(field(page, '비밀번호')).toHaveValue('password2');
  await expect(field(page, '비밀번호 확인')).toHaveValue('password2');

  const lastField = await rect(field(page, '비밀번호 확인'));
  const actions = await rect(button(page, '다음'));
  const text = await rect(message);
  expect(actions).toEqual({ x: 1478, y: 881, width: 200, height: 84 });
  expect(await rect(button(page, '취소'))).toMatchObject({ y: 881 });
  expect(text.y).toBeGreaterThanOrEqual(lastField.y + lastField.height);
  expect(text.y + text.height).toBeLessThanOrEqual(actions.y);
});

for (const width of [2560, 1440]) {
  test(`창 폭 ${width} 에서 회원가입 화면의 크기가 같고 가운데에 있다`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1080 });
    await open(page, '/signup');

    for (const placeholder of ['아이디', '비밀번호', '비밀번호 확인']) {
      const box = await rect(field(page, placeholder));
      expect(box).toMatchObject({ width: 600, height: 120 });
      expect(box.x + box.width / 2).toBe(width / 2);
    }
    expect(await rect(pill(page, '프로필 설정'))).toMatchObject({ width: 273, height: 70 });
    expect(await rect(button(page, '다음'))).toMatchObject({ width: 200, height: 84 });
  });
}

test('외부 호스트로 나가는 요청이 없다', async ({ page, baseURL }) => {
  const urls: string[] = [];
  page.on('request', (request) => urls.push(request.url()));

  await enterSignUpFromLogin(page);
  await passCredentialsStep(page, 'cook02');
  await choosePhoto(page, 'red');
  await expect(page.getByRole('img', { name: '선택한 프로필 사진' })).toBeVisible();
  await passProfileStep(page);
  await expect(page.getByText('회원가입이 성공적으로')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL('/login');
  await login(page, 'nobody', 'pass1234');
  await expect(page.getByText(LOGIN_ERROR)).toBeVisible();
  await login(page, 'cook02', 'password2');
  await expect(page).toHaveURL('/');

  const hosts = urls
    .filter((url) => !url.startsWith('blob:') && !url.startsWith('data:'))
    .map((url) => new URL(url).host);
  expect(hosts.length).toBeGreaterThan(0);
  expect(new Set(hosts)).toEqual(new Set([new URL(baseURL ?? '').host]));
});
