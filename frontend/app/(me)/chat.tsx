import React, { useEffect, useState,useRef } from 'react';
import {View,Text,StyleSheet,FlatList,TextInput,Button} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { createSocket } from '../lib/socket';
import { Socket } from 'socket.io-client';
import CustomButton from '../components/CustomButton'
import CustomTextInput
 from '../components/CustomTextInput';

import axios from 'axios';
import { Platform } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import api from '../utils/api';

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  message: string;
  createdAt: string;
}


const chat = () => {

   const {listingId='',receiverId='',currentUserId='',token} = useLocalSearchParams();
    console.log(`Chat screen listingId ${listingId} receiverId ${receiverId} currentUserId${currentUserId}  token${token}`)
    const [socket, setSocket] = useState<Socket | null>(null);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const flatListRef = useRef<FlatList>(null);

    // Load past messages
    const loadMessages = async (chatId:string) => {
      // try {
      //   const LOCAL_IP = '192.168.0.10';
      //   const URL = Platform.OS === 'android' ? `http://${LOCAL_IP}:8000/api/messages/${chatId}` : `http://localhost:8000/api/messages/${chatId}`;
      //   const res = await axios.get(URL);
      //   setMessages(res.data);
      // } catch (err) {
      //   console.error('Error loading messages:', err);
      // }

        try {
          const res = await api.get(`/messages/${chatId}`)
          setMessages(res.data)
          console.log(`message res ${res.data}`)
        } catch (err) {
          console.error('Error loading messages:', err);
        }
    };

    // auto scroll flatlist to see last message
    useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

    useEffect(() => {
          console.log('chat screen launched');
    //It connects to your backend server at http://localhost:8000.
    // You use it to: - connect server -emit event : socket.emit('sendMessage', data)
    const newSocket = createSocket(token);//createSocket();
    setSocket(newSocket);

    console.log(`chat screen newSocket ${newSocket}`);

    newSocket.on('connect', () => {
      console.log('Socket connected');

      newSocket.emit('joinChat', {
        listingId: listingId,//'683baf0b0950d3663e46cac1',//listing._id,
        receiverId: receiverId//'683baea3c5b53f9905bd28fa'//Platform.OS === 'android' ? "683baa594ff5279bf1aaebc2" : '683baea3c5b53f9905bd28fa',//listing.sellerId //683baea3c5b53f9905bd28fa
      });

      newSocket.on('chatJoined', ({ chatId }) => {
           console.log(`chatJoined ${chatId}`)
        setChatId(chatId);
        loadMessages(chatId);//// Load only when server confirms joined
      });

      newSocket.on('newMessage', (msg) => {
        console.log(`new message ${msg}`)
        setMessages((prev) => [...prev, msg]);
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);


   const handleSend = () => {
    console.log("handleSend")
    if (!chatId || !input) return;
        console.log(`handleSend input ${input}`)
    socket!.emit('sendMessage', { chatId, message: input });
    setInput('');
  };

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text >
                    Chat scren
                </Text>

                    <View style={{ flex: 3, padding: 20,backgroundColor:'pink' }}>

                      <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item._id}
                        // renderItem={({ item }) => (
                        //   <View style={{ marginVertical: 8 }}>
                        //     <Text style={{ fontWeight: 'bold' }}>From: {item.senderId}</Text>
                        //     <Text>{item.message}</Text>
                        //     <Text style={{ fontSize: 12, color: 'gray' }}>
                        //       {new Date(item.createdAt).toLocaleString()}
                        //     </Text>
                        //   </View>
                        // )}

                        renderItem={({ item }) => {
                        const senderId = currentUserId//'683cb15c8b12b03652f094d3'//683cb15c8b12b03652f094d3 //Platform.OS === 'android' ? "683baea3c5b53f9905bd28fa" :"683baa594ff5279bf1aaebc2"
                        const isSender = item.senderId === senderId;//683baa594ff5279bf1aaebc2

                        return (
                          <View
                            style={[
                              styles.messageContainer,
                              isSender ? styles.messageRight : styles.messageLeft
                            ]}
                          >
                            <Text style={[styles.messageText, isSender ? styles.senderText : styles.receiverText]}>
                              {item.message}
                            </Text>
                            <Text style={styles.timestamp}>
                              {new Date(item.createdAt).toLocaleTimeString()}
                            </Text>
                          </View>
                        );
                      }}

                      />

                </View>
                 <View style={{ flex: 1, padding: 20,backgroundColor:'pink' }}>
                                 <CustomTextInput value={input} onChangeText={setInput} placeholder=''/>
                            <CustomButton onPress={handleSend} text="Send" fontWeight="bold"/>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding:20,
        flexDirection: 'column',
    },
    messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },

    messageLeft: {
      alignSelf: 'flex-start',
      backgroundColor: '#e5e5ea',
      borderTopLeftRadius: 0,
    },

    messageRight: {
      alignSelf: 'flex-end',
      backgroundColor: '#007aff',
      borderTopRightRadius: 0,
    },

    messageText: {
      color: '#000',
      fontSize: 16,
    },

    senderText: {
      color: '#fff',
    },

    receiverText: {
      color: '#000',
    },

    timestamp: {
      fontSize: 10,
      color: 'gray',
      marginTop: 4,
      alignSelf: 'flex-end',
    },

})
export default chat;