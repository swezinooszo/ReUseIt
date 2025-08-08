import { Tabs } from 'expo-router';
import React,{ useEffect } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
//import { NotificationProvider } from '@/context/NotificationContext';

export default function TabLayout() {
  return (
    // <NotificationProvider>
    <Stack>
        <Stack.Screen name="chatlist"  options={{headerShown:false}}
        // options={({ navigation }) => ({
        //     headerTitle: 'Chat List',
        //     headerLeft: () => (
        //     <TouchableOpacity
        //         onPress={() => navigation.goBack()}
        //         style={{ marginLeft: 10 }} // Add some spacing for the icon
        //     >
        //         <Ionicons name="chevron-back" size={24} />
        //     </TouchableOpacity>
        //     ),
        // })}
        />

        <Stack.Screen name="chat" options={{headerShown:false}}
        // options={({ navigation }) => ({
        //     headerTitle: 'Chat',
        //     headerLeft: () => (
        //     <TouchableOpacity
        //         onPress={() => navigation.goBack()}
        //         style={{ marginLeft: 10 }} // Add some spacing for the icon
        //     >
        //         <Ionicons name="chevron-back" size={24} />
        //     </TouchableOpacity>
        //     ),
        // })}
        />
        <Stack.Screen name="editListingDetails" options={{headerShown:false}}/>
        <Stack.Screen name="editListingDetailsForm" options={{headerShown:false}}/>
        <Stack.Screen name="editListingDetailsSubForm" options={{headerShown:false}}/>
        <Stack.Screen name="reservationTiming" options={{headerShown:false}}/>
        <Stack.Screen name="reservationTimingResult" options={{headerShown:false}}/>
        <Stack.Screen name="FavoriteList" 
          options={{
          headerTitle: '',
          headerLeft: () => {
            const router = useRouter();
            return (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back-outline" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        }}
        />
        <Stack.Screen name="updateProfilePic" options={{headerShown:true}}/>
        <Stack.Screen name="review" options={{headerShown:false}}/>
        <Stack.Screen name="reviewList" options={{headerShown:false}}/>
    </Stack>
    // </NotificationProvider>
  );
}
