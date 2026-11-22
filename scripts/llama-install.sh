#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$root/.local/llama.cpp"
revision="8d60873dfb8619f2b5ed31adfbab07cccb40db5c"

for tool in git cmake curl shasum; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    printf 'Missing %s. Install Git, CMake, curl, shasum, and a C/C++ toolchain before continuing.\n' "$tool" >&2
    exit 1
  fi
done

if [[ -e "$source_dir" ]]; then
  if [[ ! -d "$source_dir/.git" ]]; then
    printf 'Installation path exists but is not a Git checkout: %s\n' "$source_dir" >&2
    exit 1
  fi
  if [[ "$(git -C "$source_dir" rev-parse HEAD)" != "$revision" ]] || [[ -n "$(git -C "$source_dir" status --porcelain --untracked-files=no)" ]]; then
    printf 'Existing checkout is modified or at a different revision; it will not be overwritten: %s\n' "$source_dir" >&2
    exit 1
  fi
else
  mkdir -p "$source_dir"
  git -C "$source_dir" init
  git -C "$source_dir" remote add origin https://github.com/ggml-org/llama.cpp.git
  git -C "$source_dir" fetch --depth 1 origin "$revision"
  git -C "$source_dir" checkout --detach FETCH_HEAD
fi

cmake -S "$source_dir" -B "$source_dir/build" \
  -DCMAKE_BUILD_TYPE=Release -DGGML_METAL=OFF -DLLAMA_OPENSSL=OFF \
  -DLLAMA_BUILD_SERVER=ON -DLLAMA_BUILD_TESTS=OFF -DLLAMA_BUILD_EXAMPLES=OFF
cmake --build "$source_dir/build" --config Release --target llama-server --parallel "${LLAMA_BUILD_JOBS:-2}"

server="$source_dir/build/bin/llama-server"
if [[ ! -x "$server" ]]; then
  printf 'Build finished but llama-server was not found at %s\n' "$server" >&2
  exit 1
fi

model_revision="5037fcf163dd95d1e41d1974465f0898ed108ca2"
model_base_url="https://huggingface.co/ggml-org/Qwen2.5-VL-3B-Instruct-GGUF/resolve/$model_revision"
temporary_file=""
trap 'if [[ -n "$temporary_file" ]]; then rm -f -- "$temporary_file"; fi' EXIT

download_model() {
  local name="$1" expected="$2" target="$root/$1" actual

  if [[ -e "$target" || -L "$target" ]]; then
    if [[ ! -f "$target" || ! -r "$target" || -L "$target" ]]; then
      printf 'Model path is not a readable regular file: %s\n' "$target" >&2
      exit 1
    fi
    actual="$(shasum -a 256 "$target")"
    if [[ "${actual%% *}" != "$expected" ]]; then
      printf 'Existing file has an unexpected SHA-256 and will not be overwritten: %s\n' "$target" >&2
      exit 1
    fi
    printf 'Verified existing file: %s\n' "$target"
    return
  fi

  temporary_file="$(mktemp "$root/.llama-download.XXXXXXXX")"
  printf 'Downloading %s...\n' "$name"
  curl --fail --location --retry 3 --output "$temporary_file" "$model_base_url/$name"
  actual="$(shasum -a 256 "$temporary_file")"
  if [[ "${actual%% *}" != "$expected" ]]; then
    printf 'SHA-256 verification failed for %s; download discarded.\n' "$name" >&2
    exit 1
  fi
  if ! ln "$temporary_file" "$target"; then
    printf 'Could not save %s without overwriting an existing file.\n' "$target" >&2
    exit 1
  fi
  rm -f -- "$temporary_file"
  temporary_file=""
  printf 'Downloaded and verified: %s\n' "$target"
}

download_model "Qwen2.5-VL-3B-Instruct-Q4_K_M.gguf" "d02fe9b69ad8cadbbd228e387667af66612c44bed29ffc8eb1e7caf9ac486c12"
download_model "mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf" "980c9b2f78c04e6cff93d277ada09e768394f112d75db3b4e9dea8a69f9fb904"

printf '\nllama.cpp installed at %s\nRun from the project root:\nnpm run llama:run -- --model "$PWD/Qwen2.5-VL-3B-Instruct-Q4_K_M.gguf" --mmproj "$PWD/mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf"\n' "$server"
