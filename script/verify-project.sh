#!/bin/sh
# 이 프로젝트의 검증. **프로젝트 소유 파일이다** — 하네스 갱신이 덮지 않는다.
#
# `script/run-lint-test.sh` 가 하네스 검사를 마친 뒤 이것을 부른다.
# 하나라도 실패하면 0이 아닌 종료 코드로 끝낸다.
#
# **POSIX sh 문법만 쓴다.** `harness doctor` 가 첫 줄을 무시하고 이 파일을 `sh` 로 실행하는데,
# macOS 의 `sh` 는 bash POSIX 모드이고 다른 시스템에서는 dash 일 수 있다. 하네스가 첫 줄을
# 따르도록 바뀌기 전까지 프로세스 치환·`[[ ]]`·배열·`local`·`pipefail` 같은 bash 전용 문법을
# 넣지 않는다. 첫 줄을 `/bin/sh` 로 둔 것도 직접 실행할 때 같은 셸로 돌게 하기 위해서다.
#
# 순서가 중요하다. **계층 의존 검사를 포맷·테스트보다 먼저 둔다** — 싸고, 위반이면
# 어차피 설계를 고쳐야 한다. 포맷 위반은 자동 수정으로 끝나지만 의존 위반은 아니다.
set -eu
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
# 서브셸 본문이라 여기서 바꾼 변수·IFS·`set -f` 는 호출한 쪽으로 새지 않는다.
normalize_path() (
  set -f
  out=''
  IFS=/
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
resolve_layer() (
  file=$1
  spec=$2
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
)

# `layer_violation` 을 호출한 쪽에 남겨야 하므로 서브셸이 아닌 본문으로 둔다.
# `local` 이 없으니 이 함수의 변수는 전역이다 — 호출부 변수와 겹치지 않게 `cl_` 을 붙인다.
# grep 결과를 파이프로 while 에 넘기면 while 이 서브셸에서 돌아 `cl_found` 가 사라지므로,
# 결과를 변수에 받아 here-document 로 넘긴다.
layer_violation=0
check_layer() {
  cl_dir=$1
  cl_forbidden=$2
  cl_message=$3
  cl_found=0
  [ -d "$cl_dir" ] || return 0
  cl_hits=$(grep -rnE --include='*.ts' --include='*.tsx' "from ['\"]" "$cl_dir" || true)
  while IFS= read -r cl_hit; do
    [ -n "$cl_hit" ] || continue
    cl_file=${cl_hit%%:*}
    cl_rest=${cl_hit#*:}
    cl_lineno=${cl_rest%%:*}
    cl_text=${cl_rest#*:}
    cl_spec=$(printf '%s\n' "$cl_text" | sed -nE "s/.*from ['\"]([^'\"]+)['\"].*/\1/p")
    [ -n "$cl_spec" ] || continue
    cl_layer=$(resolve_layer "$cl_file" "$cl_spec")
    [ -n "$cl_layer" ] || continue
    case " $cl_forbidden " in
      *" $cl_layer "*)
        printf '%s:%s:%s\n' "$cl_file" "$cl_lineno" "$cl_text"
        cl_found=1
        ;;
    esac
  done <<EOF
$cl_hits
EOF
  if [ "$cl_found" -eq 1 ]; then
    echo "error: $cl_message" >&2
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
