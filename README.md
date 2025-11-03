# SecureView Mobile App - View-Only Camera Monitoring

React Native mobile application for iOS and Android - **Read-Only Access** to security camera systems.

**Note:** This is a viewer app. Users can only view camera feeds, events, and locations. No create, update, or delete operations are allowed.

## Folder Structure

```
secureview/
├── mockups/                    # Design mockups and wireframes (paste your mockups here)
├── src/
│   ├── assets/                 # Static assets
│   │   ├── images/            # Image files
│   │   ├── fonts/             # Custom fonts
│   │   ├── icons/             # Icon files
│   │   ├── animations/        # Animation files
│   │   └── lottie/            # Lottie animation files
│   ├── components/            # Reusable components
│   │   ├── common/            # Common components (Button, Input, etc.)
│   │   └── ui/                # UI-specific components
│   ├── screens/               # Screen components (one folder per screen)
│   ├── navigation/            # Navigation configuration
│   ├── services/              # API services and external integrations
│   ├── api/                   # API calls and endpoints
│   ├── redux/                 # Redux state management
│   │   ├── slices/           # Redux slices
│   │   └── store/            # Redux store configuration
│   ├── context/               # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   ├── constants/             # App constants
│   ├── config/                # Configuration files
│   ├── theme/                 # Theme configuration (colors, typography, spacing)
│   ├── models/                # Data models and interfaces
│   └── types/                 # TypeScript type definitions
├── __tests__/                 # Test files
│   ├── components/           # Component tests
│   └── screens/              # Screen tests
├── android/                   # Android native code
├── ios/                       # iOS native code
└── .github/workflows/         # CI/CD workflows
```

## Getting Started

1. Install dependencies: `npm install` or `yarn install`
2. Run on iOS: `npm run ios` or `yarn ios`
3. Run on Android: `npm run android` or `yarn android`

## Development Workflow

1. Place all design mockups in the `mockups/` folder
2. Create screens in `src/screens/` based on mockups
3. Build reusable components in `src/components/`
4. Configure navigation in `src/navigation/`

## Publishing

- iOS: Build and upload to App Store Connect
- Android: Build APK/AAB and upload to Google Play Console
