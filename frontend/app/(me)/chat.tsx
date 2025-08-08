import React, { useEffect, useState,useRef } from 'react';
import {AppState, AppStateStatus,View,Text,StyleSheet,FlatList,TextInput,Image,TouchableOpacity,
  KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback,Linking
} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import styles from '../styles/chatStyles';
import axios from 'axios';
import { useLocalSearchParams } from "expo-router";
import api from '../utils/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { checkIfReviewExists, showAlertDialog, showConfirmationDialog } from '../utils/chatUtils';
import { useChatSocket } from './useChatSocket';
import { soldListing } from '../utils/chatUtils';
import { markAsRead } from '../utils/chatUtils';
import { isNotificationEnabled } from '@/app/utils/checkNotificationPermission';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  message: string;
  createdAt: string;
}
interface Listing {
  _id: string;
 acceptedOfferIds:string[];
 isReserved: boolean;
 isSold: boolean;
}
interface Offer{
  _id: string;
  buyerId: string;
  listingId: Listing;
  offerPrice: string;
  status: string;
}
interface checkOffer {
  exists: boolean,
  offer?: Offer
}
const chat = () => {
    const {listingId='',receiverId='',receiverIdentify='',receiverName='',receiverEmail='',receiverprofileImage='',currentUserId='',token='',price=0,sellerId='',chat} = useLocalSearchParams() as Record<string, string>;
    // to show unread message as bold
   // const {chatIdParam='',isUnread=''} = useLocalSearchParams();
    //listingTitle and currentUserName is for notification to show send name and listing title
    // to recepeint
    const {listingTitle='',currentUserName=''} = useLocalSearchParams();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const [checkOffer,setCheckOffer] = useState<checkOffer>()
    const [offer,setOffer] = useState<checkOffer>()
    const [makeOfferButtonVisible,setMakeOfferButtoonVisible] = useState(false)
    const [acceptOfferButtonVisible,setAcceptOfferButtonVisible] = useState(false)
    const [reviewButtonVisible,setReviewButtoonVisible] = useState(false)
    const [reserveButtonVisible,setReserveButtoonVisible] = useState(false)
    const [soldButtonVisible,setSoldButtoonVisible] = useState(false)
    const [isReserved,setIsReserved] = useState<boolean>(false)
    const [reserveTex,setReserveText] = useState('Reserve')
    const [reviewTex,setReviewText] = useState('Leave Review')
    const [isDisabledButton,setDisabledButton] = useState<boolean>(false)
    // flat list scroll to the end with animation
    const flatListRef = useRef<FlatList>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [layoutHeight, setLayoutHeight] = useState(0);

    // Chat Socket for initiating, sending and receiving message
    const { socket, chatId } = useChatSocket(token,listingId,receiverId,currentUserId,(msg) => setMessages(prev => [...prev, msg]) // ✅ correct callback
    );

    // check notification permission
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    // appState to check when the app comes back to the foreground
    const appState = useRef(AppState.currentState);

    // check notification permission
    const checkPermission = async () => {
      console.log(`checkPermission `)
      const enabled = await isNotificationEnabled();
      console.log(`checkPermission enabled ${enabled}`)
      setIsEnabled(enabled);
    };


    // ********** add 'make offer' , 'accept offer', 'review' , 'reserve/unreserve' and 'sold' buttons
    // ********** based on user role (buyer and seller)
    useEffect(()=>{
      if(!checkOffer) return
        // ** buer making offer
      if (currentUserId !== sellerId){//current user is buyer
         // console.log(` buyer offering currentUserId ${currentUserId}   sellerId${sellerId}`)
         // console.log(` buyer offering checkOffer?.exists ${checkOffer?.exists}`)
          /// if there is no offer, make 'offer button' visible.
          if(!checkOffer?.exists ){
            setMakeOfferButtoonVisible(true);
          }
          // if there is offer with 'pending' status, already made an offer. so make 'offer button' invisible.
          else if(checkOffer?.exists && checkOffer?.offer?.status === "pending"){
            setMakeOfferButtoonVisible(false);
          }
          // if the offer is already existing with 'accepted' status, and 'buyerId' of offer is same as 'currentUserId' (means buyer), show 'leaveReview' button
          else if(checkOffer?.exists && checkOffer?.offer?.status === "accepted"  && checkOffer?.offer.buyerId === currentUserId 
            && checkOffer?.offer.listingId.isSold){//add this one line more
            setReviewButtoonVisible(true);
          }
      }
      
        //console.log(` checkOffer isSold ${checkOffer?.offer?.listingId.isSold}`)
        //console.log(` checkOffer checkOffer?.exists ${checkOffer?.exists} checkOffer?.offer?.status ${checkOffer?.offer?.status} checkOffer?.offer.buyerId ${checkOffer?.offer?.buyerId} receiverId ${receiverId}`)
       // ** seller accepting offer
      if(currentUserId === sellerId){//current user is seller, **receiverId** is buyer
         // if there is pending offer, make 'accept offer' button visible
        if(checkOffer?.exists && checkOffer?.offer?.status === "pending" ){
            setAcceptOfferButtonVisible(true);
        }
        // disabled the acceptoffer button if the offer is already accepted offer from other buyer (seller can accept only one offer)
        // if there is an offer with 'accepted' status (mean offer is accepted) and accepted buyerId is not same as receiverId (in this case,
        // buyer Id if seller log into the app )
        else if(checkOffer?.exists && checkOffer?.offer?.status === "accepted" && checkOffer?.offer?.buyerId !== receiverId){
          // if(checkOffer?.offer?.listingId.acceptedOfferIds.length !== 0){
              setAcceptOfferButtonVisible(true);
              setDisabledButton(true);
         // }
        }
        // ** if offer is accepted, leave review, make reserver/unreserve or sold
        // else if(checkOffer?.exists && checkOffer?.offer?.status === "accepted" && !checkOffer?.offer?.listingId.isSold && checkOffer?.offer.buyerId === receiverId){
        //   buttonVisibilityAfterAccept()
          
        // }
        // ** if it is already sold, just leave review
        else if(checkOffer?.exists && checkOffer?.offer?.status === "accepted" && checkOffer?.offer?.listingId.isSold && checkOffer?.offer.buyerId === receiverId){
           buttonVisibilityAfterSold()
        }

        // play with reserve/unreserve text
         if (checkOffer?.offer?.listingId) {
          const isReserved = checkOffer.offer?.listingId.isReserved;
          //console.log(` isReserved from checkOffer ${isReserved}`)
          setIsReserved(isReserved)
          setReserveText(isReserved ? 'Unreserve' : 'Reserve')
      }
      }
     
    
    },[checkOffer])

    const buttonVisibilityAfterAccept = () => {
          setAcceptOfferButtonVisible(false)
          setReviewButtoonVisible(true);
          //setReserveButtoonVisible(true);
         // setSoldButtoonVisible(true);
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
          console.log(`message res data ${res.data} chatId ${chatId}`)
        } catch (err) {
          console.error('Error loading messages:', err);
        }
    };


    const onMarkAsRead = async (chatId:string,currentUserId:string) =>{
       const success = await markAsRead(chatId,currentUserId);
       if (!success) {
        console.log('Failed to mark messages as read');
      }
    }

    useEffect (() => {
      if(!chatId) return;
      loadMessages(chatId);

      //if we open the conversation, mark the message as read.
      //console.log(`chat id received chatId ${chatId}. currentUserId ${currentUserId}`);
      onMarkAsRead(chatId,currentUserId);
  
    },[chatId])

    // ************ chat initialised ************ //
    useEffect(() => {
   
    // ** check if existing offer.
    checkExistingOffer();

    // **check notification permission
    checkPermission();

    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      console.log(`subscription ${subscription}`)
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          console.log(` App came back to foreground ${subscription}`)
        // App came back to foreground
        await checkPermission();
      }
      appState.current = nextAppState;
    });

     return () => {
      subscription.remove();
    };
     // console.log(`Chat markAsRead useEffect isUnread ${isUnread}  chatIdParam ${chatIdParam}  currentUserId ${currentUserId} `)
     // ** to update new message as read. we need chatIdParam here because ChatId from useChatSocket is not already created yet.
    //  if(isUnread === 'true' && chatIdParam && currentUserId){
    //    markAsRead();
    //  }
  }, []);

     // ** check if existing offer.
   const checkExistingOffer = async() => {
    const userId = sellerId !== currentUserId ? currentUserId : receiverId;//confirm it's buyerId when call api
   // console.log(`buyerId ${userId}  listingId${listingId}`)
      try{
       //console.log(`checkExistingOffer currentUserId ${currentUserId} listingId ${listingId}`)
        const res = await api.get(`/offers/check?buyerId=${userId}&listingId=${listingId}`)
        setCheckOffer(res.data)
        //console.log(`checkExistingOffer res ${res.data.exists}`)
      }catch (err) {
          console.log('Error loading messages:', err);
      }
    }

    // ************* mark as read *********** //
  //   const markAsRead = async () => {
  //   try {
  //     //console.log(`Chat markAsRead method: chatId ${chatIdParam} currentUserId ${currentUserId}`)
  //     // await api.put(`/chats/read/${chatIdParam}`, { userId: currentUserId });
  //     await api.put(`/chats/read/${chatId}`, { userId: currentUserId });
  //   } catch (error) {
  //     console.log("Failed to mark chat as read", error);
  //   }
  // };

  const sendMessage = (chatId:string,message:string) =>{
    socket!.emit('sendMessage', { chatId, message: message
      // add below params are to show as notification info
      ,receiverId,listingTitle,currentUserName
      //added extra param for notification to show as noti info and page trigger (when notification tap, come this page again).
      ,token,chat
     });
  }
   // ************* send chat *********** //
   const handleSend = () => {
   // console.log("handleSend")
  //   console.log(`handleSend input ${input} socket${socket} chatId ${chatId}`)
    if (!chatId || !input) return;
       // console.log(`handleSend input ${input} socket${socket}`)

    // *** send Message
    // socket!.emit('sendMessage', { chatId, message: input
    //   // add below params are to show as notification info
    //   ,receiverId,listingTitle,currentUserName
    //   //added extra param for notification to show as noti info and page trigger (when notification tap, come this page again).
    //   ,token,chat
    //  });
    sendMessage(chatId,input);
    setInput('');
  };

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
            // socket!.emit('sendMessage', { chatId, message: `Make An Offer \n $${price}`
            // });
            sendMessage(chatId,`Make An Offer \n $${price}`);
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
        if(res.status == 200){
          buttonVisibilityAfterAccept()
          // send accepted offer chat
          if(socket){
            if (!chatId) return;
            // *** send Message
            // socket!.emit('sendMessage', { chatId, message: `Accepted Offer \n $${price}` 
            //  // add below params are to show as notification info
            // ,receiverId,listingTitle,currentUserName
            // //added extra param for notification to show as noti info and page trigger (when notification tap, come this page again).
            // ,token,chat
            // });
            sendMessage(chatId,`Accepted Offer \n $${price}`)
          }else{
            console.log('message room is not ready..')
          }
          //after accept offer, seller is required to reserve the listing for some time
          router.push({pathname:'/(me)/reservationTiming',params:{listingId:checkOffer?.offer?.listingId._id,buyerId:checkOffer?.offer?.buyerId}});
        }else{
          console.log(`onAcceptOffer not success res ${res.data}`)
        }
    }catch(error){
      console.log(`onAcceptOffer error ${error}`)
    }
  }

  const onAcceptOffer =  () =>{
     console.log(`onAcceptOffer isEnabled ${isEnabled}`)
    // if(!isEnabled){
    //   showAlertDialog("Notification is disabled",()=>{
    //     console.log('click ok')
    //   })
    // }

    showConfirmationDialog(
    'Confirm Accept Offer',
    'Once you accept the offer, \n you will not be able to accept other offers.',
    () => {
       // ✅ OK pressed
       console.log('Offer sent');
       acceptOffer();
        //after accept offer, seller is required to reserve the listing for some time
       // router.push({pathname:'/(me)/reservationTiming',params:{listingId:checkOffer?.offer?.listingId._id}});
    },
    () => {
      // ❌ Cancel pressed
      console.log('Offer canceled');
    }
    );
  }


  // ** reserve listing
  const reserveListing = async () =>{
    console.log(`reserveListing isReserved=${isReserved}`);
     try{
        const listingId = checkOffer?.offer?.listingId._id;
        const buyerId = checkOffer?.offer?.buyerId;
        // const res = await api.put(`/offers/reserve/${listingId}`,{
        //   isReserved: !isReserved
        // })
        const res = await api.put(`/offers/reserve`,{
          isReserved: !isReserved,
          listingId: listingId,
          buyerId : buyerId
        });

  
        if(res.status == 200){
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
  // const soldListing = async (listingId:string) =>{
  //    try{
  //      console.log(`soldListing  listingId ${listingId}`)
  //       const res = await api.put(`/offers/sold/${listingId}`)
  //       console.log(`soldListing res ${res.data}`)
  //       if(res.status == 200){
  //         console.log(`soldListing success res ${res.data}`)
  //       }else{
  //         console.log(`soldListing not success res ${res.data}`)
  //       }
  //   }catch(error){
  //     console.log(`soldListing error ${error}`)
  //   }
  // }

  const onSoldListing =  () =>{
    showConfirmationDialog(
    'Mark listing as Sold?',
    'You can not undo this action. This item will not be visible in the marketplace and buyers can no longer make offers for this listing',
    async () => {
       //soldListing(checkOffer?.offer?.listingId._id as string);
        const success = await soldListing(checkOffer?.offer?.listingId._id as string);
        if (success) {
          console.log('Listing marked as sold successfully');
        } else {
          console.log('Failed to mark listing as sold');
        }

    },
    () => {
      console.log('Offer canceled');
    }
  );
  }

  /// ** Reivew
  const onReview = async () => {
    console.log(`onReview listingId ${listingId}`)
    const exists = await checkIfReviewExists(listingId,receiverId)
    console.log(`onReview result exist ${exists}`)
    if(exists){
       router.push({pathname:'/(me)/reviewList',params:{userIdParam:receiverId}})
    }else{
      router.push({pathname:'/(me)/review',params:{listingId:checkOffer?.offer?.listingId._id,
        revieweeId:receiverId,revieweeIdentify:receiverIdentify,revieweeName:receiverName,revieweeprofileImage:encodeURIComponent(receiverprofileImage)}})
    }
  }

  const onClose = () =>{
    router.back();
  }

  const onSellerDetails = () => {
      router.push({pathname:'/(explore)/sellerDetails',params:{sellerId:sellerId}})
  }

    // useFocusEffect(
    //   useCallback(() => {
    //     console.log(`useFocusEffect ${isEnabled}`)
    //   }, [])
    // );

  const openSettings = async () => {
    await Linking.openSettings();
  };

  if(!isEnabled){
     return (
     <SafeAreaProvider>
       <SafeAreaView style={[styles.SettingMainContainer]}>
          {/* <CustomText name='Please enable notification to get realtime Chat and Listing status updates' flex={0}></CustomText>
          <CustomButton text="Open Setting
          " onPress={openSettings}></CustomButton> */}
          <View style={styles.chatHeaderContainer}>
              <View  style={styles.subViewContainer}>
                  <Ionicons name="arrow-back-outline" size={24} color="white" onPress={onClose}/>
              </View>
              <View style={styles.chatTitleContainer}>
               </View>
              <View  style={styles.subViewContainer}>
              </View>
          </View>
          <View style={styles.SettingContainer}>
            <Text style={styles.SettingLabel}>
                Please enable notification to get realtime Chat and Listing status updates
            </Text>
            
            <TouchableOpacity style={styles.SettingButton} onPress={openSettings}>
              <Text style={styles.SettingText}>Go to Settings</Text>
            </TouchableOpacity>
          </View>
       </SafeAreaView>
     </SafeAreaProvider>
     )
  }
    return(
        <SafeAreaProvider>
           <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            //keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // adjust based on header height
          >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
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
                      <TouchableOpacity style={!isDisabledButton ? styles.FilledButton : styles.DisabledButton} onPress={onAcceptOffer} disabled={isDisabledButton}>
                      <Text style={!isDisabledButton ? styles.FilledText : styles.DisabledText}>Accept Offer</Text>
                      </TouchableOpacity>
                    )
                  }
                  {
                    reviewButtonVisible && (
                      <TouchableOpacity style={[styles.FilledReviewButton]} onPress={onReview}>
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
                          <TouchableOpacity style={styles.userIcon} onPress={onSellerDetails}>
                              <Image 
                              style={styles.image} 
                              source={
                                receiverprofileImage ? {uri: receiverprofileImage}
                                : require('../../assets/images/default_profile.jpg')
                                } ></Image>
                              <Text style={styles.chatTitle} >
                                {receiverName}
                            </Text>
                          </TouchableOpacity>
                        }
                        ref={flatListRef}
                        onContentSizeChange={(w, h) => {
                          setContentHeight(h);
                          setTimeout(() => {
                            const desiredOffset = Math.max(0, h - layoutHeight);
                            flatListRef.current?.scrollToOffset({ offset: desiredOffset, animated: true });
                          }, 500); // Delay ensures layout is complete
                        }}
                        // onContentSizeChange={() => { 
                        //   flatListRef.current?.scrollToEnd({ animated: true });
                        // }}
                        data={messages}
                        //keyExtractor={(item) => item._id}
                        keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
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
            {/* </TouchableWithoutFeedback> */}
          </KeyboardAvoidingView>
        </SafeAreaProvider>
    );
}


export default chat;