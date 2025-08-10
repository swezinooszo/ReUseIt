import { StyleSheet, Text, View,ActivityIndicator,FlatList,Image, TouchableOpacity } from 'react-native'
import React, { useEffect,useState } from 'react'
import { getTokenAndUserId } from "@/app/utils/listingDetailsUtils";
import api from '../utils/api';
import styles from '../styles/notificationStyles';
import { getUserExperience } from '../utils/meUtils';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { router,useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface User {
    _id:string;
    username:string;
    createdAt:string;
    expoPushTokens:[string];
    profileImage:string;
}

interface Notification {
  _id: string;
  user: User;
  type: string;
  message: string;
  reviewer: User;
  isRead:boolean;
   createdAt:string;
}
const updates = () => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    //const navigation = useNavigation();


    //useEffect(() => {
     useFocusEffect(
            useCallback(() => {
              console.log('updates useEffect')
              const fetchNotifications = async () => {
              try {
                  const { token, userId } = await getTokenAndUserId();
                  const res = await api.get(`/notifications/${userId}`);
                  setNotifications(res.data);

              } catch (error) {
                  console.log("Error fetching notifications:", error);
              } finally {
                  setLoading(false);
              }
              };

              fetchNotifications();
      }, [])
    );
 // }, []);

   if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    );
  }

   const renderItem =  ({ item }:{item:Notification}) => (
    <TouchableOpacity onPress={() => 
        router.push({pathname:'/(me)/reviewList',params:{userIdParam:item.user._id,notificationId:item._id}})
    }>
        <View style={[styles.item, !item.isRead && styles.itemUnread]}>
            {/* <View style={{flexDirection:'row'}}> */}
                <Image 
                source={
                        item.reviewer?.profileImage
                        ? { uri: item.reviewer?.profileImage }
                        : require('../../assets/images/default_profile.jpg')
                    }
                
                style={styles.avatar} />

                <View>
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{item.reviewer?.username}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                    </View>
                    <Text style={styles.time}>{getUserExperience(item.createdAt)}</Text>
                </View>
            {/* </View> */}
        </View>
    </TouchableOpacity>
  );


  return (
     <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
                />
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default updates

