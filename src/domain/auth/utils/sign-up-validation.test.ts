import { describe, expect, it } from 'vitest';

import { SIGN_UP_MESSAGES, validateCredentials, validateProfile } from './sign-up-validation';

function credentials(loginId: string, password: string, passwordConfirm: string) {
  return validateCredentials({ loginId, password, passwordConfirm });
}

describe('validateCredentials', () => {
  it('아이디가 3자면 아이디 문구를 돌려준다', () => {
    expect(credentials('abc', 'password1', 'password1')).toBe('아이디는 4자 이상 입력해주세요.');
  });

  it('아이디가 4자면 아이디 규칙을 통과한다', () => {
    expect(credentials('abcd', 'password1', 'password1')).toBeNull();
  });

  it('비밀번호가 7자면 비밀번호 문구를 돌려준다', () => {
    expect(credentials('abcd', 'passwor', 'passwor')).toBe('비밀번호는 8자 이상 입력해주세요.');
  });

  it('비밀번호가 8자면 비밀번호 규칙을 통과한다', () => {
    expect(credentials('abcd', 'password', 'password')).toBeNull();
  });

  it('비밀번호 확인이 다르면 불일치 문구를 돌려준다', () => {
    expect(credentials('abcd', 'password1', 'password2')).toBe('비밀번호가 일치하지 않습니다.');
  });

  it('아이디와 비밀번호가 함께 걸리면 아이디 문구만 돌려준다', () => {
    expect(credentials('abc', 'short', 'other')).toBe('아이디는 4자 이상 입력해주세요.');
  });

  it('비밀번호 길이와 확인이 함께 걸리면 비밀번호 길이 문구만 돌려준다', () => {
    expect(credentials('abcd', 'short', 'other')).toBe('비밀번호는 8자 이상 입력해주세요.');
  });

  it('공백을 떼지 않고 글자 수를 센다', () => {
    expect(credentials('    ', 'password1', 'password1')).toBeNull();
  });

  it('비밀번호 확인의 공백 차이를 다른 값으로 본다', () => {
    expect(credentials('abcd', 'password1', 'password1 ')).toBe('비밀번호가 일치하지 않습니다.');
  });
});

describe('validateProfile', () => {
  it('닉네임이 비면 닉네임 문구를 돌려준다', () => {
    expect(validateProfile({ nickname: '', email: 'a@b.c' })).toBe('닉네임을 입력해주세요.');
  });

  it('닉네임과 이메일이 함께 걸리면 닉네임 문구만 돌려준다', () => {
    expect(validateProfile({ nickname: '', email: 'abc' })).toBe('닉네임을 입력해주세요.');
  });

  it.each(['a@b.c', 'cook02@example.com'])('형식이 맞는 이메일 %s 은 통과한다', (email) => {
    expect(validateProfile({ nickname: '집밥', email })).toBeNull();
  });

  it.each(['ab.c', 'a@b@c.d', '@b.c', 'a@', 'a@bc', 'a.b@cd', 'a b@c.d', ''])(
    '형식이 틀린 이메일 "%s" 은 이메일 문구를 돌려준다',
    (email) => {
      expect(validateProfile({ nickname: '집밥', email })).toBe('이메일 형식이 올바르지 않습니다.');
    },
  );
});

describe('SIGN_UP_MESSAGES', () => {
  it('아이디 중복 문구가 명세와 같다', () => {
    expect(SIGN_UP_MESSAGES.loginIdDuplicated).toBe('이미 사용 중인 아이디입니다.');
  });
});
