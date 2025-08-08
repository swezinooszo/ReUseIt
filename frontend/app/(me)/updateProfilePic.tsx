import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StyleSheet, Text, View,Image, } from 'react-native'
import React, { useEffect,useState } from 'react'
import { router,useLocalSearchParams } from 'expo-router';
import CustomButton from '../components/CustomButton';
import { uploadAndSaveImage,compressImages,uploadImageToFirebase } from '../utils/itemReviewFromUtils';
import api from '../utils/api';
import LottieView from 'lottie-react-native';
import { AntDesign, Ionicons } from "@expo/vector-icons";

const updateProfilePic = () => {

  const { userId='',profileImage='' } = useLocalSearchParams();
  const imageUris: string = typeof profileImage === 'string' ? profileImage : profileImage?.[0];
   const [loading, setLoading] = useState(false);

  const changeProfilePic = async () =>{
    try{
         setLoading(true);
        const uris = [imageUris]
       // 1. Compress images
        const compressedUris = await compressImages(uris);
        console.log('compress image done ');
        // 2. Upload compressed images to firebase storage and wait for all URLs
        const uploadedImageUrls = await uploadImagesToFirebase(compressedUris[0]);
        console.log(`upload images to firebase done description ${uploadedImageUrls}`);
        const result = await updateProfilePicOnServer(uploadedImageUrls);
        router.push({pathname:'/(tabs)/me'})
    }catch(error){
         console.log(`changeProfilePic server error ${error}`)
    }finally{
         setLoading(false);
    }
  }

const uploadImagesToFirebase = async (imageUris:string) => {
    const uploadPromises =  uploadAndSaveImage(imageUris);
    return await (uploadPromises); // array of URLs
}

const updateProfilePicOnServer = async (firebaseUrl: string) => {
  try {
    const response = await api.put('/users/profile-image', {
      userId, // you should have the current user's ID
      profileImageUrl: firebaseUrl,
    });

    console.log('Profile image updated:', response.data);
  } catch (err) {
    console.error('Failed to update profile image:', err);
  }
};

    const onClose = () =>{
        router.back()
    }
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
         <View >
            <AntDesign name="close" size={24} color="black" onPress={onClose}/>       
        </View>
        <View style={styles.contextContainer}>
            {
                <Image  source={{uri:imageUris} } style={styles.image}  />
            }
        </View>
        <CustomButton text="Change Profile Picture" fontWeight="bold" height={50} backgroundColor='#5FCC7D' onPress={changeProfilePic} borderRadius={5} ></CustomButton>
    </SafeAreaView>
       {loading && (
        <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
             <LottieView
                source={require('../../assets/animation/Loading_dot.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
            />
            <Text style={styles.loadingText}>Loading...</Text>
            </View>
        </View>
        )}

    </SafeAreaProvider>
    
  )
}


export default updateProfilePic

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:'white'
    },
    contextContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        padding:20,
    },
    image: {
        width: '100%',
        height: 400,
        resizeMode: 'cover', // or 'contain' if you want the whole image to fit without cropping
    },
    loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', // subtle dim background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
   loadingImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
    loadingAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
    },
})