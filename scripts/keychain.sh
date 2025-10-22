#!/usr/bin/env bash
set -euo pipefail

# macOS Keychain helper for CLI secrets (no files written)
# Usage:
#   scripts/keychain.sh set SERVICE_NAME SECRET_VALUE
#   scripts/keychain.sh get SERVICE_NAME
# Example:
#   scripts/keychain.sh set OPENAI_API_KEY "sk-..."
#   export OPENAI_API_KEY="$(scripts/keychain.sh get OPENAI_API_KEY)"

COMMAND="${1:-}"
SERVICE="${2:-}"
VALUE="${3:-}"

if [[ -z "${COMMAND}" || -z "${SERVICE}" ]]; then
  echo "Usage: $0 {set|get} SERVICE_NAME [VALUE]" >&2
  exit 1
fi

case "${COMMAND}" in
  set)
    if [[ -z "${VALUE}" ]]; then
      echo "Missing VALUE for set" >&2
      exit 1
    fi
    security add-generic-password -a "$USER" -s "${SERVICE}" -w "${VALUE}" -U >/dev/null
    echo "Saved ${SERVICE} to macOS Keychain (account=$USER)"
    ;;
  get)
    security find-generic-password -s "${SERVICE}" -w
    ;;
  *)
    echo "Unknown command: ${COMMAND}. Use set|get" >&2
    exit 1
    ;;
esac


