import {View,Text,StyleSheet,FlatList,TouchableOpacity} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useEffect,useState} from "react"
import axios from "axios";
import {router} from "expo-router";
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

interface User {
  _id: string;
  firstname: string;
  lastname: string;
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


    useEffect(() =>{
        api.get(`/chats/${userId}`)//683baea3c5b53f9905bd28fa
        .then(res=> {
            console.log(`chatlist data ${res.data}`)
            setChats(res.data)
        })
        .catch(error=>console.log(error))

    },[userId])

    const renderChatItem = ({ item }:  { item: Chat }) => {
    const otherUser = item.buyerId._id === userId ? item.sellerId : item.buyerId;
    const listing = item.listingId;
    return (
      <TouchableOpacity
        onPress={() => 
          {
            router.navigate({ pathname: '/(me)/chat',params:{listingId:listing._id,receiverId: otherUser._id,currentUserId: userId,token:token}});
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
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text >{otherUser.firstname}</Text>
           <Text style={{ fontWeight: 'bold' }}>{item.listingId.title}</Text>
          <Text numberOfLines={1} style={{ color: '#888' }}>{item.lastMessage}</Text>
          <Text style={{ color: '#aaa', fontSize: 12 }}>
            {new Date(item.updatedAt).toLocaleString()}
          </Text>
        </View>
          {/* <Image source={{ uri: listing.image }} style={{ width: 50, height: 50, borderRadius: 5 }} /> */}
       </TouchableOpacity>
    );
  };

    return(
        <SafeAreaProvider>
            <SafeAreaView>
                <Text >
                    Chatlist
                </Text>
                 <FlatList
                    data={chats}
                    keyExtractor={item => item._id}
                    renderItem={renderChatItem}
                    />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    input: {
        
    }
})
export default chatlist;