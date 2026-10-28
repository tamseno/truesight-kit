# TrueSight Motion Kit - legacy wrapper. The pipeline lives in tools/make.py (cross-platform); this keeps old commands working.
#   .\tools\make.ps1 -Ep episodes\my-ep -Stage draft|preview|voice|final|all [-Fresh] [-Quiet] [-Force] [-Codec auto|hevc|h264]
param([Parameter(Mandatory)][string]$Ep, [ValidateSet('draft','preview','voice','final','all')][string]$Stage = 'draft', [switch]$Fresh, [switch]$Quiet, [switch]$Force,
  [ValidateSet('auto','hevc','h264')][string]$Codec = 'auto')
$K = Split-Path $PSScriptRoot -Parent
$a = @("$K\tools\make.py", $Ep, $Stage, '--codec', $Codec); if ($Fresh) { $a += '--fresh' }; if ($Quiet) { $a += '--quiet' }; if ($Force) { $a += '--force' }
& "$K\.venv\Scripts\python.exe" @a; exit $LASTEXITCODE
