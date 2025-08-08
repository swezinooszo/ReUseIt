import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import styles from '../styles/reviewStyles'
import { Ionicons } from '@expo/vector-icons'

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

type Props = {
  review: Review;
};

const ReviewComponent = ({review}:Props) => {
  return (
       <View style={{padding:0}}>
            <View style={styles.reviewContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={
                            review?.reviewer.profileImage
                            ? { uri: review?.reviewer.profileImage }
                            : 
                            require('../../assets/images/default_profile.jpg')
                        }
                        style={styles.image}
                    />
                </View>
                <View >
                    <Text style={styles.reviewerTitle}>{review.reviewer.username}</Text>
                       <View style={styles.ratingContainer}>
                        {[...Array(review.rating)].map((_, index) => (
                            <Ionicons
                            key={index}
                            name="star"
                            size={20}
                            color="#f1c40f"
                            style={{ marginHorizontal: 2 }}
                            />
                        ))}
                    </View>
                </View>
            </View>
            <Text style={styles.commentTitle}>{review?.comment}</Text>
            <View style={{height:2,backgroundColor:'#DCDCDC',marginTop:20}}></View>
        </View>
  )
}

export default ReviewComponent
