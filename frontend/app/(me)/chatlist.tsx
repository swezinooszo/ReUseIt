import {View,Text,Image,FlatList,TouchableOpacity} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useEffect,useState} from "react"
import axios from "axios";
import {router} from "expo-router";
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import styles from "../styles/chatListStyles";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getTokenAndUserId } from "../utils/listingDetailsUtils";
interface User {
  _id: string;
  username: string;
  email: string;
  profileImage:string;
}

interface Listing {
  _id: string;
  title: string;
  price: string;
  condition: string;
  location: string;
}

interface Chat {
  _id: string;
  listingId: Listing;
  buyerId: User;
  sellerId: User;
  lastMessage: string;
  lastMessageReadBy: string[],
  updatedAt: string;
}

const chatlist = () => {

    const [chats, setChats] = useState<Chat[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [userId,setUserId] = useState('');

    // retrieve userID from token
    useEffect(() => {
      const loadToken = async () => {
        console.log("loadToken")
        const { token, userId }  = await getTokenAndUserId();
        if(token) setToken(token)
        if(userId) setUserId(userId)
      };
      loadToken();
  }, []);

    // retrive chat list based on userId
    useFocusEffect(
      useCallback(() => {
         let isActive = true;
        const getChats = async () => {
          try {
            if (!userId || !isActive) return;
            const res = await api.get(`/chats/${userId}`);
            if (isActive) {
              setChats(res.data);
            }
          } catch (error) {
            console.log('Error fetching chats:', error);
          }
        };

        getChats();
        return () => {
          isActive = false; // Cleanup
        };
      }, [userId])
  );


    // renderChatItem
    const renderChatItem = ({ item }:  { item: Chat }) => {
    const otherUser = item.buyerId._id === userId ? item.sellerId : item.buyerId;
    const otherUserIdentify = item.buyerId._id === userId ? 'seller' : 'buyer';
    const currentUserName = item.buyerId._id === userId ? item.buyerId.username : item.sellerId.username;
    const listing = item.listingId;
    const isUnread = !item.lastMessageReadBy?.includes(userId);
    return (
      <TouchableOpacity
        onPress={ async () => 
          {
            console.log(`chatlist receiverprofileImage ${otherUser.profileImage}`)
            router.navigate({ pathname: '/(me)/chat',params:{
              listingId:listing._id
              ,listingTitle:listing.title
              ,receiverId: otherUser._id
              ,receiverIdentify:otherUserIdentify
              ,receiverName:otherUser.username
              ,receiverEmail:otherUser.email
              ,receiverprofileImage:encodeURIComponent(otherUser.profileImage)
              ,currentUserId: userId
              ,currentUserName:currentUserName
              ,token:token
              ,price:item.listingId.price
              ,sellerId:item.sellerId._id
              // use this param for marking the message as read. need to pass chatIdParam because ChatId from useChatSocket is not already created yet. 
              //,chatIdParam:item._id,isUnread:isUnread.toString()
              //chat is to used in notification context to nagivate chat.tsx. It's required as param to main current chat flow instead of passing all parameter, 
              // passs chat object
              ,chat:JSON.stringify(item)}});
          }
        }
        style={{
          flexDirection: 'row',
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#eee'
        }}
      >
        <View style={styles.mainViewContainer}>
          <View style={styles.imageContainer}>
          <Image
              source={
                otherUser?.profileImage
                ? { uri: otherUser?.profileImage }
                : require('../../assets/images/default_profile.jpg')
              }
              style={styles.image}
            />
          </View>
          <View style={styles.subViewContainer}>
            <Text style={{fontSize:14,color:'#888',fontWeight:'bold'}}>{otherUser.username}</Text>
            <Text style={{fontSize:16, fontWeight: 'bold',marginTop:8 }}>{item.listingId.title}</Text>
            <Text style={{ fontSize: 14, marginTop: 5, fontWeight: isUnread ? 'bold' : 'normal', color: isUnread ? '#000' : '#888',}} numberOfLines={1}
              >
              {item.lastMessage}
            </Text>
          </View>
        </View>
       </TouchableOpacity>
    );
  };

    //close button
    const onClose = () =>{
      router.back();
    }
    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeAreacontainer}>
                <View style={styles.chatListHeaderContainer}>
                  <View  style={styles.subViewContainer}>
                    <AntDesign name="close" size={24} color="black" onPress={onClose}/>
                  </View>
                  <View  style={styles.chatListTitleContainer}>
                    <Text style={styles.chatListTitle} >
                        All Chats
                    </Text>
                  </View>
                  <View  style={styles.subViewContainer}>
                  </View>
                </View>
                <View style={styles.chatListContainer}>
                 <FlatList
                    data={chats}
                    keyExtractor={item => item._id}
                    renderItem={renderChatItem}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default chatlist;