import React, { useEffect, useState,useRef } from 'react';
import {View,Text,StyleSheet,FlatList,TextInput,Image,TouchableOpacity,
  KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { createSocket } from '../lib/socket';
import { Socket } from 'socket.io-client';
import CustomButton from '../components/CustomButton'
import CustomTextInput
 from '../components/CustomTextInput';
import styles from '../styles/chatStyles';
import axios from 'axios';
import { useLocalSearchParams } from "expo-router";
import api from '../utils/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { showConfirmationDialog } from '../utils/chatUtils';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  message: string;
  createdAt: string;
}
interface Listing {
  _id: string;
 isReserved: Boolean;
 isSold: Boolean;
}
interface Offer{
  _id: string;
  buyerId: string;
  listingId: Listing;
  offerPrice: string;
  status: string;
}
interface checkOffer {
  exists: Boolean,
  offer?: Offer
}
const chat = () => {

   const {listingId='',receiverId='',receiverName='',receiverEmail='',currentUserId='',token='',price=0,sellerId=''} = useLocalSearchParams();
   // console.log(`Chat screen listingId ${listingId} receiverId ${receiverId} currentUserId${currentUserId}  token${token}`)
    const [socket, setSocket] = useState<Socket | null>(null);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const [checkOffer,setCheckOffer] = useState<checkOffer>()
    const [offer,setOffer] = useState<checkOffer>()
    const [makeOfferButtonVisible,setMakeOfferButtoonVisible] = useState(false)
    const [acceptOfferButtonVisible,setAcceptOfferButtonVisible] = useState(false)
    const [reviewButtonVisible,setReviewButtoonVisible] = useState(false)
    const [reserveButtonVisible,setReserveButtoonVisible] = useState(false)
    const [soldButtonVisible,setSoldButtoonVisible] = useState(false)
    const [isReserved,setIsReserved] = useState<Boolean>(false)
    const [reserveTex,setReserveText] = useState('Reserve')
    const [reviewTex,setReviewText] = useState('Leave Review')

    const flatListRef = useRef<FlatList>(null);

   
    useEffect(()=>{
      if(!checkOffer) return
      
      if (currentUserId !== sellerId){
        console.log(` buyer offering currentUserId ${currentUserId}   sellerId${sellerId}`)
         // make offer if you want
            console.log(` buyer offering checkOffer?.exists ${checkOffer?.exists}`)
          if(!checkOffer?.exists ){
            setMakeOfferButtoonVisible(true);
          }
          else if(checkOffer?.exists && checkOffer?.offer?.status === "pending"){
            setMakeOfferButtoonVisible(false);
          }
           // leave review after offer is accept in case leave review ifthe seller don't sell item or good review if item is sold to you.
          else if(checkOffer?.exists && checkOffer?.offer?.status === "accepted"){
            setReviewButtoonVisible(true);
          }
      }
      
         console.log(` checkOffer isSold ${checkOffer?.offer?.listingId.isSold}`)
       // ** seller accepting offer
      if(currentUserId === sellerId){
         // ** if there is pending offer, accept offer
        if(checkOffer?.exists && checkOffer?.offer?.status === "pending"){
          setAcceptOfferButtonVisible(true);
        }
        // ** if offer is accepted, leave review, make reserver/unreserve or sold
        else if(checkOffer?.exists && checkOffer?.offer?.status === "accepted" && !checkOffer?.offer?.listingId.isSold){
          buttonVisibilityAfterAccept()
          
        }
        // ** if it is already sold, just leave review
        else if(checkOffer?.exists && checkOffer?.offer?.status === "accepted" && checkOffer?.offer?.listingId.isSold){
           buttonVisibilityAfterSold()
        }

        // play with reserve/unreserve text
         if (checkOffer?.offer?.listingId) {
          const isReserved = checkOffer.offer?.listingId.isReserved;
          console.log(` isReserved from checkOffer ${isReserved}`)
          setIsReserved(isReserved)
          setReserveText(isReserved ? 'Unreserve' : 'Reserve')
      }
      }
     
    
    },[checkOffer])

    const buttonVisibilityAfterAccept = () => {
          setAcceptOfferButtonVisible(false)
          setReviewButtoonVisible(true);
          setReserveButtoonVisible(true);
          setSoldButtoonVisible(true);
    }

    const buttonVisibilityAfterSold = () => {
          setReviewText('Item sold. Leave reivew.')
          setReviewButtoonVisible(true);
          setReserveButtoonVisible(false);
          setSoldButtoonVisible(false);
    }
    //***** Load past messages ********
    const loadMessages = async (chatId:string) => {
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

    // ************ chat initialised ************ //
    useEffect(() => {
    console.log(`chat screen launched token ${token}`);
    //It connects to your backend server at http://localhost:8000.
    // You use it to: - connect server -emit event : socket.emit('sendMessage', data)
    const newSocket = createSocket(token);//createSocket();
    setSocket(newSocket);

   // console.log(`chat screen newSocket ${newSocket}`);

    newSocket.on('connect', () => {
    // console.log('Socket connected');

      newSocket.emit('joinChat', {
        listingId: listingId,
        receiverId: receiverId
      });

      newSocket.on('chatJoined', ({ chatId }) => {
         //  console.log(`chatJoined ${chatId}`)
        setChatId(chatId);
        loadMessages(chatId);//// Load only when server confirms joined
      });

      newSocket.on('newMessage', (msg) => {
       // console.log(`new message ${msg}`)
        setMessages((prev) => [...prev, msg]);
      });
    });

    // ** check if existing offer.
    checkExistingOffer();

    return () => {
      newSocket.disconnect();
    };
  }, []);

   // ************* send chat *********** //
   const handleSend = () => {
    console.log("handleSend")
    if (!chatId || !input) return;
        console.log(`handleSend input ${input}`)
    socket!.emit('sendMessage', { chatId, message: input });
    setInput('');
  };

  const onClose = () =>{
    router.back();
  }

   // ** check if existing offer.
   const checkExistingOffer = async() => {
    const userId = sellerId !== currentUserId ? currentUserId : receiverId;//confirm it's buyerId when call api
      try{
       //console.log(`checkExistingOffer currentUserId ${currentUserId} listingId ${listingId}`)
        const res = await api.get(`/offers/check?buyerId=${userId}&listingId=${listingId}`)
        setCheckOffer(res.data)
        //console.log(`checkExistingOffer res ${res.data.exists}`)
      }catch (err) {
          console.log('Error loading messages:', err);
      }
    }

  // ** make offer
  const onMakeOffer = async () =>{
    try{
        const userId = sellerId !== currentUserId ? currentUserId : receiverId;
        const res = await api.post('/offers',{
          listingId:listingId,
          buyerId:userId,
          offerPrice:price,
        })
        if(res.status == 200){
          setMakeOfferButtoonVisible(false)
          // send make an offer chat
          if(socket){
            if (!chatId) return;
            socket!.emit('sendMessage', { chatId, message: `Make An Offer \n $${price}` });
          }else{
            console.log('message room is not ready..')
          }
        }else{
          console.log(`onMakeOffer not success res ${res.data}`)
        }
    }catch(error){
      console.log(`onMakeOffer error ${error}`)
    }
  }

  
  // ** accept offer
  const acceptOffer = async () =>{
     try{
        const res = await api.post(`/offers/accept/${checkOffer?.offer?._id}`)
        console.log()
        if(res.status == 200){
          buttonVisibilityAfterAccept()
          // send accepted offer chat
          if(socket){
            if (!chatId) return;
            socket!.emit('sendMessage', { chatId, message: `Accepted Offer \n $${price}` });
          }else{
            console.log('message room is not ready..')
          }
        }else{
          console.log(`onAcceptOffer not success res ${res.data}`)
        }
    }catch(error){
      console.log(`onAcceptOffer error ${error}`)
    }
  }

  const onAcceptOffer =  () =>{
    showConfirmationDialog(
    'Confirm Accept Offer',
    'Once you accept the offer, \n you will be able to leave a review for each other',
    () => {
       // ✅ OK pressed
       console.log('Offer sent');
       acceptOffer();
    },
    () => {
      // ❌ Cancel pressed
      console.log('Offer canceled');
    }
  );
  }

  // ** reserve listing
  const reserveListing = async () =>{
     try{
        const listingId = checkOffer?.offer?.listingId._id;
       console.log(`reserveListing  listingId ${listingId}`)
        const res = await api.put(`/offers/reserve/${listingId}`,{
          isReserved: !isReserved
        })
        if(res.status == 200){
          console.log(`isReserved respone ${res.data.listing.isReserved}`)
          const isReserved = res.data.listing.isReserved;
          const reserveText = isReserved ? 'Unreserve' :'Reserve'
          setIsReserved(isReserved)
          setReserveText(reserveText)
        }else{
          console.log(`reserveListing not success res ${res.data}`)
        }
    }catch(error){
      console.log(`reserveListing error ${error}`)
    }
  }

   const onReserveListing =  () =>{
    console.log(`onReserveListing isReserved ${isReserved}`)
    const title = isReserved ? 'Mark your item as unreserved' : 'Mark your item as reserved'
    const message = isReserved ? 'When unreserved, your item will be visible in the marketplace.' :
    'When reserved, this item will not be visible in the marketplace and you will not receive any offers.'
    showConfirmationDialog(
    title,
    message,
    () => {
       reserveListing();
    },
    () => {}
  );
  }


  // ** Sold Listing
  const soldListing = async () =>{
     try{
       const listingId = checkOffer?.offer?.listingId._id;
       console.log(`soldListing  listingId ${listingId}`)
        const res = await api.put(`/offers/sold/${listingId}`)
        console.log(`soldListing res ${res.data}`)
        if(res.status == 200){
          buttonVisibilityAfterSold()
        }else{
          console.log(`onAcceptOffer not success res ${res.data}`)
        }
    }catch(error){
      console.log(`onAcceptOffer error ${error}`)
    }
  }

  const onSoldListing =  () =>{
    showConfirmationDialog(
    'Mark listing as Sold?',
    'You can not undo this action. This item will not be visible in the marketplace and buyers can no longer make offers for this listing',
    () => {
       // ✅ OK pressed
       console.log('Offer sent');
       soldListing();
    },
    () => {
      // ❌ Cancel pressed
      console.log('Offer canceled');
    }
  );
  }

    return(
        <SafeAreaProvider>
           <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0} // adjust based on header height
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeAreacontainer}>
                  <View style={styles.chatHeaderContainer}>
                    <View  style={styles.subViewContainer}>
                      <Ionicons name="arrow-back-outline" size={24} color="black" onPress={onClose}/>
                    </View>
                    <View style={styles.chatTitleContainer}>
                      <Text style={styles.chatTitle} >
                          {receiverEmail}
                      </Text>
                    </View>
                    <View  style={styles.subViewContainer}>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',gap:10}}>
                  {
                    makeOfferButtonVisible && (
                      <TouchableOpacity style={styles.OutlineButton} onPress={onMakeOffer}>
                      <Text style={styles.OutlineText}>Make Offer</Text>
                      </TouchableOpacity>
                    )
                  }
                  {
                    acceptOfferButtonVisible && (
                      <TouchableOpacity style={styles.FilledButton} onPress={onAcceptOffer}>
                      <Text style={styles.FilledText}>Accept Offer</Text>
                      </TouchableOpacity>
                    )
                  }
                  {
                    reviewButtonVisible && (
                      <TouchableOpacity style={[styles.FilledReviewButton]} >
                      <Text style={styles.FilledText}>{reviewTex}</Text>
                      </TouchableOpacity>
                    )
                  }
                  {
                    reserveButtonVisible && (
                      <TouchableOpacity style={styles.FilledButton} onPress={onReserveListing}>
                      <Text style={styles.FilledText}>{reserveTex}</Text>
                      </TouchableOpacity>
                    )
                  }{
                    soldButtonVisible && (
                      <TouchableOpacity style={styles.FilledButton} onPress={onSoldListing}>
                        <Text style={styles.FilledText}>Mark as sold</Text>
                      </TouchableOpacity>
                    )
                  }
                  </View>
                  <View style={styles.chatContainer}>
                      <FlatList
                        ListHeaderComponent={
                          <View style={{alignItems:'center',marginTop:50,marginBottom:50}}>
                              <Image style={styles.image} source={require('../../assets/images/default_profile.jpg')} ></Image>
                              <Text style={styles.chatTitle} >
                                {receiverName}
                            </Text>
                          </View>
                        }
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                        const senderId = currentUserId
                        const isSender = item.senderId === senderId;
                        return (
                          <View>
                            <View
                              style={[
                                styles.messageContainer,
                                isSender ? styles.messageRight : styles.messageLeft
                              ]}
                            >
                              <Text style={[styles.messageText, isSender ? styles.senderText : styles.receiverText]}>
                                {item.message}
                              </Text>
                            </View>
                             <Text style={[styles.timestamp, isSender ? styles.timeStampRight : styles.timeStampLeft]}>
                                {new Date(item.createdAt).toLocaleTimeString()}
                              </Text>
                          </View>
                        );
                      }}
                      />
                  </View>
                  <View style={styles.messageBottomContainer}>
                    <TextInput
                        value={input} onChangeText={setInput}
                        style={styles.input}
                        placeholder="Type a message"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend} >
                      <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                  </View>

            </SafeAreaView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
    );
}


export default chat;