# Josoor

This is the Josoor mobile application.

A comprehensive React Native mobile application built with Expo for job searching, study & training programs, professional development, and career management.

## 📱 Overview

Josoor is a mobile career companion that helps users:
- Discover job opportunities and study programs
- Manage job applications and mobility dossiers
- Assess and improve professional skills
- Network through messaging and referral systems
- Share CVs via NFC technology
- Track professional development through training programs

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev) & React Native
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Internationalization**: react-i18next (Arabic, English, French)
- **Type Safety**: TypeScript
- **UI Components**: Custom components with Ionicons

## 📁 Project Structure

```
├── app/                          # Main application screens (file-based routing)
│   ├── (auth)/                  # Authentication screens
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── home/               # Home tab & features
│   │   ├── jobs/               # Job listings & details
│   │   ├── messages/           # Messaging system
│   │   ├── nfc/                # NFC CV sharing
│   │   └── profile/            # User profile
├── assets/                      # Static assets (images, fonts)
├── components/                  # Reusable UI components
│   ├── common/                 # Common components
│   ├── jobs/                   # Job-related components
│   ├── layout/                 # Layout components
│   └── trainings/              # Training components
├── config/                      # App configuration
├── constants/                   # App constants
├── contexts/                    # React contexts
├── hooks/                       # Custom React hooks
│   ├── auth/                   # Authentication hooks
│   └── useRTLLayout.ts         # RTL layout support
├── interfaces/                  # TypeScript interfaces
├── locales/                     # Translation files
│   ├── ar.json                 # Arabic translations
│   ├── en.json                 # English translations
│   ├── fr.json                 # French translations
│   └── [feature]/              # Feature-specific translations
├── providers/                   # React providers
├── services/                    # API services
├── stores/                      # Zustand stores
├── types/                       # TypeScript type definitions
└── utils/                       # Utility functions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- [Expo Go](https://expo.dev/go) app on your mobile device (for development)
- For production builds: EAS CLI

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Expo
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npx expo start
```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android)
   - Scan the QR code with Camera app (iOS)

### Development Options

- **Android Emulator**: Press `a` in the terminal
- **iOS Simulator**: Press `i` in the terminal (macOS only)
- **Web**: Press `w` in the terminal

## 🌍 Internationalization

The app supports three languages:
- **Arabic (ar)** - with RTL support
- **English (en)**
- **French (fr)**

Translation files are organized by feature in the locales directory.

## 🔑 Key Features

### 1. **Authentication**
- Email/password login and registration
- Google Sign-In integration
- LinkedIn authentication
- Password recovery
- Email verification

### 2. **Job & Study & Training Management**
- Browse job offers and study programs
- Advanced filtering and search
- Swipe interface for discovering opportunities
- Favorite/save functionality
- Application tracking

### 3. **Mobility Dossier**
- Multi-step application creation
- Document upload and management
- Offer selection with AI matching
- Training recommendations
- Contract negotiation

### 4. **Professional Development**
- Skills assessment with AI
- Competency reports and PDF generation
- Training program enrollment
- Progress tracking

### 5. **Messaging**
- Real-time chat with Socket.IO
- File attachments
- Conversation management
- Unread message tracking

### 6. **NFC CV Sharing**
- Upload and manage multiple CVs
- Set active CV for NFC sharing
- Quick sharing via NFC tags

### 7. **Profile Management**
- Profile completion tracking
- Multi-language support
- Statistics dashboard
- Credit balance management

### 8. **Referral System**
- Invite friends via email
- Track referrals
- Earn rewards

## 📦 Main Dependencies

```json
{
  "@expo/vector-icons": "^14.1.0",
  "@tanstack/react-query": "^5.87.1",
  "expo-router": "~4.0.14",
  "react-native": "0.76.5",
  "nativewind": "^4.1.23",
  "zustand": "^5.0.2",
  "i18next": "^24.2.1",
  "socket.io-client": "^4.8.1",
}
```

## 🔧 Environment Configuration

Create a .env file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://api.talentxpo.com/front
EXPO_PUBLIC_SOCKET_URL=https://api.talentxpo.com
```

## 📱 Build & Deployment

### Development Build

```bash
npx expo run:android
npx expo run:ios
```

### Production Build with EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

See eas.json for build configuration.

## 🎨 Styling

The app uses NativeWind (Tailwind CSS) for styling with custom color palette defined in colors.ts.

## 🔄 RTL Support

Full right-to-left (RTL) support for Arabic language with the `useRTLLayout` hook.


## 🔗 Related Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

---

**Note**: This app is part of the Josoor ecosystem. For the web platform, visit [https://talentexpo.eu](https://talentexpo.eu)