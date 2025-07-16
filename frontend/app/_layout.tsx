import { Stack,router,useRootNavigationState } from "expo-router";
import { Redirect, Slot } from 'expo-router';
import { useState,useEffect } from "react";
import { AuthProvider,useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { NotificationProvider } from '@/context/NotificationContext';
import * as Notifications from "expo-notifications";
//import { useAuth,AuthProvider } from './AuthContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // ✅ NEW (iOS)
    shouldShowList: true,   // ✅ NEW (iOS)
  }),
});

export default function RootLayout() {
   console.log('1. RootLayout');

  // const { loading } = useAuth();

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
      // *** AuthContext (via <AuthProvider>) is called and useEffect of AuthContext is called too.
      <NotificationProvider>
       <AuthProvider>
        <Stack>
             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(explore)" options={{ headerShown: false }} />
              <Stack.Screen name="(addlisting)" options={{ headerShown: false }} />
              <Stack.Screen name="(me)" options={{ headerShown: false }} />
              <Stack.Screen name="signin" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="verifyotp" options={{ headerShown: false }} />
        </Stack>
        </AuthProvider>
        </NotificationProvider>
  );
}