@echo off
echo ========================================
echo SecureView - Build and Run
echo ========================================
echo.

REM Set environment variables
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%

echo Checking for node_modules...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo.
echo Starting Android emulator in a new window...
start "Android Emulator" cmd /c "emulator -avd Medium_Phone_API_36.1"

echo.
echo Waiting 60 seconds for emulator to boot...
echo (The emulator window should open shortly)
timeout /t 60 /nobreak >nul

echo.
echo Starting Metro bundler in a new window...
start "Metro Bundler" cmd /k "npm start"

echo.
echo Waiting 5 seconds for Metro to start...
timeout /t 5 /nobreak >nul

echo.
echo Building and running Android app...
echo This will take a few minutes on first run...
echo.

call npm run android

echo.
echo ========================================
echo Done!
echo ========================================
pause
