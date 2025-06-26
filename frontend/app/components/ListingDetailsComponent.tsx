// interface User {
//   _id: string;
//   username: string;
//   email: string;
// }

// interface Listing {
//   _id: string;
//   image: string[];
//   title: string;
//   price: number;
//   condition: string;
//   description: string;
//   address: string;
//   sellerId:User;
//   dynamicFields?: { [key: string]: string }; // add this
//   createdAt:string;
// }


// const ListingDetailsComponent = ({listing}:{listing:Listing}) =>{
//     return(
//         <>
//         </>
//     )
// }

import React,{useState} from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity,Image,Dimensions } from 'react-native';
import styles from '../styles/listingDetailsStyles';
import { getTimeSincePosted } from '../utils/listingDetailsUtils';
import { router } from 'expo-router';

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
  address: string;
  sellerId: User;
  dynamicFields?: { [key: string]: string };
  createdAt: string;
}

interface Props {
  listing: Listing;
}

const ListingDetailsComponent = ({listing,}:Props) => {
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

 //** View Seller details */
  const onSellerDetails = () => {
      router.push({pathname:'/(explore)/sellerDetails',params:{sellerId:listing?.sellerId._id}})
  }

  return (
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
      <View style={{ padding: 16 }}>
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

        {listing?.createdAt && (
          <>
            <Text style={styles.label}>Listed</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.text}>{getTimeSincePosted(listing?.createdAt)} by</Text>
              <TouchableOpacity onPress={onSellerDetails}>
                <Text style={styles.sellername}> {listing?.sellerId.username}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {listing?.description ? (
          <>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </>
        ) : (
          <View />
        )}

        <Text style={styles.label}>Address</Text>
        <Text style={styles.text}>{listing?.address}</Text>
      </View>
    </ScrollView>
  );
};

export default ListingDetailsComponent;
