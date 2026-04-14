#!/data/data/com.termux/files/usr/bin/sh
# Rex-25 MCP installer for Android (Termux)
# Usage:  pkg install curl -y && curl -fsSL https://sintex.ai/rex25/install-android.sh | sh
# Installs Rex-25 in thin-client mode (per device_profile.py phone classification).

set -e

GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

printf "${GOLD}==> Rex-25 MCP installer (Termux / Android)${NC}\n"

if [ -z "$PREFIX" ] || [ ! -d "$PREFIX" ]; then
  printf "${RED}ERROR:${NC} This script must be run inside Termux.\n"
  exit 1
fi

# ---------- 1. Update + nodejs ----------
printf "==> Updating Termux packages...\n"
yes | pkg update >/dev/null 2>&1 || true
yes | pkg upgrade >/dev/null 2>&1 || true

if ! command -v node >/dev/null 2>&1; then
  printf "==> Installing nodejs-lts...\n"
  pkg install -y nodejs-lts
else
  printf "${GREEN}[ok]${NC} Node $(node --version) already installed\n"
fi

# ---------- 2. Install rex25-mcp globally ----------
if npm list -g rex25-mcp >/dev/null 2>&1; then
  printf "${GREEN}[ok]${NC} rex25-mcp already installed (upgrading)\n"
  npm install -g rex25-mcp@latest
else
  printf "==> Installing rex25-mcp globally...\n"
  npm install -g rex25-mcp
fi

# ---------- 3. Thin-client wrapper ----------
BIN="$PREFIX/bin/rex25"
cat > "$BIN" <<'EOF'
#!/data/data/com.termux/files/usr/bin/sh
# Rex-25 thin-client wrapper for phone class
export REX25_DEVICE_CLASS="phone"
export REX25_ROLE="thin-client"
exec rex25-mcp "$@"
EOF
chmod +x "$BIN"

printf "${GREEN}[ok]${NC} Wrapper installed at $BIN\n"
printf "\n${GOLD}==> Done.${NC}\n"
printf "Run: ${GREEN}rex25${NC}\n"
printf "PWA: open https://sintex.ai/rex25 in Chrome and 'Add to Home Screen'.\n"
