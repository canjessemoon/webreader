#!/usr/bin/env pwsh
# Script to initialize Git repository for WebReader

Write-Host "Initializing Git repository for WebReader..." -ForegroundColor Blue

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git is not installed. Please install Git and try again." -ForegroundColor Red
    exit 1
}

# Initialize git repository if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "Creating new Git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize Git repository." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Git repository already exists." -ForegroundColor Green
}

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "Creating .gitignore file..." -ForegroundColor Yellow
    @"
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
"@ | Out-File -FilePath ".gitignore" -Encoding utf8
}

# Add all files
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add files to Git." -ForegroundColor Red
    exit 1
}

# Initial commit if needed
$status = git status -s
if ($status) {
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit - WebReader app with improved UI and scrollable content"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create initial commit." -ForegroundColor Red
        exit 1
    }
}

# Instructions for remote setup
Write-Host "`nGit repository has been initialized." -ForegroundColor Green
Write-Host "`nTo connect to a remote GitHub repository, run:" -ForegroundColor Cyan
Write-Host "git remote add origin https://github.com/your-username/webreader.git" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host "`nReplace 'your-username' with your actual GitHub username." -ForegroundColor Yellow
