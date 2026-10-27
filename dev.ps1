<#
.SYNOPSIS
  Run the IshvaraX frontend (Next.js) and backend (FastAPI) locally.

.DESCRIPTION
  - Backend: creates backend\.venv on first run, installs requirements.txt when it
    changes, loads BACKEND\.env + .env.local, and starts uvicorn with --reload.
  - Frontend: runs npm install if node_modules is missing, points
    NEXT_PUBLIC_API_BASE_URL at the local API, and starts `next dev`.
  Ctrl+C stops both.

.EXAMPLE
  .\dev.ps1
  .\dev.ps1 -BackendOnly
  .\dev.ps1 -ApiPort 8001 -WebPort 3001
  $env:BACKEND_DIR = "D:\code\BACKEND"; .\dev.ps1
#>
[CmdletBinding()]
param(
  # Defaults to $env:BACKEND_DIR, then ..\BACKEND next to this repo.
  [string]$BackendDir,
  [int]$ApiPort = 8000,
  [int]$WebPort = 3000,
  [switch]$BackendOnly,
  [switch]$FrontendOnly,
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

# $PSScriptRoot is not populated inside param() defaults on Windows PowerShell 5.1.
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $BackendDir) {
  $BackendDir = if ($env:BACKEND_DIR) { $env:BACKEND_DIR } else { Join-Path $Root "..\BACKEND" }
}
$BackendDir = [System.IO.Path]::GetFullPath($BackendDir)
$FrontendDir = Join-Path $Root "main"
$BackendApp = Join-Path $BackendDir "backend"

# Configuration problems: print the message only, no PowerShell stack trace.
function Fail([string]$Message) {
  Write-Host "error: $Message" -ForegroundColor Red
  exit 1
}

function Require-Command([string]$Name, [string]$Hint) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Fail "'$Name' was not found on PATH. $Hint"
  }
}

# Reads KEY=value lines into $Into; earlier files win, so call in precedence order.
# Nothing is written to the current session's environment.
function Read-DotEnv([string]$Path, [hashtable]$Into) {
  if (-not (Test-Path $Path)) { return }
  foreach ($line in Get-Content $Path) {
    if ($line -match '^\s*(#|$)') { continue }
    if ($line -match '^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
      $key = $Matches[1]
      $value = $Matches[2].Trim()
      if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") { $value = $Matches[1] }
      if (-not $Into.ContainsKey($key)) { $Into[$key] = $value }
    }
  }
}

function Stop-ProcessTree([System.Diagnostics.Process]$Process) {
  if ($null -eq $Process -or $Process.HasExited) { return }
  # uvicorn --reload forks a worker; taskkill /T takes the whole tree down.
  & taskkill /PID $Process.Id /T /F 2>$null | Out-Null
}

$backend = $null

try {
  # ---- Backend -------------------------------------------------------------
  if (-not $FrontendOnly) {
    if (-not (Test-Path (Join-Path $BackendApp "main.py"))) {
      Fail "Backend not found at '$BackendApp'. Pass -BackendDir or set BACKEND_DIR."
    }

    $venv = Join-Path $BackendApp ".venv"
    $python = Join-Path $venv "Scripts\python.exe"
    if (-not (Test-Path $python)) {
      Require-Command python "Install Python 3.12+ from https://www.python.org/downloads/"
      Write-Host "[backend] creating virtualenv at $venv"
      & python -m venv $venv
    }

    $requirements = Join-Path $BackendApp "requirements.txt"
    $stamp = Join-Path $venv ".requirements.sha256"
    $hash = (Get-FileHash $requirements -Algorithm SHA256).Hash
    if (-not $SkipInstall -and (-not (Test-Path $stamp) -or (Get-Content $stamp -Raw).Trim() -ne $hash)) {
      Write-Host "[backend] installing requirements"
      & $python -m pip install --quiet --disable-pip-version-check -r $requirements
      Set-Content -Path $stamp -Value $hash -NoNewline
    }

    # Precedence: .env.local > .env. (Shell variables are not consulted so a
    # stale value in this session can never shadow the files.)
    $backendEnv = @{}
    Read-DotEnv (Join-Path $BackendDir ".env.local") $backendEnv
    Read-DotEnv (Join-Path $BackendDir ".env") $backendEnv
    foreach ($required in "DATABASE_URL", "SECRET_KEY") {
      if (-not $backendEnv[$required]) {
        Fail "$required is not set. Add it to $BackendDir\.env.local"
      }
    }
    if ($backendEnv["SECRET_KEY"].Length -lt 32) {
      Fail "SECRET_KEY must be at least 32 characters (the one in .env is a placeholder). Generate one with:`n  python -c `"import secrets; print(secrets.token_urlsafe(48))`"`nand put SECRET_KEY=<value> in $BackendDir\.env.local"
    }
    # Password-reset links should point at the local frontend, not production.
    $backendEnv["APP_BASE_URL"] = "http://localhost:$WebPort"
    # The backend logs emoji at startup; cp1252 consoles would raise UnicodeEncodeError.
    $backendEnv["PYTHONUTF8"] = "1"

    Write-Host "[backend] http://localhost:$ApiPort  (docs: /docs)"
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $python
    $psi.Arguments = "-m uvicorn main:app --reload --host 127.0.0.1 --port $ApiPort"
    $psi.WorkingDirectory = $BackendApp
    $psi.UseShellExecute = $false
    foreach ($key in $backendEnv.Keys) { $psi.EnvironmentVariables[$key] = $backendEnv[$key] }
    $backend = [System.Diagnostics.Process]::Start($psi)
  }

  # ---- Frontend ------------------------------------------------------------
  if (-not $BackendOnly) {
    Require-Command npm "Install Node.js 20+ from https://nodejs.org/"
    Push-Location $FrontendDir
    try {
      if (-not $SkipInstall -and -not (Test-Path "node_modules")) {
        Write-Host "[frontend] installing npm packages"
        & npm install
      }
      $env:NEXT_PUBLIC_API_BASE_URL = "http://localhost:$ApiPort"
      Write-Host "[frontend] http://localhost:$WebPort"
      & npm run dev -- --port $WebPort
    } finally {
      Pop-Location
    }
  } elseif ($backend) {
    Wait-Process -Id $backend.Id
  }
} finally {
  Stop-ProcessTree $backend
}
