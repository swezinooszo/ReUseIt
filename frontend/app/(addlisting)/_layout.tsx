import { Tabs } from 'expo-router';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function addListingLayout() {

 
  return (
    <Stack>

        {/* <Stack.Screen name='choosePhoto' options={{headerShown:false}}></Stack.Screen> */}
        <Stack.Screen name="chooseCategory"  options={{headerShown:false}}/>
        <Stack.Screen name="itemDetailsForm"  options={{headerShown:false}}/>
        <Stack.Screen name="itemReviewForm"  options={{headerShown:false}}/>
          <Stack.Screen name="listingResult"  
          options={{
          headerTitle: '',
          headerLeft: () => {
            const router = useRouter();
            return (
              <TouchableOpacity
                onPress={() => router.navigate('/(tabs)')}
                style={{ marginLeft: 10 }}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        }}
        />

    </Stack>
  );
}
