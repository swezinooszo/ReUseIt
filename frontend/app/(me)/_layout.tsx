import { Tabs } from 'expo-router';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {

  return (
    <Stack>
        <Stack.Screen name="chatlist"  
        options={({ navigation }) => ({
            headerTitle: 'Chat List',
            headerLeft: () => (
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }} // Add some spacing for the icon
            >
                <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
            ),
        })}
        />

        <Stack.Screen name="chat"  
        options={({ navigation }) => ({
            headerTitle: 'Chat',
            headerLeft: () => (
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }} // Add some spacing for the icon
            >
                <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
            ),
        })}
        />

    </Stack>
  );
}
