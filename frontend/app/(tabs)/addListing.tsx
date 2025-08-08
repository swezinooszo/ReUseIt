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


   const handleTakePhoto = async () => {
        const uri = await takePhoto();
        if (uri) setImages(prev => [...prev, uri]); 
   }
   const handlePickImages = async () => {
        const uris = await pickImages(true);
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
                    <Text style={styles.title}>Select photos for your listing</Text>
                    <View style={styles.photoMainContainer}>
                        <TouchableOpacity style={[styles.photoContainer,{marginRight:10}]} onPress={handleTakePhoto}>
                            <Camera  width={50} height={50}></Camera>
                            <Text style={styles.label}>Take New Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoContainer} onPress={handlePickImages}>
                            <Gallery  width={50} height={50}></Gallery>
                            <Text style={styles.label}>Select from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                    <ScrollView style={styles.scrollViewContainer} horizontal>
                         {images.map((uri, index) => (
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


