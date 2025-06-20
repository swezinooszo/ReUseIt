import { Tabs } from 'expo-router';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function addListingLayout() {

  return (
    <Stack>

        {/* <Stack.Screen name='choosePhoto' options={{headerShown:false}}></Stack.Screen> */}
        <Stack.Screen name="chooseCategory"  options={{headerShown:false}}/>
        <Stack.Screen name="itemDetailsForm"  options={{headerShown:false}}/>
        <Stack.Screen name="itemReviewForm"  options={{headerShown:false}}/>
        <Stack.Screen name="listingResult"  options={{headerShown:false}}/>
    </Stack>
  );
}
