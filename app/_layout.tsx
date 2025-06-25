import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

type RoutePaths = "/(tabs)" | "/(auth)" | "/(admintabs)/checklistListScreen";

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const [redirectTo, setRedirectTo] = useState<RoutePaths>("/(auth)");
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          try {
            const decoded = jwtDecode<{ role?: string }>(token);
            const role = decoded?.role;
            if (role === 'user') {
              setRedirectTo('/(tabs)');
            } else if (role === 'admin') {
              setRedirectTo('/(admintabs)/checklistListScreen');
            }
          } catch {
            setRedirectTo('/(auth)');
          }
        } else {
          setRedirectTo('/(auth)');
        }
      } catch {
        setRedirectTo('/(auth)');
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (isAppReady && redirectTo) {
      router.replace(redirectTo);
    }
  }, [isAppReady, redirectTo]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}