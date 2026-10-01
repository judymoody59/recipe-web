import { cn } from '@/lib/cn';

export type FigmaAssetName =
  | 'badge'
  | 'encrypted'
  | 'mail'
  | 'mood'
  | 'person'
  | 'polygon'
  | 'step-chevron'
  | 'step-line'
  | 'upload';

function figmaAssetUrl(name: FigmaAssetName) {
  return `/figma/auth/${name}.svg`;
}

type FigmaAssetProps = {
  name: FigmaAssetName;
  className?: string;
};

// 피그마에서 내려받은 SVG 를 그대로 그린다. 꾸밈이라 읽어 주지 않는다.
export function FigmaAsset({ name, className }: FigmaAssetProps) {
  return (
    // 벡터 파일이라 이미지 최적화를 거칠 필요가 없다.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={figmaAssetUrl(name)} alt="" className={cn('block max-w-none', className)} />
  );
}

// 같은 SVG 를 모양으로만 쓰고 색은 글자색을 따른다. 상태에 따라 색이 바뀌는 아이콘에 쓴다.
export function FigmaTintedAsset({ name, className }: FigmaAssetProps) {
  return (
    <span
      aria-hidden="true"
      style={{ maskImage: `url(${figmaAssetUrl(name)})` }}
      className={cn('block bg-current mask-contain mask-center mask-no-repeat', className)}
    />
  );
}
