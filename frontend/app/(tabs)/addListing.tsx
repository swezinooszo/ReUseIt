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
import Camera from '../../assets/icons/camera.svg';
import Gallery from '../../assets/icons/gallery.svg';
import { takePhoto, pickImages } from '../utils/imageHelper';

const addListing = () => {

    const [images,setImages] = useState<string[]>([]);
 
//     const takePhoto = async () => {
//         console.log('takephoto')
//         // Ask for camera permissions
//         const { status } = await ImagePicker.requestCameraPermissionsAsync();

//         if (status !== 'granted') {
//             alert('Camera permission is required to take photos.');
//             return;
//         }

//         const result = await ImagePicker.launchCameraAsync();
//         if (!result.canceled) {
//             setImages(prev => [...prev, result.assets[0].uri])
//         }
//   };

//     const pickImages = async () => {
//           // Ask for permission
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             if (status !== 'granted') {
//             alert('Permission to access media library is required!');
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             allowsMultipleSelection: true,
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         });
//         if (!result.canceled) {
//             const uris = result.assets.map(a => a.uri);
//             setImages(prev => [...prev, ...uris])
//         }
//   };

   const handleTakePhoto = async () => {
        const uri = await takePhoto();
        if (uri) setImages(prev => [...prev, uri]); 
   }
   const handlePickImages = async () => {
        const uris = await pickImages();
        if (uris) setImages(prev => [...prev, ...uris]);
   }
    const handleDeleteImage = (uriToDelete: string) => {
        setImages(prev => prev.filter(uri => uri !== uriToDelete));
    };

    const next = () =>{
        setImages([]);
        router.push({pathname:'/(addlisting)/chooseCategory',params: { images: JSON.stringify(images) }})
    }
    return(
         <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    {/* <AntDesign name="close" size={24} color="black" onPress={onClose}/> */}
                    <Text style={styles.title}>Select photos for your listing</Text>
                    <View style={styles.photoMainContainer}>
                        <TouchableOpacity style={[styles.photoContainer,{marginRight:10}]} onPress={handleTakePhoto}>
                            {/* <SimpleLineIcons name="camera" size={24} color="black" /> */}
                            <Camera  width={50} height={50}></Camera>
                            <Text style={styles.label}>Take New Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoContainer} onPress={handlePickImages}>
                            {/* <FontAwesome name="photo" size={24} color="black" /> */}
                            <Gallery  width={50} height={50}></Gallery>
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
                    <CustomButton text="Next" fontWeight="bold" height={50} backgroundColor='#5FCC7D' onPress={next} borderRadius={5} isVisible={images.length> 0 ? true : false}></CustomButton>
                </View>
        </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default addListing;
