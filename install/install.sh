#!/usr/bin/env sh
# Rex-25 MCP installer (macOS + Linux)
# Usage: curl -fsSL https://sintex.ai/rex25/install.sh | sh
# Idempotent: safe to re-run.

set -e

GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

printf "${GOLD}==> Rex-25 MCP installer${NC}\n"

# ---------- 1. Node check ----------
if ! command -v node >/dev/null 2>&1; then
  printf "${RED}ERROR:${NC} Node.js not found.\n"
  printf "Install Node.js (>=18) from https://nodejs.org or via your package manager:\n"
  printf "  macOS:  brew install node\n"
  printf "  Debian: sudo apt install nodejs npm\n"
  printf "  Arch:   sudo pacman -S nodejs npm\n"
  exit 1
fi

NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
  printf "${RED}ERROR:${NC} Node.js >=18 required (found $(node --version)).\n"
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  printf "${RED}ERROR:${NC} npx not found. Install npm.\n"
  exit 1
fi

printf "${GREEN}[ok]${NC} Node $(node --version) detected\n"

# ---------- 2. Pre-pull package ----------
printf "==> Fetching rex25-mcp package...\n"
npx -y rex25-mcp --version >/dev/null 2>&1 || true
printf "${GREEN}[ok]${NC} Package cached\n"

# ---------- 3. Detect MCP host config ----------
OS=$(uname -s)
case "$OS" in
  Darwin) CLAUDE_CFG="$HOME/Library/Application Support/Claude/claude_desktop_config.json" ;;
  Linux)  CLAUDE_CFG="$HOME/.config/Claude/claude_desktop_config.json" ;;
  *)      CLAUDE_CFG="" ;;
esac

inject_mcp() {
  cfg="$1"
  [ -z "$cfg" ] && return 0
  cfg_dir=$(dirname "$cfg")
  mkdir -p "$cfg_dir"
  if [ ! -f "$cfg" ]; then
    printf '{\n  "mcpServers": {\n    "rex25": {\n      "command": "npx",\n      "args": ["-y", "rex25-mcp"]\n    }\n  }\n}\n' > "$cfg"
    printf "${GREEN}[ok]${NC} Created %s\n" "$cfg"
    return 0
  fi
  if grep -q '"rex25"' "$cfg" 2>/dev/null; then
    printf "${GREEN}[ok]${NC} rex25 entry already present in %s\n" "$cfg"
    return 0
  fi
  node -e "
    const fs=require('fs');
    const p=process.argv[1];
    let j={};
    try{j=JSON.parse(fs.readFileSync(p,'utf8'));}catch(e){}
    j.mcpServers=j.mcpServers||{};
    j.mcpServers.rex25={command:'npx',args:['-y','rex25-mcp']};
    fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
  " "$cfg"
  printf "${GREEN}[ok]${NC} Injected rex25 into %s\n" "$cfg"
}

# Claude Desktop
[ -n "$CLAUDE_CFG" ] && inject_mcp "$CLAUDE_CFG"

# Cursor
CURSOR_CFG="$HOME/.cursor/mcp.json"
[ -d "$HOME/.cursor" ] && inject_mcp "$CURSOR_CFG"

# Cline (VSCode)
CLINE_CFG="$HOME/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
[ -d "$(dirname "$CLINE_CFG")" ] && inject_mcp "$CLINE_CFG"

printf "\n${GOLD}==> Done.${NC}\n"
printf "Run manually: ${GREEN}npx rex25-mcp${NC}\n"
printf "Or restart Claude Desktop / Cursor to load the MCP server.\n"
printf "Docs: https://sintex.ai/rex25\n"
