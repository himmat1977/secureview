# React Native Setup & Run Guide

## Prerequisites

### For Android Development (Windows)

1. **Install Node.js** (Already done ✅)

2. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - During installation, make sure to install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (AVD)

3. **Configure Android Environment Variables**

   Add these to your Windows Environment Variables:

   ```
   ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
   ```

   Add to PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

4. **Install JDK 17**
   - Download from: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
   - Or use OpenJDK

5. **Verify Installation**
   ```bash
   node --version
   npm --version
   java -version
   ```

## Running the App

### Option 1: Using Android Studio

1. **Open Android Studio**
2. **Open AVD Manager** (Tools > Device Manager)
3. **Create a Virtual Device** (if you don't have one)
   - Choose a device (e.g., Pixel 5)
   - Choose a system image (e.g., Android 13)
   - Click Finish

4. **Start the Emulator**
   - Click the Play button next to your virtual device

5. **Start Metro Bundler**
   ```bash
   npm start
   ```

6. **In another terminal, run:**
   ```bash
   npm run android
   ```

### Option 2: Using Physical Device

1. **Enable Developer Options** on your Android phone:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings > Developer Options
   - Enable "USB Debugging"

2. **Connect your phone via USB**

3. **Verify device is connected:**
   ```bash
   adb devices
   ```

4. **Run the app:**
   ```bash
   npm start
   npm run android
   ```

## Quick Start (If Already Set Up)

```bash
# 1. Start Metro Bundler
npm start

# 2. In a new terminal, run Android
npm run android
```

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Build Errors
```bash
# Clean build
cd android
./gradlew clean
cd ..
npm run android
```

### Port Already in Use
```bash
# Kill Metro process
npx react-native start --port 8082
```

### Gradle Issues
```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
```

## Testing with Expo Go (Alternative - Easier)

If you want a faster way to test without Android Studio:

1. **Install Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

2. **Install Expo Go app** on your phone from Play Store

3. **Run:**
   ```bash
   npx expo start
   ```

4. **Scan QR code** with Expo Go app

**Note:** This app is not using Expo, but you can convert it if needed.

## Next Steps After Setup

Once your emulator/device is running:

1. The app will automatically open
2. You'll see the **Login Screen**
3. Test login with your API credentials
4. Explore all 5 screens via bottom tabs

## Useful Commands

```bash
# Start Metro
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Clear cache
npm start -- --reset-cache

# Run tests
npm test

# Lint code
npm run lint

# Build for release (Android)
cd android && ./gradlew assembleRelease
```

## VS Code Setup (Recommended)

Install these extensions:
- React Native Tools
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint

## Debugging

1. **Open Developer Menu** in app:
   - Shake device or press Ctrl+M (Android)
   - Cmd+D (iOS)

2. **Enable Debug Mode**:
   - Select "Debug" from menu
   - Opens Chrome DevTools

3. **React DevTools**:
   ```bash
   npx react-devtools
   ```

## Known Issues

1. **Metro not starting:** Restart terminal and run `npm start -- --reset-cache`
2. **Build failing:** Make sure Java, Android SDK are properly installed
3. **Device not detected:** Check USB debugging is enabled

---

**Need help?** Check the React Native docs: https://reactnative.dev/docs/environment-setup
