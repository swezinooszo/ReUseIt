import { View, Text,StyleSheet,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}


const CustomListItem = ({listing}:{listing:Listing}) => {//({_id,image,price,title,condition}:Listing) => {
   const handlePress = () => {
      router.push({pathname:'/(explore)/listingDetails',params:{listingId:listing._id}})
  };

  return (
    // <View style={styles.card}>
    //   <Image  source={ listing.image[0] ? {uri: listing.image[0]} : require('../../assets/images/default_image.png')}style={styles.image}></Image>
    //   <View style ={styles.rightContainer} >
    //      <Text style={styles.title}>{listing.title}</Text>
    //     <Text style={styles.label}>{listing.price}</Text>
    //     <Text style={styles.label}>{listing.condition}</Text>
    //   </View>
     
    // </View>
     <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.card}>
          {/* source={{ uri: item.image[0] }} */}
          <Image  style={styles.image} source={ listing.image[0] ? {uri: listing.image[0]} : require('../../assets/images/default_image.png')} />
          <View style={styles.textContainer}>
            <View style={{padding:10}}>
              <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
              <Text style={styles.price}>${listing.price}</Text>
              <Text style={styles.condition}>{listing.condition}</Text>
            </View>
            <TouchableOpacity>
              <MaterialIcons name="favorite-border" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
  )
}

// type Listing = {
//   // _id: string;
//   image: string[];
//   title: string;
//   price?: number;
//   condition?: string;
// }

// const CustomListItem = ({image,title,price,condition}:Listing) => {
//   return (
//     <View style={styles.card}>
//       <Image  source={ image[0] ? {uri: image[0]} : require('../../assets/images/default_image.png')}style={styles.image}></Image>
//       <View style ={styles.rightContainer} >
//          <Text style={styles.title}>{title}</Text>
//         <Text style={styles.label}>{price}</Text>
//         <Text style={styles.label}>{condition}</Text>
//       </View>
     
//     </View>
//   )
// }


const styles = StyleSheet.create({
  card: {
    backgroundColor:'white',
    position:'absolute',
    width: 180,
    bottom:100,
    //padding:10,
    // right: 10,
    // left:10,
    borderRadius:8,
    alignSelf:'center'
  },
   image: {
      width: 180,
      height: 200,
      borderRadius: 8
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 5,
    },
    title: {
      fontSize: 14,
      flex: 1,
      fontWeight: 'bold',
      marginRight: 4,
    },
    price: {
      fontWeight: 'bold',
      fontSize: 14,
      marginTop: 4,
    },
    condition: {
      fontSize: 14,
      color: '#777',
    },
  //     card: {
  //   backgroundColor:'white',
  //   position:'absolute',
  //   bottom:100,
  //   padding:10,
  //   right: 10,
  //   left:10,
  //   flexDirection:'row',
  //   borderRadius:20,
  //   overflow:'hidden'
  // },
  // image:{
  //   width:150,
  //   aspectRatio:1
  // },
  // title:{
  //   fontWeight:'bold',
  //   marginBottom:10,
  //   fontSize:16
  // },
  //  label:{
  //   fontWeight:'bold',
  //   marginBottom:10,
  //   color:'gray',
  //    fontSize:16
  // },
  // rightContainer:{
  //   padding: 10
  // }
})
export default CustomListItem