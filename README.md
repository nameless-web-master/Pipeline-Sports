### Pipeline Sports — Expo/React Native App

An Expo (SDK 53) + React Native (0.79) + TypeScript mobile app. Uses React Navigation and Supabase for auth/data. Runs on Android, iOS, and Web via Expo.

### Status

This is an initial version of the README and will be updated further. The app will include additional modules beyond the onboarding flow (e.g. settings) as development progresses.

### Tech stack

- **Runtime**: Expo ~53, React 19, React Native 0.79
- **Lang**: TypeScript (~5.8)
- **Navigation**: `@react-navigation/native`, `@react-navigation/stack`
- **UI/UX**: Expo Linear Gradient, Poppins fonts, custom components
- **Native**: `react-native-gesture-handler`, `react-native-screens`, `react-native-safe-area-context`
- **Data/Backend**: `@supabase/supabase-js`, `axios`
- **Deep linking**: scheme `pipelinesports` (see `app.json`)

### Prerequisites

- Node 18+ recommended
- npm 9+ (this repo uses npm; lockfile present)
- Expo tooling: no global install required
  - Commands below use `npx expo ...`
- Platform SDKs for device builds (optional for simulators via Expo Go)
  - Android Studio + SDK, or Xcode for iOS

### Install

```bash
npm install
```

### Run (development)

- Start Metro/dev server:

```bash
npm run start
```

- Open on platforms:

```bash
npm run android   # or
npm run ios       # or
npm run web
```

### Build (local device builds)

You can create development builds without EAS using Expo run:

```bash
npx expo run:android   # builds and installs an Android app
npx expo run:ios       # builds and runs on iOS (macOS + Xcode required)
```

For production/distribution, prefer EAS Build:

```bash
npx expo install expo-dev-client
npx expo prebuild
npx eas build --platform android
npx eas build --platform ios
```

### Configuration

- `app.json` contains the Expo config:
  - name: `pipelineSports`
  - slug: `pipelineSports-app`
  - scheme: `pipelinesports` (deep linking)
  - bundle identifiers: `com.pipeline.sports`

### Environment variables

Supabase credentials are currently hardcoded in `src/lib/supabase.ts`. For security, move them to environment variables and do not commit secrets. Suggested setup:

Create `.env` (and keep it out of VCS):


Then load them safely (for example with `expo-constants` + runtime config, or using a secure backend). Avoid exposing `SERVICE_ROLE_KEY` in client bundles; use server-side functions instead.

### Project structure

```
.
├─ app.json
├─ App.tsx
├─ index.ts
├─ src/
│  ├─ api/
│  │  └─ api.ts
│  ├─ assets/
│  ├─ components/
│  ├─ constants/
│  ├─ context/
│  │  └─ AuthContext.tsx
│  ├─ hooks/
│  ├─ lib/
│  │  └─ supabase.ts
│  ├─ navigation/
│  │  ├─ AppNavigator.tsx
│  │  └─ Navigation.tsx
│  ├─ screens/
│  │  └─ onBoarding/
│  ├─ styles/
│  ├─ theme/
│  ├─ types/
│  └─ utils/
├─ package.json
├─ package-lock.json
└─ tsconfig.json
```

### App flow (high-level)

- `index.ts` registers `App`.
- `App.tsx` sets fonts, wraps in `AuthProvider`, renders `AppNavigator`, and provides a global `Toast`.
- `src/navigation/Navigation.tsx` drives navigation and receives `showToast` from the root.
- Onboarding/auth screens live in `src/screens/onBoarding/...`.

### Deep linking

- Scheme: `pipelinesports`
- Example URL: `pipelinesports://path` will route into the app per navigator configuration.

### Scripts (from package.json)

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

### Fonts

Poppins is loaded via `@expo-google-fonts/poppins` in `App.tsx`. The app renders only after fonts load to avoid layout shift.

### Troubleshooting

- Stuck on splash or white screen: clear Metro cache

  ```bash
  npx expo start -c
  ```

- Android device not found: ensure `adb devices` lists your device (enable USB debugging).
- iOS build requires macOS + Xcode. Use simulators via Expo Go otherwise.

### Security note

Never ship `SUPABASE_SERVICE_ROLE_KEY` in a client app. Move privileged operations to server-side endpoints or Supabase edge functions and use the anon key in the client.
