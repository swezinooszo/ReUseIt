import { Tabs } from 'expo-router';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function ExploreLayout() {

  return (
    <Stack>
        <Stack.Screen name='searchResult' options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="listingDetails"  options={{headerShown:false}}/>
         <Stack.Screen name="sellerDetails"  
          options={({ navigation }) => ({
              headerTitle: '',
              headerLeft: () => (
              <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 10 }} // Add some spacing for the icon
              >
                <Ionicons name="arrow-back-outline" size={24} color="black" />
              </TouchableOpacity>
              ),
          })}
        />
    </Stack>
  );
}
