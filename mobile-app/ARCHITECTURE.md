# Code Architecture & Best Practices

## Project Overview

This is a React Native real estate application built with TypeScript, using Context API for state management and AsyncStorage for local persistence.

## Architecture Principles

### 1. Component Organization

**Screens** - Full-screen components that represent navigation destinations
- `HomeScreen.tsx` - Property listing
- `AddPropertyScreen.tsx` - Property form
- `PropertyDetailsScreen.tsx` - Property view

**Components** - Reusable UI components
- `PropertyCard.tsx` - Display single property
- `ImagePickerComponent.tsx` - Image selection
- `LocationPicker.tsx` - Location selection

**Context** - Global state management
- `PropertyContext.tsx` - Property data and operations

**Utils** - Helper functions
- `storage.ts` - Data persistence layer

### 2. Data Flow

```
User Action (UI)
    ↓
Screen/Component
    ↓
useProperty() Hook
    ↓
PropertyContext
    ↓
storage.ts (AsyncStorage)
    ↓
Device Storage
```

### 3. Type Safety

All data structures are defined in `src/types/index.ts`:
- `Property` - Complete property data
- `PropertyFormData` - Form input data
- `LocationData` - Location information

### 4. State Management Pattern

```typescript
// In PropertyContext
const [properties, setProperties] = useState<Property[]>([]);

// Operations update both state and storage
const addProperty = async (formData: PropertyFormData) => {
  const newProperty = createPropertyObject(formData);
  await storage.addProperty(newProperty);  // Persist
  setProperties([...properties, newProperty]); // Update state
};
```

## File Structure Explanation

### src/types/index.ts
Defines all TypeScript interfaces used throughout the app:
```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  price: { sale: number | null; rent: number | null };
  location: { address: string; latitude: number; longitude: number };
  images: string[];
  // ... more fields
}
```

### src/utils/storage.ts
Abstraction layer for AsyncStorage:
- `getProperties()` - Fetch all properties
- `addProperty()` - Save new property
- `updateProperty()` - Modify existing
- `deleteProperty()` - Remove property
- `getPropertyById()` - Find specific property

### src/context/PropertyContext.tsx
Global state container:
- Wraps entire app
- Provides `useProperty()` hook
- Manages property CRUD operations
- Handles data persistence

### src/screens/HomeScreen.tsx
Main listing screen:
- Shows all properties
- Handles refresh
- Navigation to details
- Delete action

### src/screens/AddPropertyScreen.tsx
Multi-section form:
- Basic details (title, description)
- Property specs (type, BHK, area)
- Pricing (sale and/or rent)
- Images (camera/gallery picker)
- Location (GPS or manual)
- Amenities (multi-select)

### src/components/PropertyCard.tsx
Reusable property display:
- Shows property image
- Title and location
- Key specs (BHK, area)
- Price with label
- Delete button

### src/components/ImagePickerComponent.tsx
Image selection logic:
- Camera integration
- Gallery picker
- Image preview
- Remove capability

### src/components/LocationPicker.tsx
Location selection:
- GPS coordinates
- Manual address entry
- Coordinate display
- Error handling

### src/navigation/Navigation.tsx
Navigation configuration:
- Stack navigator setup
- Screen params typing
- Header configuration
- Navigation linking

## Common Patterns

### Using the Property Context

```typescript
import { useProperty } from '../context/PropertyContext';

export const MyComponent = () => {
  const { properties, addProperty, deleteProperty } = useProperty();
  
  // Use properties, call functions
};
```

### Form Handling

```typescript
const [formData, setFormData] = useState<PropertyFormData>({
  // initial values
});

// Update single field
setFormData({ ...formData, title: 'New Title' });

// Nested object update
setFormData({
  ...formData,
  price: { ...formData.price, sale: 5000000 }
});
```

### Navigation with Params

```typescript
// Navigating to details
navigation.navigate('PropertyDetails', { propertyId: property.id });

// In destination screen
const { propertyId } = route.params;
```

### Async Operations

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await addProperty(formData);
    Alert.alert('Success', 'Property added');
    navigation.goBack();
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};
```

## Styling Guidelines

### Style Organization
```typescript
const styles = StyleSheet.create({
  container: { /* ... */ },
  section: { /* ... */ },
  label: { /* ... */ },
  input: { /* ... */ },
  // Grouped by component/area
});
```

### Color Palette
- Primary: `#2196F3` (Blue)
- Success: `#4CAF50` (Green)
- Danger: `#ff6b6b` (Red)
- Background: `#f5f5f5` (Light Gray)
- Text Dark: `#333` (Dark)
- Text Light: `#666` (Medium Gray)

### Responsive Design
```typescript
const { width } = Dimensions.get('window');

const imageWidth = width - 32; // Account for padding
```

## Best Practices Implemented

✅ **Type Safety**
- Full TypeScript coverage
- Proper interface definitions
- No `any` types

✅ **Error Handling**
- Try-catch blocks
- User-friendly alerts
- Console error logging

✅ **Performance**
- Memoization where needed
- Efficient re-renders
- Lazy loading (ready for implementation)

✅ **Code Organization**
- Separation of concerns
- Reusable components
- Clean file structure

✅ **User Experience**
- Loading states
- Empty states
- Error messages
- Refresh capability

✅ **Data Management**
- Centralized storage
- Consistent API
- Data persistence

## Adding New Features

### Example: Add Filtering

1. Add filter state to PropertyContext:
```typescript
const [filterType, setFilterType] = useState<string>('all');
```

2. Add filter function:
```typescript
const getFilteredProperties = (): Property[] => {
  return properties.filter(p => 
    filterType === 'all' || p.propertyType === filterType
  );
};
```

3. Use in HomeScreen:
```typescript
const filtered = getFilteredProperties();
```

### Example: Add Favorites

1. Create FavoritesContext
2. Add favorite button to PropertyCard
3. Toggle favorite status
4. Display favorites badge

## Testing Approach

### Components to Test
- Form validation
- Image picker integration
- Location picker
- Storage operations
- Navigation

### Example Test
```typescript
test('Property card displays correct information', () => {
  const property = { /* ... */ };
  const { getByText } = render(
    <PropertyCard property={property} onPress={() => {}} />
  );
  expect(getByText(property.title)).toBeTruthy();
});
```

## Performance Optimization Tips

1. **Memoization**
```typescript
const MemoizedCard = React.memo(PropertyCard);
```

2. **Lazy Loading**
```typescript
const images = property.images.slice(0, 5); // Load first 5
```

3. **Avoid Large Lists**
```typescript
// Use pagination or virtualization
<FlatList
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  // ...
/>
```

4. **Image Optimization**
```typescript
// Compress before storing
const compressedImage = await compressImage(image);
```

## Debugging Tips

### Enable Logging
```typescript
// In storage.ts
console.log('[Storage]', 'Getting properties', data);
```

### React DevTools
```bash
npm install --save-dev @react-native/debugger
```

### Metro Console
The terminal running `npm start` shows all logs and errors.

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| State not updating | Incorrect immutability | Always create new object/array |
| Images not showing | Invalid URI | Verify file:// path exists |
| Location null | GPS not enabled | Request permission first |
| App crashes | Unhandled error | Add try-catch, check logs |

## Future Architecture Improvements

1. **Redux or Zustand** - For complex state
2. **Query Library** - For API calls
3. **Modularization** - Feature-based structure
4. **Testing Suite** - Jest + React Testing Library
5. **CI/CD Pipeline** - GitHub Actions

## Resources

- [React Native Docs](https://reactnative.dev)
- [TypeScript Guide](https://www.typescriptlang.org)
- [React Context API](https://react.dev/reference/react/useContext)
- [React Navigation](https://reactnavigation.org)

---

**Remember:** Clean code is maintainable code. Follow these patterns consistently! 🚀
