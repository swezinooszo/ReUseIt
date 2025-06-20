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

// const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


interface User {
  _id: string;
  username: string;
  email: string;
}

interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  description: string;
  sellerId:User;
  dynamicFields?: { [key: string]: string }; // add this
  createdAt:string;
}

type MyJwtPayload = {
  id: string; // or userId: string;
};
const ListingDetails = () => {

    const { listingId } = useLocalSearchParams();
    const [listing, setListing] = useState<Listing | null>();
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('null');
    const [viewVisible, setViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      const loadToken = async () => {
        console.log("listingDetails Page")
        const storedToken = await AsyncStorage.getItem('userToken');
       // console.log(`storedToken ${storedToken}`)
        if (storedToken) {
          setToken(storedToken);
          try {
            const decoded = jwtDecode<MyJwtPayload>(storedToken);
           // console.log("Decoded JWT:", decoded.id);

            // Assuming your token payload includes "id" or "userId"
            setUserId(decoded.id);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
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
        .then(res => setListing(res.data))
        .catch(err => console.error(err));
    }, [listingId]);

    const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {listing?.image.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentImageIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    );
  };

  const onScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    setCurrentImageIndex(index);
  };


  const renderImage = ({ item} :{item:string}) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  const onClose = () =>{
    router.back();
  }

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
    
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={26} color="white" onPress={onClose}/>
          </TouchableOpacity>

        {/* Scrollable content */}
        <ScrollView style={styles.scrollViewContainer}>
            <FlatList
            data={listing?.image}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            style={styles.imageList}
            onScroll={onScroll}
            />
          {renderDots()}
          <View style={{padding:16}}>
          <Text style={styles.title}>{listing?.title}</Text>
          <Text style={styles.price}>${listing?.price}</Text>
          <Text style={styles.details}>Details</Text>
          <Text style={styles.label}>Condition</Text>
          <Text style={styles.text}>{listing?.condition}</Text>
          {listing?.dynamicFields && Object.entries(listing.dynamicFields).length > 0 && (
            <>
              {Object.entries(listing.dynamicFields).map(([key, value]) => (
                <View key={key}>
                  <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.text}>{value}</Text>
                </View>
              ))}
            </>
          )}
          {
            listing?.createdAt && (
              <>
              <Text style={styles.label}>Listed</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.text}>{getTimeSincePosted(listing?.createdAt)} by</Text>
                <Text style={styles.sellername}> {listing?.sellerId.username}</Text>
              </View>
              </>
            )
          }
            {listing?.description ? (
            <>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </>
          ) : (
            <View />
          )}
         
          </View>
        </ScrollView>

        {/* Fixed buttons */}
        {viewVisible && (
        <View style={styles.bottom} >
          <TouchableOpacity style={styles.makeOfferButton}>
              <Text style={styles.makeOfferText}>Make Offer</Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.ChatButton} onPress={() => {
            router.push({pathname:'/(me)/chat',params:{listingId:listingId,receiverId:listing?.sellerId._id,receiverName:listing?.sellerId.username,receiverEmail:listing?.sellerId.email,currentUserId: userId,token:token,price:listing?.price,sellerId:listing?.sellerId._id}})
            }}>
              <Text style={styles.ChatText}>Chat</Text>
          </TouchableOpacity>
          
          {/* <TouchableOpacity style={styles.buttonOutline}>
            <Text style={styles.buttonText}>Make Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFilled} onPress={() => {
            router.push({pathname:'/(me)/chat',params:{listingId:listingId,receiverId:listing?.sellerId._id,receiverName:listing?.sellerId.username,currentUserId: userId,token:token}})
            }}>
            <Text style={styles.buttonTextWhite}>Chat</Text>
          </TouchableOpacity> */}
        </View>
        )}
      </View>
    </View>
  );
};

export default ListingDetails;
