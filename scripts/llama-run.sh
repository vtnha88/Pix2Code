#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
server="$root/.local/llama.cpp/build/bin/llama-server"
model=""
mmproj=""
port="8080"
context="2048"

usage() {
  printf 'Usage: npm run llama:run -- --model /path/to/model.gguf [--mmproj /path/to/mmproj.gguf] [--port 8080] [--context 2048]\n'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --model|--mmproj|--port|--context)
      if [[ $# -lt 2 || -z "$2" ]]; then
        printf 'Missing value for %s\n' "$1" >&2
        usage >&2
        exit 1
      fi
      case "$1" in
        --model) model="$2" ;;
        --mmproj) mmproj="$2" ;;
        --port) port="$2" ;;
        --context) context="$2" ;;
      esac
      shift 2 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ ! -x "$server" ]]; then
  printf 'llama-server not found. Run npm run llama:install first.\n' >&2
  exit 1
fi
if [[ -z "$model" || ! -f "$model" || ! -r "$model" ]]; then
  printf 'Provide a readable GGUF model file with --model.\n' >&2
  exit 1
fi
if [[ -n "$mmproj" && ( ! -f "$mmproj" || ! -r "$mmproj" ) ]]; then
  printf 'The --mmproj file does not exist or is not readable.\n' >&2
  exit 1
fi
if [[ ! "$port" =~ ^[0-9]{1,5}$ ]] || (( 10#$port < 1 || 10#$port > 65535 )); then
  printf 'Port must be an integer between 1 and 65535.\n' >&2
  exit 1
fi
if [[ ! "$context" =~ ^[0-9]{1,7}$ ]] || (( 10#$context < 1 )); then
  printf 'Context must be a positive integer.\n' >&2
  exit 1
fi

args=(--model "$model" --host 127.0.0.1 --port "$port" --ctx-size "$context" --n-gpu-layers 0 --cors-origins localhost)
if [[ -n "$mmproj" ]]; then
  args+=(--mmproj "$mmproj")
fi
printf 'Starting local llama-server on http://127.0.0.1:%s (CPU only). Press Ctrl+C to stop.\n' "$port"
exec "$server" "${args[@]}"
