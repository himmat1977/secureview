@echo off
echo ========================================
echo SecureView - Move to Local Drive
echo ========================================
echo.
echo This will copy your project to C:\Projects\secureview
echo (outside of OneDrive to avoid build issues)
echo.
pause

echo.
echo Creating C:\Projects directory...
if not exist "C:\Projects" mkdir "C:\Projects"

echo.
echo Copying project files (this may take a minute)...
robocopy "%~dp0" "C:\Projects\secureview" /E /XD node_modules android\.gradle android\build android\app\build .vscode /XF *.log /NFL /NDL /NJH /NJS

echo.
echo ========================================
echo Project copied successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Open a new terminal/command prompt
echo 2. Navigate to: C:\Projects\secureview
echo 3. Run: npm install
echo 4. Run: npm run android
echo.
echo Or run the build-and-run.bat file in C:\Projects\secureview
echo.
pause
