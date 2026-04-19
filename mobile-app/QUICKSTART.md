# Real Estate Mobile App - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Prerequisites Check
Make sure you have installed:
- Node.js (v14+): [Download](https://nodejs.org/)
- Android Studio (for Android) or Xcode (for iOS)

### Step 2: Install Dependencies
```bash
cd mobile-app
npm install
```

### Step 3: Setup Android/iOS

**For Android:**
- Ensure Android Studio is installed with SDK 31+
- Set ANDROID_HOME environment variable

**For iOS:**
```bash
cd ios
pod install
cd ..
```

### Step 4: Run the App

**Development Mode:**
```bash
npm start
```

Then in another terminal:

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## 📱 App Features Overview

### Home Screen
- See all your properties listed as cards
- Each card shows:
  - Property image
  - Title and location
  - BHK and area
  - Price with "Sale" or "Rent" label
- Pull down to refresh
- Tap card to view details
- Tap Delete to remove a property

### Add Property Screen
Fill in these sections:

1. **Basic Details**
   - Title (required)
   - Description (required)

2. **Property Type & Specs**
   - Select type: Apartment, House, Villa, Commercial
   - Select BHK: 1-5 bedrooms
   - Enter area in sq ft

3. **Pricing** (at least one required)
   - Sale price (optional)
   - Rental price/month (optional)

4. **Images** (required)
   - Tap 📷 Camera to take photos
   - Tap 🖼️ Gallery to select photos
   - Add multiple images
   - Tap X on images to remove them

5. **Location**
   - Tap 📍 to get current location via GPS
   - OR manually enter address
   - Shows latitude and longitude

6. **Amenities**
   - Tap to select: WiFi, AC, Parking, Garden, Gym, Pool, etc.

### Property Details Screen
- View full image gallery (swipe left/right)
- See all property information
- View location with coordinates
- See amenities
- View creation/update dates
- Delete button at bottom

## 🔧 Common Tasks

### Change App Name
Edit `app.json`:
```json
{
  "name": "Your App Name",
  "displayName": "Your Display Name"
}
```

### Add a Custom Color
Update colors in component StyleSheets. Primary color is `#2196F3`.

### Clear App Data
**Android:**
```bash
adb shell pm clear com.yourapp
```

**iOS:**
Long press app → Remove App → Remove App + Data

### Debug Issues
1. Clear Metro cache: `npm start -- --reset-cache`
2. Check console logs: `npm start` shows all logs
3. Use React Native Debugger for advanced debugging

## 📦 Project Structure Summary

```
src/
├── context/          → App state (PropertyContext)
├── screens/          → 3 main screens
├── components/       → Reusable UI components
├── navigation/       → Screen navigation
├── types/            → TypeScript definitions
└── utils/            → Helper functions
```

## 🎨 Customization Examples

### Change Primary Color
Search for `#2196F3` in component files and replace with your color.

### Adjust Card Spacing
Edit margin values in `PropertyCard.tsx` stylesheet.

### Modify Input Fields
Edit TextInput components in `AddPropertyScreen.tsx`.

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails on Android
```bash
npm run android -- --clean
```

### iOS Pod issues
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Metro bundler won't start
- Kill all node processes
- Delete .watchmanconfig if exists
- Run `npm start` again

## 📚 Learn More

- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [TypeScript Handbook](https://www.typescriptlang.org)

## ✅ Checklist Before Publishing

- [ ] Test on Android device/emulator
- [ ] Test on iOS device/simulator
- [ ] Verify all images load correctly
- [ ] Check GPS location works
- [ ] Test delete functionality
- [ ] Verify data persists after app restart
- [ ] Check UI scaling on different screen sizes
- [ ] Review all text for typos

## 📝 Notes

- Data is stored locally on device (no server needed)
- Images are stored with file:// URIs
- GPS requires location permission
- Camera/Gallery requires media permission
- All data is private to this device

## 🎓 Next Steps

1. ✅ Get the app running
2. Add a test property with images
3. Explore all screens
4. Try adding/deleting properties
5. Review code structure
6. Customize colors and styling
7. Deploy to app stores when ready

---

**Need help?** Check README.md for detailed documentation!

Happy coding! 🚀
