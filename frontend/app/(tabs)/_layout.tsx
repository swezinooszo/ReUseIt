import { Tabs,useRouter,Redirect } from 'expo-router';
import { TabBarIcon } from '../components/navigation/TabBarIcon';
import { Colors } from '../constants/Color';
import { useColorScheme,TouchableOpacity,View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { showConfirmationDialog } from '../utils/chatUtils';
//import { NotificationProvider } from '@/context/NotificationContext';
import * as Notifications from "expo-notifications";
// import { fetchUnreadCount } from '../utils/notificationUtils';
import { useState,useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // ✅ NEW (iOS)
    shouldShowList: true,   // ✅ NEW (iOS)
  }),
});

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn,loading,logout } = useAuth();
  //const [unreadCount, setUnreadCount] = useState<number | undefined>(undefined);
   const { unreadCount } = useNotification();

  const router = useRouter();
   // console.log('2. _layout in tabs');

  // useEffect(() => {
  //   const loadUnread = async () => {
  //     const count = await fetchUnreadCount();
  //       console.log("Unread count:", count); 
  //     setUnreadCount(count > 0 ? count : undefined);
  //   };
  //   loadUnread();
  // }, []);

  if (loading) {
    return null; // or <SplashScreen />
   }
  //console.log(` isLogin ${isLoggedIn}`)
  if (!isLoggedIn) {
   // console.log(` isLogin ${isLoggedIn}`)
     return <Redirect href="/signin" />;
     //return <Redirect href="/(me)/reservationTiming" />;
  }

   const onLogout = () => {
    //console.log('logout clicked')
    showConfirmationDialog(
        'Confirm log out',
        'Are you sure you want to log out?',
        () => {
            logout();
        },
        () => {
        }
      )
    }

  return (
    //  <NotificationProvider>
    <Tabs
    screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
   // headerShown: false,
    }}>
        <Tabs.Screen
        name="index"
        options={{
          headerShown:false,
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search'} color={color} />
            ),
        }}
        />
        <Tabs.Screen
        name="addListing"
        options={{
            headerShown:false,
            title: 'Add Listing',
            tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'list-circle' : 'list-circle-outline'} color={color} />
            <MaterialCommunityIcons name="plus-box" size={24} color={color} />
            ),
        }}
        />

        <Tabs.Screen
        name="updates"
        options={{
            title: 'Updates',
            tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="bell-ring" size={24} color={color} />
            ),
            tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
            tabBarBadgeStyle: { backgroundColor: 'red', color: 'white' },
            
        }}
        />


        <Tabs.Screen
        name="me"
        options={{
            title: 'Me',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
            // <TabBarIcon name={focused ? 'bar-chart-sharp' : 'bar-chart-outline'} color={color} />
            <FontAwesome5 name="user-alt" size={24} color={color} />
            ),
            headerRight: () => {
            return (
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={onLogout} 
                    style={{ marginRight: 10 }} // Add some spacing for the icon
                >
                    <Ionicons name="log-out-outline" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(me)/FavoriteList')} 
                    style={{ marginRight: 10 }} // Add some spacing for the icon
                >
                    <MaterialIcons name= "favorite" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(me)/chatlist')} 
                    style={{ marginRight: 10 }} // Add some spacing for the icon
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )

            }
        }}
        />
    </Tabs>
    // </NotificationProvider>
  );
}
