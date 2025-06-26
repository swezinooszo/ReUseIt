import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StyleSheet,View,Text,Button,Image,ScrollView,ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import api from '../utils/api';
import { uploadAndSaveImage,compressImages } from '../utils/itemReviewFromUtils';
import styles from '../styles/itemReviewFormStyles';
import LottieView from 'lottie-react-native';

type MyJwtPayload = {
  id: string; // or userId: string;
};

interface Category{
  _id:string;
  name:string;
  parentId:string;
}

const itemReviewForm = () =>{

    const { images,form,mainCategory,subCategory } = useLocalSearchParams();
    const [parsedMainCategory, setParsedMainCategory] = useState<Category | null>(null);
    const [parsedSubCategory, setParsedSubCategory] = useState<Category | null>(null);
    const [userId,setUserId] = useState('');
    const [loading, setLoading] = useState(false);


    // retrieve userId for listing submitting
    useEffect(() => {
      const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          try {
            const decoded = jwtDecode<MyJwtPayload>(storedToken);

            setUserId(decoded.id);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      };
      loadToken();
    }, []);

    // parse main category and sub category from json string
    useEffect(() => {
        if (mainCategory && subCategory) {
        try {
            const main = JSON.parse(mainCategory as string) as Category;
            const sub = JSON.parse(subCategory as string) as Category;

            setParsedMainCategory(main);
            setParsedSubCategory(sub);
        } catch (error) {
            console.error('Failed to parse category params:', error);
        }
        }
    }, [mainCategory, subCategory]);

    // close button
    const onClose = () =>{
        router.back()
    }

    const uploadImagesToFirebase = async (imageUris:string[]) => {
        const uploadPromises = imageUris.map(uri => uploadAndSaveImage(uri));
        return await Promise.all(uploadPromises); // array of URLs
    }

    // submit to server
    const onSubmit = async()  =>{
        try{
            setLoading(true); // Show loading

            // 1. Get form data 
            const parsedForm = typeof form === 'string' ? JSON.parse(form) : {};

            // 2. Extract known fields to submit as separate fields
            let { title, condition, price, description, address, longitude, latitude, ...rest } = parsedForm
            // Convert price to integer
            price = price ? parseInt(price, 10) : 0; // default to 0 if empty

            // 3. Get Images URIs
            const imageUris: string[] = typeof images === 'string' ? JSON.parse(images) : images;
            console.log('imageUris parse json');

            // 4. Compress images
            const compressedUris = await compressImages(imageUris);
            console.log('compress image done ');
             // 5. Upload compressed images to firebase storage and wait for all URLs
            const uploadedImageUrls = await uploadImagesToFirebase(compressedUris);
            console.log(`upload images to firebase done description ${description}`);

            const res = await api.post('/listings',{
                title: title,
                condition: condition,
                price: price,
                description: description,
                categoryId: parsedMainCategory?._id,
                subCategoryIds: parsedSubCategory ? [parsedSubCategory._id] : [],// currently, each listing only has one sub category even though the field format is array. later may have 2 or more
                dynamicFields: rest,
                sellerId: userId,
                image: uploadedImageUrls, //uploaded URLs here
                // location: {
                //     type: 'Point',
                //     coordinates: [-122.4194, 37.7749], // lon, lat
                // },
                address:address,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude], // lon, lat
                },
            })
            console.log('Listing submitted successfully:', res.data);
            router.push({pathname: '/(addlisting)/listingResult',params: { images: images,title:title,price:price}})
        }catch(error){
            console.log(`submitting server error ${error}`)
        }finally {
            setLoading(false); // Hide loading
        }
    }

    return(
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AntDesign name="close" size={24} color="black" onPress={onClose}/> 
        <Text style={styles.title}>List your item</Text>
    
        <ScrollView style={{flex:1}}>
            {/* <View> */}
            <ScrollView style={styles.imagesContainer} horizontal>
                {typeof images === 'string' && JSON.parse(images).map((uri: string, idx: number) => (
                    <Image key={idx} source={{ uri }} style={styles.image}  />
                ))}
            </ScrollView>
            {/* </View> */}
            <Text style={[styles.labelBold,{marginTop:30}]}>Category</Text>
            <Text style={styles.label}>{`${parsedMainCategory?.name} >>> ${parsedSubCategory?.name}`}</Text>
            
            <Text style={[styles.labelBold,{marginTop:30}]}>Item details</Text>
            {typeof form === 'string' && 
                Object.entries(JSON.parse(form))
                .filter(([key]) => key !== 'longitude' && key !== 'latitude') // ❌ exclude these
                .map(([key, val]) => (
                <View key={key} style={styles.viewContainer}>
                <Text style={styles.labelWithSmallPadding}>
                     • {key === 'price' ? `$${val}` : String(val)}
                </Text>
                </View>
            ))}

        </ScrollView>
            <CustomButton backgroundColor='#5FCC7D' text="Submit" height={50} fontWeight='bold' onPress={onSubmit} borderRadius={5} ></CustomButton>
      </SafeAreaView>

       {/* loading indicator */}
        {loading && (
        <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
             <LottieView
                source={require('../../assets/animation/marketplace.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
            />
            <Text style={styles.loadingText}>We're posting your listing onto the market place</Text>
            </View>
        </View>
        )}


      </SafeAreaProvider>
    )
}

// const styles = StyleSheet.create({

// })
export default itemReviewForm;