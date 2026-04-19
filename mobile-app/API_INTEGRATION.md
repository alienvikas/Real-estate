# API Integration Guide

This guide explains how to integrate a backend API with the Real Estate mobile app.

## Current Architecture

Currently, the app uses **AsyncStorage** for local data persistence:
- All properties stored on device
- No server communication
- No authentication needed
- Data private to user's device

## Future: Cloud Integration

### Step 1: Create API Service

Create `src/services/api.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  // const token = await getAuthToken();
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  // Properties
  getProperties: () => apiClient.get('/properties'),
  getProperty: (id: string) => apiClient.get(`/properties/${id}`),
  createProperty: (data: any) => apiClient.post('/properties', data),
  updateProperty: (id: string, data: any) =>
    apiClient.put(`/properties/${id}`, data),
  deleteProperty: (id: string) => apiClient.delete(`/properties/${id}`),

  // Images
  uploadImage: (formData: FormData) =>
    apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Search & Filter
  searchProperties: (query: string) =>
    apiClient.get('/properties/search', { params: { q: query } }),

  // Categories
  getPropertyTypes: () => apiClient.get('/property-types'),
};

export default apiClient;
```

### Step 2: Update PropertyContext

Modify `src/context/PropertyContext.tsx` to use API:

```typescript
const loadProperties = async () => {
  setLoading(true);
  try {
    // From API
    const response = await api.getProperties();
    setProperties(response.data);

    // OR from local storage (hybrid approach)
    const cached = await storage.getProperties();
    setProperties(cached);
  } catch (error) {
    console.error('Error loading properties:', error);
  } finally {
    setLoading(false);
  }
};

const addProperty = async (formData: PropertyFormData) => {
  try {
    // Call API
    const response = await api.createProperty(formData);
    const newProperty = response.data;

    // Also save locally for offline access
    await storage.addProperty(newProperty);

    setProperties([...properties, newProperty]);
  } catch (error) {
    throw error;
  }
};
```

### Step 3: Handle Image Uploads

```typescript
// In AddPropertyScreen.tsx
const handleImageUpload = async (image: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: image,
    type: 'image/jpeg',
    name: 'property_image.jpg',
  } as any);

  try {
    const response = await api.uploadImage(formData);
    return response.data.imageUrl; // Cloud URL
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};
```

### Step 4: Add Authentication

Create `src/services/auth.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const AUTH_TOKEN_KEY = 'auth_token';

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;

    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response.data;
  },

  async register(userData: any): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    const { token } = response.data;

    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },

  async refreshToken(): Promise<string> {
    const response = await api.post('/auth/refresh');
    const { token } = response.data;

    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return token;
  },
};
```

### Step 5: Create Auth Context

Create `src/context/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Step 6: Update App.tsx

```typescript
import { AuthProvider } from './src/context/AuthContext';
import { PropertyProvider } from './src/context/PropertyContext';
import { Navigation } from './src/navigation/Navigation';

export default function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Navigation />
      </PropertyProvider>
    </AuthProvider>
  );
}
```

### Step 7: Add Login Screen

Create `src/screens/LoginScreen.tsx`:

```typescript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      // Navigation handled by auth context
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real Estate App</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#2196F3', marginTop: 16, textAlign: 'center' },
});
```

## Backend API Requirements

### Endpoints Needed

```
POST   /auth/login              - User login
POST   /auth/register           - User registration
POST   /auth/refresh            - Refresh token
POST   /properties              - Create property
GET    /properties              - List properties
GET    /properties/:id          - Get property
PUT    /properties/:id          - Update property
DELETE /properties/:id          - Delete property
POST   /upload                  - Upload image
GET    /properties/search       - Search properties
```

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  property_type VARCHAR NOT NULL,
  bhk INTEGER,
  area DECIMAL,
  price_sale DECIMAL,
  price_rent DECIMAL,
  address VARCHAR,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Property Images Table
CREATE TABLE property_images (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  image_url VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Property Amenities Table
CREATE TABLE property_amenities (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  amenity VARCHAR NOT NULL
);
```

## Hybrid Approach (Recommended)

Combine local storage with cloud sync:

```typescript
// Sync data in background
useEffect(() => {
  const syncData = async () => {
    try {
      // Get local changes
      const local = await storage.getProperties();

      // Sync with server
      const server = await api.getProperties();

      // Merge (server wins on conflicts)
      const merged = mergeProperties(local, server);
      setProperties(merged);
    } catch (error) {
      // Use local cache if server fails
      const cached = await storage.getProperties();
      setProperties(cached);
    }
  };

  syncData();
}, []);
```

## Error Handling

```typescript
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'Server error';
  } else if (error.request) {
    // No response received
    return 'Network error. Please check your connection.';
  } else {
    return 'An error occurred.';
  }
};
```

## Testing API Integration

```typescript
// Mock API for testing
jest.mock('../services/api', () => ({
  api: {
    getProperties: jest.fn(() => Promise.resolve({ data: [] })),
    createProperty: jest.fn(),
  },
}));
```

## Security Considerations

- ✅ Use HTTPS only
- ✅ Validate token expiration
- ✅ Implement refresh token flow
- ✅ Never store sensitive data in AsyncStorage without encryption
- ✅ Use SSL pinning for production
- ✅ Sanitize user input

## Performance Tips

- Cache responses with React Query or SWR
- Implement pagination for large lists
- Compress images before upload
- Use background sync for offline mode
- Implement request throttling

---

Ready to integrate a backend? Start with Step 1 and build incrementally! 🚀
