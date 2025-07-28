# 🚀 Trashure Mobile App Migration Plan

## Overview
Convert the existing Next.js web app to a React Native iOS app while maintaining the same backend, database, and business logic.

## 🎯 Migration Strategy

### Phase 1: Setup & Foundation (Week 1)
1. **Initialize React Native project**
   ```bash
   npx react-native@latest init TrashureMobile --template react-native-template-typescript
   ```

2. **Install essential dependencies**
   ```bash
   npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
   npm install react-native-safe-area-context react-native-screens
   npm install @react-native-async-storage/async-storage
   npm install react-native-vector-icons
   npm install react-native-image-picker
   npm install react-native-gesture-handler
   ```

3. **Setup navigation structure**
   - Bottom tab navigation (Home, Categories, List Item, Messages, Profile)
   - Stack navigation for individual screens

### Phase 2: Core Components Migration (Week 2-3)

#### 2.1 Authentication System
**Keep existing backend:** `/api/auth/*` routes work unchanged

**Convert to React Native:**
```typescript
// contexts/auth-context.tsx → contexts/auth-context.tsx
// Minimal changes needed - just update storage from cookies to AsyncStorage
```

#### 2.2 UI Components
**Convert shadcn/ui components to React Native:**

| Web Component | React Native Equivalent |
|---------------|------------------------|
| `Button` | `TouchableOpacity` + custom styling |
| `Input` | `TextInput` |
| `Card` | `View` with shadow styling |
| `Modal` | `Modal` from react-native |
| `Select` | Custom dropdown with `TouchableOpacity` |

#### 2.3 Key Screens to Migrate
1. **Login/Signup** - Form components
2. **Home** - Item grid with FlatList
3. **Category Pages** - Filtering and sorting
4. **List Item** - Image upload with react-native-image-picker
5. **Individual Listing** - Image gallery with react-native-image-picker
6. **Profile** - User settings and avatar

### Phase 3: Native Features (Week 4)

#### 3.1 Image Handling
```typescript
// Replace Next.js Image with React Native Image
import { Image } from 'react-native';

// Replace file upload with react-native-image-picker
import { launchImageLibrary } from 'react-native-image-picker';
```

#### 3.2 Navigation
```typescript
// Replace Next.js router with React Navigation
import { useNavigation } from '@react-navigation/native';
```

#### 3.3 Storage
```typescript
// Replace cookies with AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### Phase 4: Styling & Polish (Week 5)

#### 4.1 Replace Tailwind with React Native StyleSheet
```typescript
// Instead of Tailwind classes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  button: {
    backgroundColor: '#06402B',
    padding: 12,
    borderRadius: 8,
  },
});
```

#### 4.2 Theme System
```typescript
// Create theme constants
export const theme = {
  colors: {
    primary: '#06402B',
    background: '#f5f5f5',
    text: '#111',
    border: '#e5e5e5',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
```

## 🔄 Code Migration Examples

### Example 1: Button Component
```typescript
// Before (Web)
<Button className="bg-accent text-white hover:bg-[hsl(var(--accent)/0.8)]">
  List Item
</Button>

// After (React Native)
<TouchableOpacity 
  style={[styles.button, styles.buttonPrimary]}
  onPress={handlePress}
>
  <Text style={styles.buttonText}>List Item</Text>
</TouchableOpacity>
```

### Example 2: Item Card
```typescript
// Before (Web)
<Card className="overflow-hidden rounded-lg shadow-md">
  <Image src={item.image} alt={item.title} />
  <CardContent>
    <h3>{item.title}</h3>
    <p>${item.price}</p>
  </CardContent>
</Card>

// After (React Native)
<View style={styles.card}>
  <Image source={{ uri: item.image }} style={styles.cardImage} />
  <View style={styles.cardContent}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardPrice}>${item.price}</Text>
  </View>
</View>
```

### Example 3: Form Input
```typescript
// Before (Web)
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="Enter your email" {...field} />
      </FormControl>
    </FormItem>
  )}
/>

// After (React Native)
<View style={styles.formItem}>
  <Text style={styles.label}>Email</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter your email"
    value={email}
    onChangeText={setEmail}
  />
</View>
```

## 📱 Native Features to Add

### 1. Push Notifications
```bash
npm install @react-native-firebase/messaging
```

### 2. Camera Integration
```bash
npm install react-native-camera
```

### 3. Location Services
```bash
npm install @react-native-community/geolocation
```

### 4. Social Sharing
```bash
npm install react-native-share
```

## 🗄️ Backend Integration

### Keep Existing API Routes
- ✅ `/api/auth/*` - Authentication
- ✅ `/api/listings/*` - Listings CRUD
- ✅ `/api/favorites/*` - Favorites
- ✅ `/api/messages/*` - Messaging
- ✅ `/api/cart/*` - Shopping cart

### Update API Calls
```typescript
// Replace fetch with axios for better error handling
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-domain.com/api',
  timeout: 10000,
});

// Add request/response interceptors for auth
api.interceptors.request.use((config) => {
  // Add auth headers if needed
  return config;
});
```

## 🎨 Design System

### Color Palette (Keep Existing)
```typescript
export const colors = {
  primary: '#06402B',      // Dark green
  secondary: '#04331f',    // Darker green
  background: '#f5f5f5',   // Light gray
  text: '#111',           // Dark text
  border: '#e5e5e5',      // Light border
  white: '#ffffff',
  error: '#ef4444',
  success: '#22c55e',
};
```

### Typography
```typescript
export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16 },
  caption: { fontSize: 14, color: '#666' },
};
```

## 🚀 Deployment

### iOS App Store
1. **Apple Developer Account** ($99/year)
2. **Xcode** for building and testing
3. **App Store Connect** for distribution

### Development Workflow
```bash
# Development
npx react-native run-ios

# Build for production
cd ios && xcodebuild -workspace TrashureMobile.xcworkspace -scheme TrashureMobile -configuration Release
```

## 📊 Migration Timeline

| Week | Task | Deliverable |
|------|------|-------------|
| 1 | Setup & Foundation | React Native project with navigation |
| 2 | Core Components | Authentication, basic UI components |
| 3 | Main Screens | Home, categories, listing pages |
| 4 | Native Features | Image picker, camera, notifications |
| 5 | Polish & Testing | Styling, performance, bug fixes |
| 6 | App Store Prep | Icons, screenshots, metadata |

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Apple Developer Account | $99/year |
| Development Time | 6 weeks |
| Design Assets | $500-1000 |
| Testing Devices | $500-1000 |
| **Total** | **$1099-2099 + dev time** |

## 🎯 Success Metrics

- ✅ 90% code reuse from web app
- ✅ Same backend and database
- ✅ Native iOS performance
- ✅ App Store approval
- ✅ User engagement metrics

## 🔧 Next Steps

1. **Set up React Native development environment**
2. **Create new React Native project**
3. **Start with authentication screens**
4. **Gradually migrate components**
5. **Test on iOS simulator and device**
6. **Submit to App Store**

---

**Ready to start?** Let me know if you'd like me to help you set up the React Native project and begin the migration! 