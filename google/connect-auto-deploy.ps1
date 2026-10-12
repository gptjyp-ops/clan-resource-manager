# Run once in PowerShell. Credentials go to GitHub Secrets, never to chat or git.
param([Parameter(Mandatory=$true)][string]$ScriptId)
$ErrorActionPreference = 'Stop'
$Repository = 'gptjyp-ops/clan-resource-manager'
$DeploymentId = 'AKfycbxa-JOZ_ShSprjSM1e8fQ9LfoDiztwASomBjUfpkXAso_lbo3H7F4VUgMWJ76Ruk0vt'
if ($ScriptId -notmatch '^[a-zA-Z0-9_-]{20,200}$') { throw 'Script ID is invalid. Copy it from Apps Script Project Settings.' }
if (!(Get-Command node -ErrorAction SilentlyContinue) -or !(Get-Command npx -ErrorAction SilentlyContinue)) { throw 'Install Node.js 22 or later first: https://nodejs.org/' }
if (!(Get-Command gh -ErrorAction SilentlyContinue)) { throw 'Install GitHub CLI first: https://cli.github.com/' }
& gh auth status *> $null
if ($LASTEXITCODE -ne 0) { & gh auth login --hostname github.com --web; if ($LASTEXITCODE -ne 0) { throw 'GitHub login failed.' } }
$AuthFile = Join-Path ([System.IO.Path]::GetTempPath()) ('.clan-clasprc-' + [guid]::NewGuid().ToString() + '.json')
try {
    Start-Process 'https://script.google.com/home/usersettings'
    Write-Host 'Enable Google Apps Script API in the opened page. Then press Enter.'
    Read-Host | Out-Null
    & npx --yes '@google/clasp@3.4.1' --auth $AuthFile login
    if ($LASTEXITCODE -ne 0 -or !(Test-Path $AuthFile)) { throw 'Google login failed.' }
    $Auth = Get-Content -LiteralPath $AuthFile -Raw | ConvertFrom-Json
    $Token = $Auth.tokens.default
    if (!$Token.client_id -or !$Token.client_secret -or !$Token.refresh_token) { throw 'Google credentials are incomplete. Log in again.' }
    $Secret = @{client_id=$Token.client_id;client_secret=$Token.client_secret;refresh_token=$Token.refresh_token} | ConvertTo-Json -Compress
    $Secret | & gh secret set GAS_OAUTH_JSON --repo $Repository
    if ($LASTEXITCODE -ne 0) { throw 'Cannot save Google credentials to GitHub Secrets.' }
    $ScriptId | & gh secret set GAS_SCRIPT_ID --repo $Repository
    if ($LASTEXITCODE -ne 0) { throw 'Cannot save Script ID.' }
    $DeploymentId | & gh secret set GAS_DEPLOYMENT_ID --repo $Repository
    if ($LASTEXITCODE -ne 0) { throw 'Cannot save Deployment ID.' }
    & gh workflow run google.yml --ref main --repo $Repository
    if ($LASTEXITCODE -ne 0) { throw 'Connection saved. Start Update Google Apps Script from GitHub Actions.' }
    Write-Host 'Connection saved. Deployment is running. Check GitHub Actions for the result.'
    Start-Process ('https://github.com/' + $Repository + '/actions/workflows/google.yml')
} finally {
    Remove-Item -LiteralPath $AuthFile -Force -ErrorAction SilentlyContinue
    $Secret = $null
    $Token = $null
}
