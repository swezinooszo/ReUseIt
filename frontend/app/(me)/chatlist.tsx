import {View,Text,StyleSheet,FlatList,TouchableOpacity} from "react-native"
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

interface User {
  _id: string;
  username: string;
  email: string;
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

type MyJwtPayload = {
  id: string; // or userId: string;
};
const chatlist = () => {

    const [chats, setChats] = useState<Chat[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [userId,setUserId] = useState('');
    // const api = axios.create({
    //     baseURL: 'http://localhost:8000/api',
    // });

    // retrieve userID from token
    useEffect(() => {
      const loadToken = async () => {
        console.log("loadToken")
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log(`storedToken ${storedToken}`)
        if (storedToken) {
          setToken(storedToken);
           try {
                const decoded = jwtDecode<MyJwtPayload>(storedToken);
                setUserId(decoded.id);
                console.log("Decoded userId ", decoded.id);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
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
    const listing = item.listingId;
    const isUnread = !item.lastMessageReadBy?.includes(userId);
    return (
      <TouchableOpacity
        onPress={ async () => 
          {
            router.navigate({ pathname: '/(me)/chat',params:{listingId:listing._id,receiverId: otherUser._id,receiverName:otherUser.username,receiverEmail:otherUser.email,currentUserId: userId,token:token,price:item.listingId.price,sellerId:item.sellerId._id,chatIdParam:item._id,isUnread:isUnread.toString()}});
          }
        }
        style={{
          flexDirection: 'row',
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#eee'
        }}
      >
        <View style={styles.subViewContainer}>
          <Text style={{fontSize:14,color:'#888',fontWeight:'bold'}}>{otherUser.username}</Text>
           <Text style={{fontSize:18, fontWeight: 'bold',marginTop:8 }}>{item.listingId.title}</Text>
          <Text style={{ fontSize: 14, marginTop: 5, fontWeight: isUnread ? 'bold' : 'normal', color: isUnread ? '#000' : '#888',}} numberOfLines={1}
            >
            {item.lastMessage}
          </Text>
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