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
import { getUserExperience } from '../utils/meUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

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

    // ******* get listings by UserId *********
    useEffect(()=>{
       // console.log(`useEffect getListingsByUserId ${user}`)
        if(!user) return;
        const getListingsByUserId = async () =>{
              try {
                const response = await api.get(`/listings/user/${user?._id}`);
                const res = response.data;
                const { count, listings } = response.data;
                //console.log(`me listings ${res}`)
                setListings(listings)
                setListingCount(count);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                return null;
            }
        }
        getListingsByUserId();
    },[user])

    // ******* get user profile (user Id get from token when user login) *********
    //detect when the screen comes into focus and then fetch the user profile and listings.
    useFocusEffect(
        useCallback(() => {
            const getUserProfile = async () => {
            console.log('call getUserProfile')
            try {
                const response = await api.get('/users/me');
                const user = response.data;
                setUser(user);
                console.log('Refreshed user profile:', user);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
            };

            getUserProfile();
        }, [])
    );
    // useEffect(()=>{
    //     const getUserProfile = async () => {
    //         try {
    //             const response = await api.get('/users/me');
    //             const user = response.data;
    //             setUser(user);
    //             console.log('me User profile:', user);
    //         } catch (error) {
    //             console.error('Failed to fetch user profile:', error);
    //         }
    //     }
    //     getUserProfile();
    // },[])

    const renderItem = ({ item }:{item:Listing}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {
            router.push({pathname:'/(me)/editListingDetails',params:{listingId:item._id}})
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
          <View style={{flex:1,}}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.condition}>{item.condition}</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      </TouchableOpacity>
    </View>
   );

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                 <View style={styles.userListingContainer}>
                    <FlatList
                    data={listings}
                     ListHeaderComponent={
                        <View style={styles.cardContainer}>
                             <View style={styles.imageContainer}>
                                <Image style={styles.image} source={require('../../assets/images/default_profile.jpg')} />
                            </View>
                            <View style={styles.UserInfoContainer}>
                                <View style={styles.userTitleContainer}>
                                    <Text style={styles.usernameTitle}>{user?.username}</Text>
                                 </View>
                                <View style={styles.profileTextMainContainer}>
                                    <View style={styles.profileTextContainer}>
                                        <Text style={styles.reviewsTitle}>None yet</Text>
                                        <Text style={styles.reviewLabel}>Reviews</Text>
                                    </View>
                                     <View style={styles.profileTextContainer}>
                                        <Text style={styles.yearsTitle}>{user?.createdAt ? `${getUserExperience(user.createdAt)}` : ''}</Text>
                                        <Text style={styles.yearsLabel}>on ReUseIt</Text>
                                    </View>
                                       
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