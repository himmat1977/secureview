# SecureView - Run Android App
# This script sets up the environment and runs the app

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SecureView - Running Android App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"

Write-Host "Environment variables set:" -ForegroundColor Green
Write-Host "  JAVA_HOME: $env:JAVA_HOME"
Write-Host "  ANDROID_HOME: $env:ANDROID_HOME"
Write-Host ""

# Check if emulator is running
Write-Host "Checking for connected devices..." -ForegroundColor Yellow
& adb devices

Write-Host ""
Write-Host "Starting build and installation..." -ForegroundColor Yellow
npm run android

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
