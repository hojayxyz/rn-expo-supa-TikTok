import {
  ClerkProvider,
  ClerkLoaded,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-expo';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import LoginScreen from './Apps/Screens/LoginScreen/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import TabNaviation from './Apps/Navigations/TabNavigation';
import 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    NotoRegular: require('./assets/fonts/NotoSansKR-Regular.ttf'),
    NotoMedium: require('./assets/fonts/NotoSansKR-Medium.ttf'),
    NotoBold: require('./assets/fonts/NotoSansKR-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <View style={styles.container}>
          <SignedIn>
            <NavigationContainer>
              <TabNaviation />
            </NavigationContainer>
          </SignedIn>
          <SignedOut>
            <LoginScreen />
          </SignedOut>
        </View>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
