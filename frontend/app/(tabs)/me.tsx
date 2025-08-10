import React,{useEffect,useState} from 'react'
import {View,Text,TouchableOpacity,Image,FlatList,Modal} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import styles from '../styles/meStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import api from '../utils/api';
import { getUserExperience } from '../utils/meUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import ListingCard from '../components/ListingCard';
import { showAlertDialog } from '../utils/chatUtils';
import { getUser } from '../utils/meUtils';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { showConfirmationDialog } from '../utils/chatUtils';
import { takePhoto, pickImages } from '../utils/imageHelper';
import ProfileImagePickerModal from '../components/ProfileImagePickerModal';
import ProfileCard from '../components/ProfileCard';
// import MeTopBar from '../components/meTopBar';
import MeTopBar from '../components/MeTopBar';

interface User {
    _id:string;
    username:string;
    createdAt:string;
    expoPushTokens:[string];
    profileImage:string;
}
interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  isReserved:boolean;
  isSold:boolean;
  sellerId:string;
}
const me = () => {
    const [user,setUser] = useState<User>()
    const [listingCount,setListingCount] = useState(0);
    const [listings, setListings] = useState<Listing[]>([]);
    const { logout } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);
    const [userFavorites, setUserFavorites] = useState<string[]>([]);
    const [userId, setUserId] = useState<string>(''); 
    const [averageRating,setAverageRating] = useState(0);
    const [reviewCount,setReviewCount] = useState(0);

    useEffect(()=>{
        console.log('me useEffect')
    })
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


        const getUserRatingStats = async () =>{
             try {
                const response = await api.get(`/reviews/user/${user?._id}/stats`)
                const {averageRating,reviewCount} = response.data
                setAverageRating(averageRating);
                setReviewCount(reviewCount);
                console.log(` user rating response averageRating ${averageRating} reviewCount ${reviewCount}`)
            } catch (error) {
            console.error('Failed to fetch user profile:', error);
            return null;
            }
        }
        getUserRatingStats()
    },[user])

    // ******* get user profile (user Id get from token when user login) *********
    //detect when the screen comes into focus and then fetch the user profile and listings.
    useFocusEffect(
        useCallback(() => {
            const getUserProfile = async () => {
            console.log('call getUserProfile')

              try {
                  const user = await getUser();
                  console.log('getUserProfile 1', user);
                  setUser(user);
                  setUserFavorites(user.favorites || []);
                  setUserId(user._id);
                } catch (error: any) {
                  const errMsg = error?.response?.data?.message || 'Something went wrong.';
                  showAlertDialog( errMsg,() => { },);
                } 
            }

            getUserProfile();
        }, [])
    );

    /// *** logout
     const onLogout = () => {
        showConfirmationDialog(
            'Confirm log out',
            'Are you sure you want to log out?',
            () => {
                logout();
            },
            () => {
            }
          )
    }

    //// ***** Change Profile Pic from gallery and camera
    const onProfilePicChange = () =>{
        setModalVisible(true)
    }
    const handleTakePhoto = async () => {
        const uri = await takePhoto();
        if (!uri || !user?._id) {
            console.warn('Missing photo or user ID');
            return;
        }
        setModalVisible(false)
        router.push({
            pathname: '/(me)/updateProfilePic',
            params: {
            userId: user._id,
            profileImage: uri, // ✅ already a string
            },
        });
        //router.push({pathname:'/(me)/updateProfilePic',params: {userId:user?._id, profileImage: uri}})
   }
   const handlePickImages = async () => {
        console.log(`handlePickImages`)
         try {
            const uris = await pickImages(false); // allow only one image

            if (!uris || uris.length === 0) {
            console.log('No image selected');
            return;
            }

            const uri = uris[0];

            if (!uri || !user?._id) {
            console.warn('Missing image URI or user ID');
            return;
            }
            setModalVisible(false)
            router.push({
            pathname: '/(me)/updateProfilePic',
            params: {
                userId: user._id,
                profileImage: uri, // ✅ passing a string, so JSON.stringify NOT needed
            },
            });
        } catch (error) {
            console.error('Image picking failed:', error);
        }        
   }

   // **** Review clicked for Details
   const onReviewClicked = async () => {
     console.log(`to pass proifleImage ${user?.profileImage}`)
    router.push({pathname:'/(me)/reviewList',params:{userParam:encodeURIComponent(JSON.stringify(user)),averageRatingParam:averageRating,reviewCountParam:reviewCount}})
   }

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <MeTopBar onLogout={onLogout}  />
                 <View style={styles.userListingContainer}>
                    <FlatList
                    data={listings}
                     ListHeaderComponent={
                        user && (
                        <ProfileCard
                            user={user}
                            listingCount={listingCount}
                            averageRating={averageRating}
                            reviewCount={reviewCount}
                            onProfilePicChange={onProfilePicChange}
                            onReviewClicked = {onReviewClicked}
                        />
                        )
                        // <View style={styles.cardContainer}>
                        //         <TouchableOpacity style={styles.imageContainer} onPress={onProfilePicChange}>
                        //             <Image
                        //                 source={
                        //                     user?.profileImage
                        //                     ? { uri: user?.profileImage }
                        //                     : require('../../assets/images/default_profile.jpg')
                        //                 }
                        //                 style={styles.image}
                        //                 />
                        //         </TouchableOpacity>
                        //         <View style={styles.UserInfoContainer}>
                        //             <View style={styles.userTitleContainer}>
                        //                 <Text style={styles.usernameTitle}>{user?.username}</Text>
                        //             </View>
                        //             <View style={styles.profileTextMainContainer}>
                        //                 <View style={styles.profileTextContainer}>
                        //                     {averageRating === 0 ? 
                        //                     <Text style={styles.reviewsTitle}>None yet</Text> : 
                        //                     <View style={styles.ratingView}>
                        //                         <Text style={styles.reviewsTitle}>{averageRating}.0</Text>
                        //                          <Ionicons
                        //                                 name={ 'star'}
                        //                                 size={24}
                        //                                 color="#f1c40f"
                        //                                 style={{ marginHorizontal: 4 }}
                        //                                 onPress={()=>{}}
                        //                                 />
                        //                     </View>
                        //                     }
                        //                     {
                        //                         reviewCount === 0 ? 
                        //                         <Text style={styles.reviewLabel}>0 review</Text> :
                        //                         <Text style={styles.reviewLabel}>{reviewCount} reviews</Text> 

                        //                     }
                                            
                        //                 </View>
                        //                 <View style={styles.profileTextContainer}>
                        //                     <Text style={styles.yearsTitle}>{user?.createdAt ? `${getUserExperience(user.createdAt)}` : ''}</Text>
                        //                     <Text style={styles.yearsLabel}>on ReUseIt</Text>
                        //                 </View>
                                        
                        //             </View>
                        //         </View>
                        //     <View style={{padding:10}}>
                        //         <Text style={styles.listingCountTitle}>{listingCount != 0 ? `${listingCount} listings` : '0 listing'}</Text>
                        //     </View>
                        // </View>
                     }
                    // keyExtractor={(item, index) => item._id || index.toString()}
                    keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    //renderItem={renderItem}
                     renderItem={({ item }) => (
                        <ListingCard
                        listing={item}
                        onPress={() =>
                            router.push({
                            pathname: '/(me)/editListingDetails',
                            params: { listingId: item._id,userId:userId },
                            })
                        }
                        onFavoritePress={() => console.log(`Favorited: ${item._id}`)}
                        isUserListing={item.sellerId === userId} // ← Check ownership
                        />
                    )}
                    contentContainerStyle={styles.flatListContainer}
                  />
                </View>
                <ProfileImagePickerModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onPickImage={handlePickImages}
                    onTakePhoto={handleTakePhoto}
                />

            </SafeAreaView>
        </SafeAreaProvider>
    );
}


export default me;

