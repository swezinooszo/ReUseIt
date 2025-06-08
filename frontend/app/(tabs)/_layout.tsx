import { Tabs,useRouter,Redirect } from 'expo-router';
import { TabBarIcon } from '../components/navigation/TabBarIcon';
import { Colors } from '../constants/Color';
import { useColorScheme,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn,loading } = useAuth();

    console.log('2. _layout in tabs');

    if (loading) {
    return null; // or <SplashScreen />
   }

  if (!isLoggedIn) {
    console.log(` isLogin ${isLoggedIn}`)
    return <Redirect href="/signin" />;
  }

  return (
    <Tabs
    screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    }}>
        <Tabs.Screen
        name="index"
        options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cart-sharp' : 'cart-outline'} color={color} />
            ),
        }}
        />
        <Tabs.Screen
        name="addListing"
        options={{
            title: 'Add Listing',
            tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'list-circle' : 'list-circle-outline'} color={color} />
            ),
        }}
        />
        <Tabs.Screen
        name="me"
        options={{
            title: 'Me',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bar-chart-sharp' : 'bar-chart-outline'} color={color} />
            ),
            headerRight: () => {
            const router = useRouter();
            return (
                <TouchableOpacity
                    onPress={() => router.push('/(me)/chatlist')} 
                    style={{ marginRight: 10 }} // Add some spacing for the icon
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
                </TouchableOpacity>
            )

            }
        }}
        />
    </Tabs>
  );
}
