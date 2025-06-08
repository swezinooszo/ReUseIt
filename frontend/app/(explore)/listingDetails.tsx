import React,{useEffect,useState} from 'react';
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

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;



interface Listing {
  _id: string;
  images: string[];
  title: string;
  price: number;
  condition: string;
  description: string;
  sellerId:string;
}

type MyJwtPayload = {
  id: string; // or userId: string;
};
const ListingDetails = () => {

    const { listingId } = useLocalSearchParams();
    const [listing, setListing] = useState<Listing | null>();
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('null');

    useEffect(() => {
      const loadToken = async () => {
        console.log("loadToken")
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log(`storedToken ${storedToken}`)
        if (storedToken) {
          setToken(storedToken);
          try {
            const decoded = jwtDecode<MyJwtPayload>(storedToken);
            console.log("Decoded JWT:", decoded.id);

            // Assuming your token payload includes "id" or "userId"
            setUserId(decoded.id);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      };
      loadToken();
    }, []);


    useEffect(() => {
        api.get(`/listings/${listingId}`)
        .then(res => setListing(res.data))
        .catch(err => console.error(err));
    }, [listingId]);

  const renderImage = ({ item} :{item:string}) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
    
        {/* Scrollable content */}
        <ScrollView style={styles.content}>
            <FlatList
            data={listing?.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            style={styles.imageList}
            />

          <Text style={styles.title}>{listing?.title}</Text>
          <Text style={styles.price}>${listing?.price}</Text>
           <Text style={styles.details}>Details</Text>
          <Text style={styles.condition}>Condition: {listing?.condition}</Text>
          <Text style={styles.description}>{listing?.description}</Text>
        </ScrollView>

        {/* Fixed buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.buttonOutline}>
            <Text style={styles.buttonText}>Make Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFilled} onPress={() => {
            console.log(` listing Id ${listingId} sellerId ${listing?.sellerId} curretnUserId ${userId} token ${token} `)
            router.push({pathname:'/(me)/chat',params:{listingId:listingId,receiverId:listing?.sellerId,currentUserId: userId,token:token}})
          }}>
            <Text style={styles.buttonTextWhite}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  imageList: {
    height: screenHeight * 0.4,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.4,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    flex: 1,
    marginBottom: 70, // space for footer
  },
   title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    marginBottom: 8,
  },
   details: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  condition: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  buttonOutline: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonFilled: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontWeight: '600',
  },
  buttonTextWhite: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ListingDetails;
