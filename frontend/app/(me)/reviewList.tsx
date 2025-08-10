import { StyleSheet, Text, View, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import styles from '../styles/reviewStyles'
import { Ionicons } from '@expo/vector-icons';
import { router,useLocalSearchParams } from 'expo-router'
import api from '../utils/api';
import ProfileCard from '../components/ProfileCard';
import { FlatList } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { handleApiError } from '../utils/chatUtils';
import ReviewComponent from '../components/reviewComponent';
import { useNotification } from '@/context/NotificationContext';
import { markNotificationAsRead } from '../utils/notificationUtils';

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

interface Review {
    _id:string;
    reviewer:User;
    listingId:Listing;
    rating:number;
    comment:number;
}

const reviewList = () => {
     //come from me, pass needed params cus me page already have those values
    const { userParam,averageRatingParam='0',reviewCountParam='0' } = useLocalSearchParams();
    //come from chat, only pass userIdParam
    const { userIdParam } = useLocalSearchParams();
    // to update notification as read when it come from review push notification or update page
    const {notificationId} = useLocalSearchParams()
    const [user,setUser] = useState<User>();
    const [reviews,setReviews] = useState<Review[]>([]);
    const [averageRating,setAverageRating] = useState(0);
    const [reviewCount,setReviewCount] = useState(0);
     const [selectedFilter, setSelectedFilter] = useState<'all' | 'fromBuyer' | 'fromSeller'>('all');
    // const parsedRating = Number(averageRating);
    // const parsedReviewCount = Number(reviewCount);

    const { unreadCount,loadUnreadNotification } = useNotification();

    const onClose = () =>{
        router.back()
    }

    /// update notificationa as read when it come from review push notification or update page and reload unread notification for badgage count in updats tab 
    const markNotificationRead = async (notificationId: string) =>{
      const result = await markNotificationAsRead(notificationId);
      if(result){
         // and load Unread Notification to refresh badage count in notification tab
        loadUnreadNotification() ;
      }
    }

    useEffect(()=> {
      if(!notificationId) return

      //mark notification as read
      markNotificationRead(notificationId as string);
    },[notificationId])

    // parameters get from Me page
    useEffect(() => {
            // if it's come from me page, averageRatingParam & reviewCountParam is passed
        if (!averageRatingParam || !reviewCountParam)return;
        const parsedRating = Number(averageRatingParam);
        setAverageRating(parsedRating)
        const parsedReviewCount = Number(reviewCountParam);
        setReviewCount(parsedReviewCount);

    }, [averageRatingParam,reviewCountParam]);

    useEffect(() => {
        if (!user?._id) return;
        const getReviews = async () => {
            try {
            const response = await api.get(`/reviews/user/${user._id}`);
            setReviews(response.data);
            } catch (error) {
            console.error('Failed to fetch reviews:', error);
            handleApiError(error, 'fetch reviews failed');
            }
        }
        getReviews();
    }, [user]);

    useEffect(()=>{
        if(!userParam) return;
        const parsedUser = JSON.parse(userParam as string) as User;; // decoded automatically
        setUser(parsedUser)
        console.log(`parsedUser proifleImage ${parsedUser.profileImage}`)

        //   const getReviews = async () =>{
        //      try {
        //         const response = await api.get(`/reviews/user/${user?._id}`)
        //         const reviews = response.data
        //         setReviews(reviews);
        //         //console.log(` user reviews response  ${reviews[0].reviewer.username}`)
        //     } catch (error) {
        //     console.error('Failed to fetch reviews:', error);
        //      handleApiError(error, 'fetch reviews failed');
        //     //return null;
        //     }
        // }
        // getReviews()
    },[userParam])

    // parameters get from Chat page, only userIdParam is passed.
    useEffect(()=>{
        if(!userIdParam) return;
        // if it's come from Chat page, averageRatingParam & reviewCountParam is not passed, so retrieve it from api
        //get rating and review details
         const getUserRatingStats = async () =>{
             try {
                const response = await api.get(`/reviews/user/${userIdParam}/stats`)
                const {averageRating,reviewCount} = response.data
                console.log(`averageRating ${averageRating} reviewCount ${reviewCount}`)
                setAverageRating(averageRating);
                setReviewCount(reviewCount);
                console.log(` user rating response averageRating ${averageRating} reviewCount ${reviewCount}`)
            } catch (error) {
            console.error('Failed to fetch user profile:', error);
            return null;
            }
        }
        getUserRatingStats()

        // and retreive user review details
         const getReviews = async () => {
            try {
            const response = await api.get(`/reviews/user/${userIdParam}`);
            setReviews(response.data);
            } catch (error) {
            console.error('Failed to fetch reviews:', error);
            handleApiError(error, 'fetch reviews failed');
            }
        }
        getReviews();

        // and retreive user profile by userIdParam
        const getUserProfileById = async () => {
            console.log('call getUserProfile')
            try {
                const response = await api.get(`/users/me/${userIdParam}`);
                const user = response.data;
                setUser(user);
                console.log('get user profile:', user);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
            };

        getUserProfileById();

    },[userIdParam])

    // Derived filtered lists
    const fromBuyerReviews = reviews.filter(
        (review) => review.listingId.sellerId === user?._id
    );

    const fromSellerReviews = reviews.filter(
        (review) => review.listingId.sellerId !== user?._id
    );

    const filteredReviews =
        selectedFilter === 'all'
        ? reviews
        : selectedFilter === 'fromBuyer'
        ? fromBuyerReviews
        : fromSellerReviews;

    //   const renderItem = ({ item }:{item:Review}) => (
    //     <View style={{padding:0}}>
    //         <View style={styles.reviewContainer}>
    //             <View style={styles.imageContainer}>
    //                 <Image
    //                     source={
    //                         item?.reviewer.profileImage
    //                         ? { uri: item?.reviewer.profileImage }
    //                         : 
    //                         require('../../assets/images/default_profile.jpg')
    //                     }
    //                     style={styles.image}
    //                 />
    //             </View>
    //             <View >
    //                 <Text style={styles.reviewerTitle}>{item.reviewer.username}</Text>
    //                    <View style={styles.ratingContainer}>
    //                     {[...Array(item.rating)].map((_, index) => (
    //                         <Ionicons
    //                         key={index}
    //                         name="star"
    //                         size={20}
    //                         color="#f1c40f"
    //                         style={{ marginHorizontal: 2 }}
    //                         />
    //                     ))}
    //                 </View>
    //             </View>
    //         </View>
    //         <Text style={styles.commentTitle}>{item?.comment}</Text>
    //         <View style={{height:2,backgroundColor:'#DCDCDC',marginTop:20}}></View>
    //     </View>
    //   )
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeAreacontainer}>
                <Ionicons name="close" size={30} color="black" onPress={onClose}/>
                {
                    user && (
                        <ProfileCard
                            user={user}
                            averageRating={averageRating}
                            reviewCount={reviewCount}
                            isListingCountDisable = {true}
                        />
                    )
                }
            <View style={{ padding: 10 ,alignItems:'center'}}>
                <Text style={styles.reviewListTitle}>
                    Reviews
                </Text>                
            </View>

            {/* Filter Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
            <Text
              style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilter]}
              onPress={() => setSelectedFilter('all')}
            >
              All
            </Text>
            <Text
              style={[styles.filterButton, selectedFilter === 'fromBuyer' && styles.activeFilter]}
              onPress={() => setSelectedFilter('fromBuyer')}
            >
              From Buyer
            </Text>
            <Text
              style={[styles.filterButton, selectedFilter === 'fromSeller' && styles.activeFilter]}
              onPress={() => setSelectedFilter('fromSeller')}
            >
              From Seller
            </Text>
          </View>

          {filteredReviews && (
            <FlatList
              data={filteredReviews}
              renderItem={({ item }) => (
                <ReviewComponent 
                review={item}
                />
                )}
              keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
            />
          )}

            {/* {
                reviews &&(
                <FlatList
                    data={reviews}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
                >

                </FlatList>
                )
            } */}



            </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
  )
}

export default reviewList

