'use client';

import { useId, type ChangeEvent } from 'react';

import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/domain/recipe/types/category';
import { uploadImage } from '@/domain/upload/api/upload-image';
import { cn } from '@/lib/cn';

import type { ProfileValues } from '../profile-step';
import { FigmaErrorMessage } from './error-message';
import { FigmaAsset } from './figma-asset';
import { FigmaStepActions } from './step-actions';
import { FigmaFieldFrame, FigmaTextField, figmaFieldControlClassName } from './text-field';

type FigmaProfileStepProps = {
  values: ProfileValues;
  onChange: <Field extends keyof ProfileValues>(field: Field, value: ProfileValues[Field]) => void;
  errorMessage: string | null;
  onPrevious: () => void;
  onNext: () => void;
};

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function FigmaProfileStep({
  values,
  onChange,
  errorMessage,
  onPrevious,
  onNext,
}: FigmaProfileStepProps) {
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
    <>
      <div className="absolute top-327 left-491 flex w-221 flex-col items-center">
        <label className="relative block size-221 cursor-pointer overflow-hidden rounded-full bg-[#ababab] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#292d32]">
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
            <FigmaAsset name="upload" className="absolute top-61 left-61 size-100" />
          )}
        </label>
        <span
          id={photoLabelId}
          className="mt-29 text-[length:calc(var(--spacing)*28)] leading-25 font-medium whitespace-nowrap text-[#5d5d5d]"
        >
          프로필 사진
        </span>
      </div>
      <div className="absolute top-245 left-809 flex flex-col gap-30">
        <FigmaTextField
          icon="badge"
          placeholder="닉네임"
          value={values.nickname}
          onChange={(value) => onChange('nickname', value)}
        />
        <FigmaTextField
          icon="mail"
          placeholder="이메일"
          value={values.email}
          onChange={(value) => onChange('email', value)}
        />
        <FigmaFieldFrame icon="mood" filled={values.preferredCategory !== null}>
          <select
            aria-label="선호 카테고리"
            value={values.preferredCategory ?? ''}
            onChange={handleCategoryChange}
            className={cn(
              figmaFieldControlClassName,
              'cursor-pointer appearance-none pr-80',
              values.preferredCategory === null && 'text-[#ababab]',
            )}
          >
            <option value="" disabled hidden>
              선호 카테고리
            </option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category} className="text-[#292d32]">
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
          {/* 위를 가리키는 삼각형을 뒤집어 아래를 가리키게 한다. */}
          <div className="pointer-events-none absolute top-47 left-536 size-25 -scale-y-100">
            <FigmaAsset name="polygon" className="absolute top-0 left-[6.7%] h-3/4 w-[86.6%]" />
          </div>
        </FigmaFieldFrame>
      </div>
      {/* 오류 상태는 피그마에 없다. 입력칸 묶음과 버튼 줄 사이의 가운데에 둔다. */}
      {errorMessage !== null && (
        <div className="absolute inset-x-0 top-682">
          <FigmaErrorMessage lines={[errorMessage]} />
        </div>
      )}
      <FigmaStepActions leftLabel="이전" onLeftClick={onPrevious} onNextClick={onNext} />
    </>
  );
}
