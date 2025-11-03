# VS Code Setup for React Native Development

## Essential Extensions

### 1. React Native Tools
**ID:** `msjsdiag.vscode-react-native`

**Install:**
```
code --install-extension msjsdiag.vscode-react-native
```

**What it does:**
- Run React Native apps directly from VS Code
- Start/stop Metro bundler
- Debug React Native code
- IntelliSense for React Native APIs

**How to use:**
1. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
2. Type `React Native: Run Android`
3. Select and run

**Or add to `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Android",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "launch",
      "platform": "android"
    },
    {
      "name": "Debug Android",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "launch",
      "platform": "android"
    }
  ]
}
```

### 2. Android iOS Emulator
**ID:** `DiemasMichiels.emulate`

**Install:**
```
code --install-extension DiemasMichiels.emulate
```

**What it does:**
- Launch Android emulators from VS Code status bar
- No need to open Android Studio
- Quick access to all AVDs

**How to use:**
1. Look for Android icon in bottom status bar
2. Click it
3. Select emulator from dropdown
4. Emulator starts automatically

**Configure:**
Add to `settings.json`:
```json
{
  "emulate.android.emulatorPath": "C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk\\emulator\\emulator.exe"
}
```

### 3. Other Recommended Extensions

**TypeScript & React:**
```bash
# ES7+ React/Redux/React-Native snippets
code --install-extension dsznajder.es7-react-js-snippets

# Auto Import
code --install-extension steoates.autoimport

# Auto Rename Tag
code --install-extension formulahendry.auto-rename-tag
```

**Code Quality:**
```bash
# ESLint
code --install-extension dbaeumer.vscode-eslint

# Prettier
code --install-extension esbenp.prettier-vscode

# EditorConfig
code --install-extension EditorConfig.EditorConfig
```

**Productivity:**
```bash
# Path Intellisense
code --install-extension christian-kohler.path-intellisense

# GitLens
code --install-extension eamodio.gitlens

# Error Lens (shows errors inline)
code --install-extension usernamehw.errorlens

# Color Highlight
code --install-extension naumovs.color-highlight
```

## VS Code Configuration

### 1. Create Workspace Settings

Create `.vscode/settings.json` in your project:

```json
{
  // TypeScript
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  // Formatting
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },

  // React Native
  "react-native-tools.showUserTips": false,
  "react-native-tools.projectRoot": "${workspaceFolder}",

  // Files
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.expo": true,
    "**/.expo-shared": true
  },

  // Search
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/*.code-search": true,
    "**/ios/Pods": true,
    "**/android/.gradle": true
  },

  // Android Emulator Path
  "emulate.android.emulatorPath": "C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk\\emulator\\emulator.exe"
}
```

### 2. Create Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Android",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "launch",
      "platform": "android"
    },
    {
      "name": "Debug Android",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "launch",
      "platform": "android",
      "sourceMaps": true,
      "outDir": "${workspaceFolder}/.vscode/.react"
    },
    {
      "name": "Attach to packager",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "attach"
    }
  ]
}
```

### 3. Create Tasks Configuration

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Metro",
      "type": "shell",
      "command": "npm start",
      "isBackground": true,
      "problemMatcher": {
        "owner": "custom",
        "pattern": {
          "regexp": "^$"
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": ".*",
          "endsPattern": "Metro.*running"
        }
      }
    },
    {
      "label": "Run Android",
      "type": "shell",
      "command": "npm run android",
      "dependsOn": ["Start Metro"],
      "problemMatcher": []
    },
    {
      "label": "Clean & Rebuild Android",
      "type": "shell",
      "command": "cd android && .\\gradlew clean && cd .. && npm run android",
      "problemMatcher": []
    },
    {
      "label": "Clear Metro Cache",
      "type": "shell",
      "command": "npm start -- --reset-cache",
      "problemMatcher": []
    }
  ]
}
```

## Running Your App from VS Code

### Method 1: Using Command Palette (Easiest)

1. Press `Ctrl+Shift+P`
2. Type: `React Native: Run Android`
3. Hit Enter
4. App launches on emulator!

### Method 2: Using Debug Panel

1. Click Debug icon in sidebar (or press `Ctrl+Shift+D`)
2. Select "Run Android" from dropdown
3. Press F5 or click green play button
4. App launches on emulator!

### Method 3: Using Tasks

1. Press `Ctrl+Shift+P`
2. Type: `Tasks: Run Task`
3. Select "Run Android"
4. App launches!

### Method 4: Using Terminal in VS Code

1. Press `Ctrl+` ` (backtick) to open integrated terminal
2. Run: `npm run android`
3. Done!

## Keyboard Shortcuts

Add these to your `keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "Run Android"
  },
  {
    "key": "ctrl+shift+m",
    "command": "workbench.action.tasks.runTask",
    "args": "Start Metro"
  },
  {
    "key": "ctrl+shift+c",
    "command": "workbench.action.tasks.runTask",
    "args": "Clear Metro Cache"
  }
]
```

## Android Emulator Management

### Without Opening Android Studio

1. **List available AVDs:**
   ```bash
   emulator -list-avds
   ```

2. **Start specific emulator:**
   ```bash
   emulator -avd Pixel_5_API_33
   ```

3. **From VS Code:**
   - Click Android icon in status bar
   - Select emulator
   - Done!

### Create AVD from Command Line

```bash
# List available system images
sdkmanager --list | grep "system-images"

# Download system image
sdkmanager "system-images;android-33;google_apis;x86_64"

# Create AVD
avdmanager create avd -n Pixel_5 -k "system-images;android-33;google_apis;x86_64" -d pixel_5
```

## Debugging Tips

### React Native Debugger

1. **Enable Debug Mode:**
   - In emulator: Press `Ctrl+M` (Android) or `Cmd+D` (iOS)
   - Select "Debug"

2. **Use VS Code Debugger:**
   - Set breakpoints in your code
   - Press F5 to start debugging
   - App pauses at breakpoints

3. **View Logs:**
   - Debug Console in VS Code shows all logs
   - Or use: `npx react-native log-android`

### Chrome DevTools

1. Press `Ctrl+M` in emulator
2. Select "Debug"
3. Chrome opens automatically
4. Use Chrome DevTools for debugging

## Common Commands from VS Code

All accessible via `Ctrl+Shift+P`:

```
React Native: Run Android
React Native: Run iOS
React Native: Start Packager
React Native: Stop Packager
React Native: Restart Packager
React Native: Run Element Inspector
React Native: Show Dev Menu
```

## Pro Tips

1. **Auto-attach Debugger:**
   Add to `settings.json`:
   ```json
   {
     "debug.javascript.autoAttachFilter": "onlyWithFlag"
   }
   ```

2. **Fast Refresh:**
   Enabled by default in React Native 0.61+
   - Save file = auto-reload
   - No manual refresh needed!

3. **Quick Error Navigation:**
   - Install "Error Lens" extension
   - Errors show inline in editor

4. **Multi-root Workspace:**
   If working on multiple React Native projects:
   - File > Add Folder to Workspace
   - Save as `.code-workspace` file

## Troubleshooting

### Emulator not detected

1. Make sure emulator is running:
   ```bash
   adb devices
   ```

2. Restart ADB:
   ```bash
   adb kill-server
   adb start-server
   ```

### VS Code can't find Android SDK

Add to `settings.json`:
```json
{
  "android.home": "C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk"
}
```

### Metro bundler issues

Clear cache:
```bash
npm start -- --reset-cache
```

---

## Quick Start Workflow

With everything set up:

1. **Open Project in VS Code**
2. **Start Emulator:** Click Android icon in status bar
3. **Run App:** Press `Ctrl+Shift+P` → "React Native: Run Android"
4. **Code & Test:** Make changes, auto-refresh works!
5. **Debug:** Set breakpoints, press F5

That's it! No need to open Android Studio at all! 🚀

## Still Need Android Studio?

You'll need it **once** to:
1. Download Android SDK
2. Create first AVD (virtual device)
3. Set up environment variables

After that, use VS Code for everything! The extensions handle:
- ✅ Starting emulators
- ✅ Running the app
- ✅ Debugging
- ✅ Metro bundler
- ✅ Hot reload

---

**Recommended Setup:**
1. Install Android Studio (one-time)
2. Create one AVD in Android Studio
3. Install VS Code extensions above
4. Never open Android Studio again! 😄
