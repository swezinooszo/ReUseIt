import React,{useEffect,useId,useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import styles from '../styles/listingDetailsStyles';
import { Ionicons } from '@expo/vector-icons';
import { getTimeSincePosted } from '../utils/listingDetailsUtils';
import { MaterialIcons } from '@expo/vector-icons';
import ListingDetailsComponent from '../components/ListingDetailsComponent';
import { getTokenAndUserId } from '../utils/listingDetailsUtils'; 

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage:string;
}

interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  description: string;
  address: string;
  sellerId:User;
  dynamicFields?: { [key: string]: string }; // add this
  createdAt:string;
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
const ListingDetails = () => {

    const { listingId } = useLocalSearchParams();
    const [listing, setListing] = useState<Listing | null>();
    const [chat, setChat] = useState<Listing | null>();
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('null');
    const [user,setUser] = useState<User | null>();
    const [viewVisible, setViewVisible] = useState(false);
    // const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      const loadToken = async () => {
          const { token, userId, user } = await getTokenAndUserId();
          if(token) setToken(token);
          if(userId) setUserId(userId)
          if(user) setUser(user)
      };
      loadToken();
    }, []);

    //control bottom view hidden or not
    useEffect(() =>{
      if(!listing || !userId){
        return;
      }
      console.log(`setViewHidden`);
      if(listing?.sellerId._id !== userId){
        setViewVisible(true);
      }
    },[listing,userId])

    //retrieve listing details based on id
    useEffect(() => {
        api.get(`/listings/${listingId}`)
        .then(
          res => {
            setListing(res.data.listing)
            setChat(res.data.chat)
          }//res => setListing(res.data)
        )
        .catch(err => console.error(err));
    }, [listingId]);

  const onClose = () =>{
    router.back();
  }

  // const onSellerDetails = () => {
  //   router.push({pathname:'/(explore)/sellerDetails',params:{sellerId:listing?.sellerId._id}})
  // }

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
    
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={26} color="white" onPress={onClose}/>
          </TouchableOpacity>

        {/* Scrollable content */}
         { listing && (
            <ListingDetailsComponent listing={listing} userId={userId}></ListingDetailsComponent>
        )
        }

        {/* Fixed buttons */}
        {viewVisible && (
        <View style={styles.bottom} >
            <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={35} color="black" />
            </TouchableOpacity>

           <TouchableOpacity style={styles.ChatButton} onPress={() => {
            console.log(`Listing Details receiverId ${listing?.sellerId._id} sellername=> ${listing?.sellerId.username} username=> ${user?.username}`)
            router.push({pathname:'/(me)/chat',params:{
              listingId:listingId,
              listingTitle:listing?.title
              ,receiverId:listing?.sellerId._id
              ,receiverIdentify:'seller'
              ,receiverName:listing?.sellerId.username
              ,receiverEmail:listing?.sellerId.email
              ,receiverprofileImage:encodeURIComponent(listing?.sellerId.profileImage || '')
              ,currentUserId: userId
              ,currentUserName:listing?.sellerId._id === userId? listing.sellerId.username : user?.username
              ,token:token,price:listing?.price,sellerId:listing?.sellerId._id
              ,chat:JSON.stringify(chat)}})
            }}>
              <Text style={styles.ChatText}>Chat</Text>
          </TouchableOpacity>
        </View>
        )}
      </View>
    </View>
  );
};

export default ListingDetails;
