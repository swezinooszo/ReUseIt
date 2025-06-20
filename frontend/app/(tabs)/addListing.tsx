import { View,Text,StyleSheet,TouchableOpacity,ScrollView,Image} from "react-native";
import { useState } from "react";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { AntDesign } from "@expo/vector-icons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from 'expo-image-picker';
import CustomButton from "../components/CustomButton";
import {router} from "expo-router";
import styles from "../styles/addListingStyles";
const addListing = () => {

    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [cameraImages, setCameraImages] = useState<string[]>([]);
    const [images,setImages] = useState<string[]>([]);
    const onClose= () =>{

    }

      // Function to upload an image
    // const uploadImageToFirebase = async (imageUri: string) => {
    //     try {
    //     const response = await fetch(imageUri);
    //     const blob = await response.blob();
    
    //     // Generate a unique filename
    //     const fileName = `images/${Date.now()}.jpg`;
    
    //     // Reference to Firebase Storage
    //     const storageRef = ref(storage, fileName);
    
    //     // Upload the file
    //     await uploadBytes(storageRef, blob);
    
    //     // Get the image's download URL
    //     const downloadURL = await getDownloadURL(storageRef);
    
    //     console.log("Image uploaded successfully. URL:", downloadURL);
    //     return downloadURL; // Return the download URL
    //     } catch (error) {
    //     console.error("Error uploading image:", error);
    //     throw error;
    //     }
    // };

    // const uploadAndSaveImage = async (imageuri:string) => {
    //     const imageurl = await uploadImageToFirebase(imageuri);
    //     console.log(" uploadAndSaveImage ",imageurl)
    //    // setImageURL(imageurl)
    // }


    const takePhoto = async () => {
        console.log('takephoto')
        // Ask for camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            alert('Camera permission is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        if (!result.canceled) {
            //setGalleryImages([])
            //setCameraImages(prev => [...prev, result.assets[0].uri]);
            setImages(prev => [...prev, result.assets[0].uri])
        }
  };

    const pickImages = async () => {
          // Ask for permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (!result.canceled) {
            //setCameraImages([])
            const uris = result.assets.map(a => a.uri);
           // setGalleryImages(prev => [...prev, ...uris]);
            setImages(prev => [...prev, ...uris])
        }
  };

    const handleDeleteImage = (uriToDelete: string) => {
        setImages(prev => prev.filter(uri => uri !== uriToDelete));
       
        // if (galleryImages.length > 0) {
        //     setGalleryImages(prev => prev.filter(uri => uri !== uriToDelete));
        // } else {
        //     setCameraImages(prev => prev.filter(uri => uri !== uriToDelete));
        // }
    };

    const next = () =>{
        router.push({pathname:'/(addlisting)/chooseCategory',params: { images: JSON.stringify(images) }})
    }
    return(
         <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    {/* <AntDesign name="close" size={24} color="black" onPress={onClose}/> */}
                    <Text style={styles.title}>Select photos for your listing</Text>
                    <View style={styles.photoMainContainer}>
                        <TouchableOpacity style={[styles.photoContainer,{marginRight:10}]} onPress={takePhoto}>
                            <SimpleLineIcons name="camera" size={24} color="black" />
                            <Text style={styles.label}>Take New Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoContainer} onPress={pickImages}>
                            <FontAwesome name="photo" size={24} color="black" />
                            <Text style={styles.label}>Select from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                    <ScrollView style={styles.scrollViewContainer} horizontal>
                         {images.map((uri, index) => (//{(galleryImages.length>0 ? galleryImages : cameraImages).map((uri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image key={index} source={{ uri }} style={styles.image} />
                              <TouchableOpacity
                            style={styles.deleteIcon}
                            onPress={() => handleDeleteImage(uri)}
                        >
                            <AntDesign name="closecircle" size={20} color="red" />
                        </TouchableOpacity>
                        </View>

                        ))}
                    </ScrollView>
                    </View>
                    <CustomButton text="Next" height={40} onPress={next} borderRadius={5} isVisible={images.length> 0 ? true : false}></CustomButton>
                </View>
        </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default addListing;