@echo off
echo ========================================
echo SecureView - Rebuild Android
echo ========================================
echo.

REM Set environment variables
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%

echo Cleaning Android build...
cd android
call .\gradlew.bat clean
cd ..

echo.
echo Cleaning Metro cache...
call npx react-native start --reset-cache &
timeout /t 5 /nobreak >nul
taskkill /F /IM node.exe 2>nul

echo.
echo Rebuilding Android app...
echo This will take a few minutes...
echo.

call npm run android

echo.
echo ========================================
echo Done! The app should now show icons correctly.
echo ========================================
pause
