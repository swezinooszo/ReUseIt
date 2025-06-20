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
    useEffect(() =>{
      if(!userId) return
      console.log(` chatlist userId ${userId}`)
        api.get(`/chats/${userId}`)//683baea3c5b53f9905bd28fa
        .then(res=> {
            console.log(`chatlist data ${res.data}`)
            setChats(res.data)
        })
        .catch(error=> {console.log(`get chat error ${error}`)})

    },[userId])

    // renderChatItem
    const renderChatItem = ({ item }:  { item: Chat }) => {
    const otherUser = item.buyerId._id === userId ? item.sellerId : item.buyerId;
    const listing = item.listingId;
    return (
      <TouchableOpacity
        onPress={() => 
          {
            // add one more param sellerId to determin whether to show make offer button or not
            router.navigate({ pathname: '/(me)/chat',params:{listingId:listing._id,receiverId: otherUser._id,receiverName:otherUser.username,receiverEmail:otherUser.email,currentUserId: userId,token:token,price:item.listingId.price,sellerId:item.sellerId._id}});
          }
        }
        style={{
          flexDirection: 'row',
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#eee'
        }}
      >
        {/* <Image source={{ uri: otherUser.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} /> */}
        <View style={styles.subViewContainer}>
          <Text style={{fontSize:16}}>{otherUser.username}</Text>
           <Text style={{fontSize:16, fontWeight: 'bold',marginTop:8 }}>{item.listingId.title}</Text>
          <Text style={{ fontSize:14, color: '#888' ,marginTop:5}} numberOfLines={1} >{item.lastMessage}</Text>
          <Text style={{ color: '#aaa', fontSize: 12 }}>
            {new Date(item.updatedAt).toLocaleString()}
          </Text>
        </View>
          {/* <Image source={{ uri: listing.image }} style={{ width: 50, height: 50, borderRadius: 5 }} /> */}
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