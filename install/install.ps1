# Rex-25 MCP installer (Windows PowerShell)
# Usage: iwr -useb https://sintex.ai/rex25/install.ps1 | iex
# Idempotent: safe to re-run.

$ErrorActionPreference = "Stop"

function Write-Gold($m)  { Write-Host $m -ForegroundColor Yellow }
function Write-Ok($m)    { Write-Host "[ok] $m" -ForegroundColor Green }
function Write-Err($m)   { Write-Host "ERROR: $m" -ForegroundColor Red }

Write-Gold "==> Rex-25 MCP installer"

# ---------- 1. Node check ----------
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Err "Node.js not found. Install from https://nodejs.org (>=18)."
    exit 1
}
$ver = (& node --version) -replace 'v',''
$major = [int]($ver.Split('.')[0])
if ($major -lt 18) {
    Write-Err "Node.js >=18 required (found v$ver)."
    exit 1
}
$npx = Get-Command npx -ErrorAction SilentlyContinue
if (-not $npx) { Write-Err "npx not found."; exit 1 }
Write-Ok "Node v$ver detected"

# ---------- 2. Pre-pull package ----------
Write-Host "==> Fetching rex25-mcp package..."
try { & npx -y rex25-mcp --version 2>$null | Out-Null } catch {}
Write-Ok "Package cached"

# ---------- 3. Inject into MCP host configs ----------
function Inject-Mcp([string]$cfgPath) {
    if (-not $cfgPath) { return }
    $dir = Split-Path -Parent $cfgPath
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

    if (-not (Test-Path $cfgPath)) {
        $obj = @{ mcpServers = @{ rex25 = @{ command = "npx"; args = @("-y","rex25-mcp") } } }
        $obj | ConvertTo-Json -Depth 6 | Set-Content -Path $cfgPath -Encoding UTF8
        Write-Ok "Created $cfgPath"
        return
    }

    try {
        $json = Get-Content $cfgPath -Raw | ConvertFrom-Json
    } catch {
        Write-Err "Existing config $cfgPath is not valid JSON. Skipping."
        return
    }

    if (-not $json.mcpServers) {
        $json | Add-Member -Force -MemberType NoteProperty -Name mcpServers -Value (New-Object PSObject)
    }
    if ($json.mcpServers.rex25) {
        Write-Ok "rex25 entry already present in $cfgPath"
        return
    }
    $entry = [pscustomobject]@{ command = "npx"; args = @("-y","rex25-mcp") }
    $json.mcpServers | Add-Member -Force -MemberType NoteProperty -Name rex25 -Value $entry
    $json | ConvertTo-Json -Depth 8 | Set-Content -Path $cfgPath -Encoding UTF8
    Write-Ok "Injected rex25 into $cfgPath"
}

# Claude Desktop (Windows)
$claudeCfg = Join-Path $env:APPDATA "Claude\claude_desktop_config.json"
Inject-Mcp $claudeCfg

# Cursor
$cursorCfg = Join-Path $env:USERPROFILE ".cursor\mcp.json"
if (Test-Path (Split-Path $cursorCfg -Parent)) { Inject-Mcp $cursorCfg }

# Cline (VSCode)
$clineCfg = Join-Path $env:APPDATA "Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json"
if (Test-Path (Split-Path $clineCfg -Parent)) { Inject-Mcp $clineCfg }

Write-Host ""
Write-Gold "==> Done."
Write-Host "Run manually: npx rex25-mcp"
Write-Host "Or restart Claude Desktop / Cursor to load the MCP server."
Write-Host "Docs: https://sintex.ai/rex25"
