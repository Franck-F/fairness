param(
  [switch]$FrontendOnly
)

$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$backendPath = Join-Path $repoRoot 'backend'
$venvPython = Join-Path $repoRoot '.venv\Scripts\python.exe'

Write-Host '==> AuditIQ one-shot startup' -ForegroundColor Cyan
Write-Host "Repo: $repoRoot"

if (-not $FrontendOnly) {
  if (-not (Test-Path $backendPath)) {
    Write-Host 'Backend folder not found, skipping backend startup.' -ForegroundColor Yellow
  }
  else {
    $pythonCmd = $null

    if (Test-Path $venvPython) {
      $pythonCmd = $venvPython
    }
    elseif (Get-Command python -ErrorAction SilentlyContinue) {
      $pythonCmd = 'python'
    }
    elseif (Get-Command py -ErrorAction SilentlyContinue) {
      $pythonCmd = 'py'
    }

    if (-not $pythonCmd) {
      Write-Host 'Python not found. Backend not started.' -ForegroundColor Yellow
    }
    else {
      Write-Host 'Starting backend in a new PowerShell window...' -ForegroundColor Green

      $backendCommand = if ($pythonCmd -eq 'py') {
        "Set-Location '$backendPath'; py -3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
      }
      else {
        "Set-Location '$backendPath'; & '$pythonCmd' -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
      }

      Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $backendCommand | Out-Null
      Start-Sleep -Seconds 1
    }
  }
}
else {
  Write-Host 'FrontendOnly mode: backend startup skipped.' -ForegroundColor Yellow
}

Write-Host 'Starting frontend in current terminal...' -ForegroundColor Green
Set-Location $repoRoot
npm run dev
