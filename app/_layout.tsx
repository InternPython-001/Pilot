import React, { useEffect, useState } from 'react';
import { Stack, useRouter, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync();
type RoutePaths = "/(tabs)" | "/(auth)" | "/(admintabs)/checklistListScreen";
export default function RootLayout() {

  const [isAppReady, setAppReady] = useState(false);
  const [redirectTo, setRedirectTo] = useState<RoutePaths | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode<{ role?: string }>(token);
          const role = decoded?.role;
          if (role === 'user') {
            setRedirectTo('/(tabs)');
          } else if (role === 'admin') {
            setRedirectTo('/(admintabs)/checklistListScreen');
          } else {
            setRedirectTo('/(auth)');
          }
        } else {
          setRedirectTo('/(auth)');
        }
      } catch (error) {
        console.error('Token check failed:', error);
        setRedirectTo('/(auth)');
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    checkToken();
  }, []);

  if (!isAppReady || !redirectTo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Use Redirect instead of push/replace
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Redirect href={redirectTo} />
    </>
  );
}
