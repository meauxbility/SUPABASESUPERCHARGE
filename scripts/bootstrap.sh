#!/usr/bin/env bash
set -euo pipefail

echo "→ Installing workspace deps"
if command -v pnpm >/dev/null 2>&1; then PM=pnpm; else PM=npm; fi
$PM install

echo "→ Installing gitleaks (secret scanner)"
if ! command -v gitleaks >/dev/null 2>&1; then
  curl -sSL https://raw.githubusercontent.com/gitleaks/gitleaks/master/install.sh | bash
fi

echo "→ Setting pre-commit hook"
mkdir -p .git/hooks
cat > .git/hooks/pre-commit <<'H'
#!/usr/bin/env bash
set -e
echo "Running gitleaks…"
gitleaks detect --no-banner --redact || { echo "❌ Secret scan failed"; exit 1; }
H
chmod +x .git/hooks/pre-commit

echo "→ Creating .env.local template if missing"
[ -f .env.local ] || cp .env.example .env.local

echo "✓ Bootstrap complete"


