import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StyleSheet,View,Text,Button,Image,ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import api from '../utils/api';
import { uploadAndSaveImage,compressImages } from '../utils/itemReviewFromUtils';

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
                subCategoryIds: parsedSubCategory ? [parsedSubCategory._id] : [],
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
            router.push('/(addlisting)/listingResult')
        }catch(error){
            console.log(`submitting server error ${error}`)
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
                {/* <Text style={styles.labelBold}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text> */}
                <Text style={styles.labelWithSmallPadding}>
                     • {key === 'price' ? `$${val}` : String(val)}
                </Text>
                </View>
            ))}

        </ScrollView>
            <CustomButton text="Submit" height={40} onPress={onSubmit} borderRadius={5} ></CustomButton>
      </SafeAreaView>
      </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
     container:{
        flex:1,
        padding:20,
        backgroundColor:'white'
    },
     title: {
        fontSize:20,
        fontWeight:'bold',
        marginTop:30
    },
    viewContainer:{
       // marginTop:10
    },
    label: {
        fontSize:16,
        marginTop:10
    },
    labelWithSmallPadding: {
        fontSize:16,
        marginTop:5
    },
    labelBold: {
        fontSize:16,
        marginTop:10,
        fontWeight:'bold'
    },
    imagesContainer:{
        marginTop:10,
        padding:10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
})
export default itemReviewForm;