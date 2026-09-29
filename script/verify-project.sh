#!/usr/bin/env bash
# 이 프로젝트의 검증. **프로젝트 소유 파일이다** — 하네스 갱신이 덮지 않는다.
#
# `script/run-lint-test.sh` 가 하네스 검사를 마친 뒤 이것을 부른다.
# 하나라도 실패하면 0이 아닌 종료 코드로 끝낸다.
#
# 순서가 중요하다. **계층 의존 검사를 포맷·테스트보다 먼저 둔다** — 싸고, 위반이면
# 어차피 설계를 고쳐야 한다. 포맷 위반은 자동 수정으로 끝나지만 의존 위반은 아니다.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

# 계층 의존 규칙. 기준은 `.ai/project/architecture.md` 가 갖는다.
#
# 손으로 돌리는 grep 을 문서에 적지 말고 여기 넣는다 — 문서에 적힌 검사는 아무도 돌리지 않고,
# 여기 넣으면 커밋 직후와 CI 가 대신 돌린다. 형태는 이렇다.
#
#   if grep -rn --include='*.java' -E '^import (org\.springframework|lombok)\.' src/main/java/**/domain/; then
#     echo "error: domain layer must not import a framework" >&2
#     exit 1
#   fi

# 공용 계층(lib · hooks · components · global)은 domain·app 을 import 하지 않고,
# domain 은 app 을 import 하지 않는다. `@/` 별칭과 상대 경로를 모두 import 한 파일 기준으로
# 정규화해 실제 목적지의 계층을 본다.

# 경로의 `.`·`..` 을 접어 출력한다. 리포 루트 밖으로 나가면 아무것도 출력하지 않는다.
normalize_path() (
  set -f
  local part out=''
  local IFS=/
  for part in $1; do
    case $part in
      '' | .) ;;
      ..)
        [ -n "$out" ] || return 0
        case $out in */*) out=${out%/*} ;; *) out='' ;; esac
        ;;
      *) out=${out:+$out/}$part ;;
    esac
  done
  printf '%s\n' "$out"
)

# import 지정자가 가리키는 src 바로 아래 계층 이름을 출력한다. 패키지·src 밖이면 출력하지 않는다.
resolve_layer() {
  local file=$1 spec=$2 path
  case $spec in
    @/*) path="src/${spec#@/}" ;;
    . | .. | ./* | ../*) path="$(dirname "$file")/$spec" ;;
    *) return 0 ;;
  esac
  path=$(normalize_path "$path")
  case $path in
    src/*)
      path=${path#src/}
      printf '%s\n' "${path%%/*}"
      ;;
  esac
}

layer_violation=0
check_layer() {
  local dir=$1 forbidden=$2 message=$3 hit file rest lineno text spec layer found=0
  [ -d "$dir" ] || return 0
  while IFS= read -r hit; do
    file=${hit%%:*}
    rest=${hit#*:}
    lineno=${rest%%:*}
    text=${rest#*:}
    spec=$(printf '%s\n' "$text" | sed -nE "s/.*from ['\"]([^'\"]+)['\"].*/\1/p")
    [ -n "$spec" ] || continue
    layer=$(resolve_layer "$file" "$spec")
    [ -n "$layer" ] || continue
    case " $forbidden " in
      *" $layer "*)
        printf '%s:%s:%s\n' "$file" "$lineno" "$text"
        found=1
        ;;
    esac
  done < <(grep -rnE --include='*.ts' --include='*.tsx' "from ['\"]" "$dir" || true)
  if [ "$found" -eq 1 ]; then
    echo "error: $message" >&2
    layer_violation=1
  fi
}
for dir in src/lib src/hooks src/components src/global; do
  check_layer "$dir" "domain app" "$dir must not import from src/domain or src/app"
done
check_layer src/domain "app" "src/domain must not import from src/app"
[ "$layer_violation" -eq 0 ] || exit 1

# 포맷 검사와 테스트. 명령은 `.ai/project/commands.md` 가 갖는다.
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
