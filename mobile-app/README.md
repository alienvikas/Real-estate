# Real Estate Mobile App

A React Native mobile application for buying and selling real estate properties. Users can add flats/properties with images, location details, and prices for both sale and rent.

## Features

✨ **Core Features:**
- 🏠 Browse all properties in a beautiful card-based UI
- ➕ Add new properties with detailed information
- 📸 Upload multiple images for each property
- 📍 Set location using GPS or manual address entry
- 💰 Set prices for both sale and rent
- 🏗️ Specify property type (apartment, house, villa, commercial)
- 🛏️ Indicate number of bedrooms (BHK)
- 📐 Add property area in square feet
- ✅ Select multiple amenities (WiFi, AC, Parking, etc.)
- 📱 View detailed property information
- 🗑️ Delete properties
- 💾 Local data persistence using AsyncStorage

## Project Structure

```
mobile-app/
├── src/
│   ├── components/
│   │   ├── PropertyCard.tsx          # Property listing card component
│   │   ├── ImagePickerComponent.tsx  # Image selection component
│   │   └── LocationPicker.tsx        # Location selection component
│   ├── context/
│   │   └── PropertyContext.tsx       # State management using React Context
│   ├── screens/
│   │   ├── HomeScreen.tsx            # Main property listing screen
│   │   ├── AddPropertyScreen.tsx     # Form to add new properties
│   │   └── PropertyDetailsScreen.tsx # Detailed property view
│   ├── navigation/
│   │   └── Navigation.tsx            # Navigation configuration
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   └── utils/
│       └── storage.ts                # AsyncStorage utilities
├── App.tsx                           # Main app component
├── index.js                          # App entry point
├── app.json                          # Expo/React Native config
├── tsconfig.json                     # TypeScript config
└── package.json                      # Dependencies
```

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- React Native CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Setup

1. **Navigate to the project directory:**
```bash
cd mobile-app
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Install native dependencies (iOS only):**
```bash
cd ios
pod install
cd ..
```

## Running the App

### Android
```bash
npm run android
# or
react-native run-android
```

### iOS
```bash
npm run ios
# or
react-native run-ios
```

### Development Server
```bash
npm start
# or
react-native start
```

Then press `a` for Android or `i` for iOS.

## Usage

### Adding a Property

1. Tap the **"+ Add Property"** button on the home screen
2. Fill in the basic details:
   - Property title
   - Description
   - Property type (apartment, house, villa, commercial)
   - Number of bedrooms (BHK)
   - Area in square feet

3. Set the pricing:
   - Price for sale (optional)
   - Price for rent per month (optional)
   - Note: At least one price must be provided

4. Add images:
   - Use **Camera** to take new photos
   - Use **Gallery** to select from device
   - Add multiple images by tapping the buttons again
   - Remove images by tapping the X button

5. Set location:
   - Tap **"Get Current Location"** to use GPS
   - Or manually enter the address
   - Latitude and longitude will be displayed

6. Select amenities:
   - Tap amenity tags to toggle selection
   - Multiple amenities can be selected

7. Tap **"Add Property"** to save

### Viewing Properties

1. Swipe down to refresh the property list
2. Tap on any property card to view details
3. View all images in the image slider
4. Check pricing, location, and amenities

### Deleting a Property

1. From home screen: Tap the **Delete** button on any property card
2. From property details: Tap **Delete Property** at the bottom
3. Confirm deletion when prompted

## Data Storage

Properties are stored locally on the device using **AsyncStorage** (React Native's persistent storage). No backend server is required, and all data remains private on the device.

## Technologies Used

- **React Native** - Mobile app framework
- **TypeScript** - Static typing
- **React Navigation** - Screen navigation
- **React Context API** - State management
- **AsyncStorage** - Local data persistence
- **react-native-image-picker** - Image selection
- **react-native-geolocation-service** - GPS location
- **react-native-maps** - Map integration (ready for implementation)

## Permissions Required

### Android
Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### iOS
Add to `Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take property photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select property images</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to set property coordinates</string>
```

## Styling

The app uses:
- **Material Design** inspired UI
- **Blue (#2196F3)** as primary color
- **Consistent padding** and spacing
- **Responsive design** that works on different screen sizes

## Future Enhancements

- 🗺️ Map view for properties
- 🔍 Advanced search and filtering
- ⭐ Favorites/wishlist feature
- 👤 User profiles
- 💬 In-app messaging
- ⭐ Property ratings and reviews
- 🌐 Backend server integration
- ☁️ Cloud image storage
- 📊 Analytics dashboard
- 🔐 User authentication

## Troubleshooting

### Images not showing in gallery
- Check image picker permissions in app settings
- Ensure photos exist on device

### Location not updating
- Enable location services in device settings
- Grant location permission to the app
- Ensure GPS is enabled

### App crashes on Android
- Clear app cache: Settings → Apps → [App Name] → Storage → Clear Cache
- Rebuild the app: `npm run android`

### Metro bundler issues
- Kill the bundler and restart: `npm start`
- Clear cache: `npm start -- --reset-cache`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues or questions, please open an issue on the repository.

---

**Happy Real Estate Listing! 🏠✨**
