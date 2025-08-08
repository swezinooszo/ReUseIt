import React,{useEffect,useState,} from 'react'
import {View,Text,TouchableOpacity,Image,FlatList} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { router,useLocalSearchParams } from 'expo-router';
import styles from '../styles/meStyles';
import api from '../utils/api';
import { MaterialIcons,Ionicons } from '@expo/vector-icons';
import { getUserExperience } from '../utils/meUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import ListingCard from '../components/ListingCard';
import ProfileCard from '../components/ProfileCard';

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
const sellerDetails = () => {
    const { sellerId,userId } = useLocalSearchParams();
    const [seller,setSeller] = useState<User>()
    const [listingCount,setListingCount] = useState(0);
    const [listings, setListings] = useState<Listing[]>([]);
    const [averageRating,setAverageRating] = useState(0);
    const [reviewCount,setReviewCount] = useState(0);


    // ******* get listings by UserId *********
    useEffect(()=>{
       // console.log(`useEffect getListingsByUserId ${user}`)
        if(!seller) return;
        const getListingsByUserId = async () =>{
              try {
                const response = await api.get(`/listings/user/${seller?._id}`);
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

        //get rating and review details
         const getUserRatingStats = async () =>{
             try {
                const response = await api.get(`/reviews/user/${seller?._id}/stats`)
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
    },[seller])

    // ******* get user profile (user Id get from token when user login) *********
    //detect when the screen comes into focus and then fetch the user profile and listings.
    useFocusEffect(
        useCallback(() => {
            const getUserProfileById = async () => {
            console.log('call getUserProfile')
            try {
                const response = await api.get(`/users/me/${sellerId}`);
                const user = response.data;
                setSeller(user);
                console.log('get user profile:', user);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
            };

            getUserProfileById();
        }, [])
    );

 // **** Review clicked for Details
   const onReviewClicked = async () => {
     console.log(`to pass proifleImage ${seller?.profileImage}`)
    router.push({pathname:'/(me)/reviewList',params:{userParam:encodeURIComponent(JSON.stringify(seller)),averageRatingParam:averageRating,reviewCountParam:reviewCount}})
   }

//     const renderItem = ({ item }:{item:Listing}) => (
//     <View style={styles.card}>
//       <TouchableOpacity onPress={() => {
//             router.push({pathname:'/(explore)/listingDetails',params:{listingId:item._id}})
//       }}>
//       <View>
//         <View style={{position:'relative'}}>
//         <Image source={ item.image[0] ? {uri: item.image[0]} : require('../../assets/images/default_image.png')} style={styles.imageCard} />
//         {
//             item.isReserved && !item.isSold &&
//             (
//                 <Text style={styles.reservedItem}>RESERVED</Text>
//             ) 
//         }
//         {
//             item.isSold &&
//             (
//                 <Text style={styles.soldItem}>SOLD</Text>
//             )
//         }
//         </View>
//         <View style={styles.textContainer}>
//           <View>
//             <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
//             <Text style={styles.price}>${item.price}</Text>
//             <Text style={styles.condition}>{item.condition}</Text>
//           </View>
//           <TouchableOpacity>
//             <MaterialIcons name="favorite-border" size={24} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>
//       </TouchableOpacity>
//     </View>
//    );

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.sellerdetailscontainer}>
                 <View style={styles.userListingContainer}>
                    <FlatList
                    data={listings}
                     ListHeaderComponent={
                          seller && (
                        <ProfileCard
                            user={seller}
                            listingCount={listingCount}
                            averageRating={averageRating}
                            reviewCount={reviewCount}
                            onReviewClicked = {onReviewClicked}
                        />
                        )
                        //    <View style={styles.cardContainer}>
                        //      <View style={styles.imageContainer}>
                        //         <Image style={styles.image} source={require('../../assets/images/default_profile.jpg')} />
                        //     </View>
                        //     <View style={styles.UserInfoContainer}>
                        //         <View style={styles.userTitleContainer}>
                        //             <Text style={styles.usernameTitle}>{seller?.username}</Text>
                        //          </View>
                        //         <View style={styles.profileTextMainContainer}>
                        //             <View style={styles.profileTextContainer}>
                        //                 <Text style={styles.reviewsTitle}>None yet</Text>
                        //                 <Text style={styles.reviewLabel}>Reviews</Text>
                        //             </View>
                        //              <View style={styles.profileTextContainer}>
                        //                 <Text style={styles.yearsTitle}>{seller?.createdAt ? `${getUserExperience(seller.createdAt)}` : ''}</Text>
                        //                 <Text style={styles.yearsLabel}>on ReUseIt</Text>
                        //             </View>
                                       
                        //         </View>
                        //     </View>

                        //     <View style={{padding:10}}>
                        //         <Text style={styles.listingCountTitle}>{listingCount != 0 ? `${listingCount} listings` : '0 listing'}</Text>
                        //     </View>
                        // </View>
                      
                     }
                    keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                   // renderItem={renderItem}
                     renderItem={({ item }) => (
                        <ListingCard
                        listing={item}
                        onPress={() =>
                            router.push({
                            pathname: '/(me)/editListingDetails',
                            params: { listingId: item._id },
                            })
                        }
                        onFavoritePress={() => console.log(`Favorited: ${item._id}`)}
                        isUserListing={item.sellerId === userId} // ← Check ownership
                        />
                    )}
                    contentContainerStyle={styles.flatListContainer}
                  />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


export default sellerDetails;