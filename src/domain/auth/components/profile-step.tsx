'use client';

import { useId, type ChangeEvent } from 'react';

import { BadgeIcon } from '@/components/icons/badge-icon';
import { FaceIcon } from '@/components/icons/face-icon';
import { MailIcon } from '@/components/icons/mail-icon';
import { UploadIcon } from '@/components/icons/upload-icon';
import { TextField, TextFieldFrame, textFieldControlClassName } from '@/components/text-field';
import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/domain/recipe/types/category';
import { uploadImage } from '@/domain/upload/api/upload-image';
import { cn } from '@/lib/cn';

import type { ProfileInput } from '../utils/sign-up-validation';
import { ErrorMessage } from './error-message';
import { StepActions } from './step-actions';

export type ProfileValues = ProfileInput & {
  profileImageUrl: string | null;
  preferredCategory: Category | null;
};

type ProfileStepProps = {
  values: ProfileValues;
  onChange: <Field extends keyof ProfileValues>(field: Field, value: ProfileValues[Field]) => void;
  errorMessage: string | null;
  onPrevious: () => void;
  onNext: () => void;
};

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function ProfileStep({
  values,
  onChange,
  errorMessage,
  onPrevious,
  onNext,
}: ProfileStepProps) {
  const photoLabelId = useId();

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const { url } = await uploadImage(file);
    onChange('profileImageUrl', url);
  }

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    onChange('preferredCategory', isCategory(value) ? value : null);
  }

  return (
    <div>
      <div className="relative h-[581px] w-[1436px]">
        <div className="absolute top-[177px] left-[249px] flex w-[221px] flex-col items-center">
          <label className="relative block h-[221px] w-[221px] cursor-pointer overflow-hidden rounded-full bg-[#ABABAB] text-[#5D5D5D] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#292D32]">
            <input
              type="file"
              accept="image/*"
              aria-labelledby={photoLabelId}
              onChange={handleFileChange}
              className="sr-only"
            />
            {values.profileImageUrl !== null ? (
              // 브라우저 안의 주소라 이미지 최적화를 거칠 수 없다.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.profileImageUrl}
                alt="선택한 프로필 사진"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <UploadIcon />
              </span>
            )}
          </label>
          <span
            id={photoLabelId}
            className="mt-[23px] text-[28px] leading-[36px] font-medium text-[#5D5D5D]"
          >
            프로필 사진
          </span>
        </div>
        <div className="absolute top-[95px] left-[567px] flex flex-col gap-[30px]">
          <TextField
            icon={<BadgeIcon />}
            placeholder="닉네임"
            value={values.nickname}
            onChange={(value) => onChange('nickname', value)}
          />
          <TextField
            icon={<MailIcon />}
            placeholder="이메일"
            value={values.email}
            onChange={(value) => onChange('email', value)}
          />
          <TextFieldFrame icon={<FaceIcon />} filled={values.preferredCategory !== null}>
            <select
              aria-label="선호 카테고리"
              value={values.preferredCategory ?? ''}
              onChange={handleCategoryChange}
              className={cn(
                textFieldControlClassName,
                'cursor-pointer appearance-none pr-[80px]',
                values.preferredCategory === null && 'text-[#ABABAB]',
              )}
            >
              <option value="" disabled hidden>
                선호 카테고리
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category} className="text-[#292D32]">
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              focusable="false"
              width="22"
              height="19"
              viewBox="0 0 22 19"
              fill="currentColor"
              className="pointer-events-none absolute top-[calc(50%+2.5px)] right-[39px] -translate-y-1/2 text-[#ABABAB]"
            >
              <path d="M0 0h22L11 19 0 0Z" />
            </svg>
          </TextFieldFrame>
        </div>
        {errorMessage !== null && (
          <div className="absolute inset-x-0 top-[532px]">
            <ErrorMessage lines={[errorMessage]} />
          </div>
        )}
      </div>
      <StepActions leftLabel="이전" onLeftClick={onPrevious} onNextClick={onNext} />
    </div>
  );
}
