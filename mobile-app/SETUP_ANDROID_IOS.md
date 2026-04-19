# Android & iOS Setup Guide

## Android Setup

### Required Permissions

Add these permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.realestateapp">

    <!-- Camera Permission -->
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- File Permissions -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <!-- Location Permissions -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <!-- Internet Permission -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
```

### Build Configuration

Ensure `android/app/build.gradle` has:

```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.realestateapp"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.5.1'
    implementation 'androidx.core:core:1.9.0'
    implementation 'com.google.android.material:material:1.5.0'
}
```

### Android Emulator Setup

```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd Pixel_4_API_31

# Or use Android Studio to create and start emulator
```

---

## iOS Setup

### Required Permissions

Add these to `ios/RealEstateApp/Info.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Camera Permission -->
    <key>NSCameraUsageDescription</key>
    <string>This app needs access to your camera to take property photos.</string>

    <!-- Photo Library Permission -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>This app needs access to your photo library to select property images.</string>

    <!-- Location Permission -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>This app needs access to your location to set property coordinates.</string>
    
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
    <string>This app needs access to your location to set property coordinates.</string>

    <!-- Other required keys -->
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>

    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>

</dict>
</plist>
```

### CocoaPods Installation

```bash
# Navigate to iOS directory
cd ios

# Install pods
pod install

# Return to project root
cd ..
```

### Xcode Configuration

1. Open Xcode:
```bash
open ios/RealEstateApp.xcworkspace
```

2. Select target "RealEstateApp"

3. Go to "Build Phases" and ensure:
   - React and other dependencies are linked

4. Go to "Build Settings":
   - Search for "Header Search Paths"
   - Add: `$(SRCROOT)/../node_modules/react-native/React`

### iOS Simulator Setup

```bash
# List available simulators
xcrun simctl list devices

# Start simulator
xcrun simctl boot "iPhone 14"

# Or open Xcode and use the Device selector
```

---

## Granting Permissions at Runtime

The app uses React Native's `PermissionsAndroid` and platform APIs to request permissions at runtime.

### For Android 6.0+

The app will request:
- Camera
- Storage
- Location

Users can grant these when prompted by the app.

### For iOS

iOS permissions are requested automatically when:
- User tries to take a photo → Camera permission
- User selects from gallery → Photo Library permission
- User enables location → Location permission

---

## Debugging Permissions

### Android
```bash
# Check granted permissions
adb shell pm list permissions -d

# Revoke a permission
adb shell pm revoke com.realestateapp android.permission.CAMERA

# Grant a permission
adb shell pm grant com.realestateapp android.permission.CAMERA
```

### iOS
- Go to iPhone Settings → Privacy
- Check if the app has necessary permissions
- Toggle permissions on/off to reset

---

## Building for Production

### Android Production Build

```bash
# Build signed APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### iOS Production Build

```bash
# Via Xcode
open ios/RealEstateApp.xcworkspace
# Select "RealEstateApp" scheme
# Product → Archive
# Distribute App

# Or via command line
cd ios
xcodebuild -workspace RealEstateApp.xcworkspace -scheme RealEstateApp -configuration Release
```

---

## Environment-Specific Configuration

### Development
- Debug mode enabled
- Verbose logging
- Hot reload enabled

### Production
- Debug mode disabled
- Minimal logging
- Optimized bundle size
- Proguard enabled (Android)
- Strip symbols (iOS)

---

## Troubleshooting

### iOS Build Fails
```bash
cd ios
rm -rf Pods Podfile.lock
pod repo update
pod install
cd ..
```

### Android Build Fails
```bash
cd android
./gradlew clean
./gradlew build
cd ..
```

### Permissions Not Working
- Clear app data: Settings → Apps → [App] → Storage → Clear Cache/Data
- Uninstall and reinstall app
- Check AndroidManifest.xml and Info.plist

### Emulator/Simulator Issues
- Restart the emulator/simulator
- Check available RAM and storage
- Update Android SDK/Xcode

---

## Additional Resources

- [Android Permissions Documentation](https://developer.android.com/training/permissions)
- [iOS Privacy Documentation](https://developer.apple.com/privacy/)
- [React Native Permissions](https://reactnative.dev/docs/permissions)
- [CocoaPods Guide](https://cocoapods.org)

---

**After completing setup, run:** `npm run android` or `npm run ios`
