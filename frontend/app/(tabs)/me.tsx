import React,{useEffect,useState} from 'react'
import {View,Text,TouchableOpacity,Image,FlatList} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import styles from '../styles/meStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import api from '../utils/api';
import { MaterialIcons } from '@expo/vector-icons';

interface User {
    _id:string;
    username:string;
    createdAt:string;
}
interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  isReserved:Boolean;
  isSold:Boolean;
}
const me = () => {
    const [user,setUser] = useState<User>()
    const [listingCount,setListingCount] = useState(0);
    const [listings, setListings] = useState<Listing[]>([]);
    const { logout } = useAuth();

    const onLogout = () => {
      logout();
    }

    const getUserExperience = (createdAt: string): string => {
        const createdDate = new Date(createdAt);
        const now = new Date();

        const diffInMs = now.getTime() - createdDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        const years = Math.floor(diffInDays / 365);
        const months = Math.floor((diffInDays % 365) / 30);
        const days = diffInDays % 30;

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''}`;
        } else if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''}`;
        } else {
            return `${days} day${days > 1 ? 's' : ''}`;
        }
    };

    useEffect(()=>{
        console.log(`useEffect getListingsByUserId ${user}`)
        if(!user) return;
        const getListingsByUserId = async () =>{
              try {
                const response = await api.get(`/listings/user/${user?._id}`);
                const res = response.data;
                const { count, listings } = response.data;
                console.log(`me listings ${res}`)
                setListings(listings)
                setListingCount(count);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                return null;
            }
        }
        getListingsByUserId();
    },[user])

    useEffect(()=>{
        const getUserProfile = async () => {
            try {
                const response = await api.get('/users/me');
                const user = response.data;
                setUser(user);
                console.log('me User profile:', user);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        }
        getUserProfile();
    },[])

    const renderItem = ({ item }:{item:Listing}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {
            router.push({pathname:'/(explore)/listingDetails',params:{listingId:item._id}})
      }}>
      <View>
        <View style={{position:'relative'}}>
        <Image source={ item.image[0] ? {uri: item.image[0]} : require('../../assets/images/default_image.png')} style={styles.imageCard} />
        {
            item.isReserved && !item.isSold &&
            (
                <Text style={styles.reservedItem}>RESERVED</Text>
            ) 
        }
        {
            item.isSold &&
            (
                <Text style={styles.soldItem}>SOLD</Text>
            )
        }
         {/* <Text style={styles.reservedItem}>RESERVED</Text> */}
        </View>
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.condition}>{item.condition}</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.descriptionRow}>
          <Text style={styles.description} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.condition}>{item.condition}</Text> */}
      </View>
      </TouchableOpacity>
    </View>
   );

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* <View style={styles.topViewContainer}>
                    <Image style={styles.image} source={require('../../assets/images/default_profile.jpg')} >

                    </Image>
                    <View style={styles.userTitleContainer}>
                        <Text style={styles.usernameTitle}>{user?.username}</Text>
                        <Text style={styles.yearsTitle}>{user?.createdAt ? `${getUserExperience(user.createdAt)} in ReUseIt` : ''}</Text>
                        <Text style={styles.reviewsTitle}>0 reviews</Text>
                    </View>
                </View> */}
                 <View style={styles.userListingContainer}>
                    <FlatList
                    data={listings}
                     ListHeaderComponent={
                        <View style={{flexDirection:'column'}}>
                            <View style={styles.topViewContainer}>
                                <Image style={styles.image} source={require('../../assets/images/default_profile.jpg')} >

                                </Image>
                                <View style={styles.userTitleContainer}>
                                    <Text style={styles.usernameTitle}>{user?.username}</Text>
                                    <Text style={styles.yearsTitle}>{user?.createdAt ? `${getUserExperience(user.createdAt)} in ReUseIt` : ''}</Text>
                                    <Text style={styles.reviewsTitle}>0 reviews</Text>
                                </View>
                            </View>
                            <View style={{padding:10}}>
                                <Text style={styles.listingCountTitle}>{listingCount != 0 ? `${listingCount} listings` : '0 listing'}</Text>
                            </View>
                        </View>
                     }
                    // keyExtractor={(item, index) => item._id || index.toString()}
                    keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                  />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


export default me;