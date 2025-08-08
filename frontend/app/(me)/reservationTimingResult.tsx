import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StyleSheet,View,Text,TouchableOpacity,Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import {router,useLocalSearchParams} from 'expo-router'
import CustomText from '../components/CustomText';
import { useEffect,useState } from 'react';
import LottieView from 'lottie-react-native';

const reservationTimingResult = () =>{

    const { images,title='',price='',isFromEditForm='false'} = useLocalSearchParams();
    const [mainImage, setMainImage] = useState<string | null>(null);

    const goBackToListing = () =>{
        router.navigate('/(tabs)')
    }
    
    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                 {/*  Background Lottie animation */}
                <LottieView
                    source={require('../../assets/animation/congrat.json')}
                    autoPlay
                    loop
                    style={styles.backgroundAnimation}
                />
                <View style={styles.contentContainer}>
                    <CustomText name= "Well done!"  flex={0} fontWeight="bold"/>
                    <CustomText name="You have been successfully reserved a time for your listing \n It will be alert you when it has expired." flex={0} fontSize={14} marginTop={10}/>
                    <View style={styles.imageContainer}>
                        {/* <View >
                            <Image
                                source={mainImage ? { uri: mainImage } : require('../../assets/images/default_image.png')}
                                style={styles.image}
                                resizeMode="cover" // ✅ ensures center crop
                            />
                            <Text style={[styles.label,{width:170}]}>{title}</Text>
                            <Text style={[styles.label,{marginTop:5}]}>${price}</Text>
                        </View> */}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={goBackToListing} >
                        <Text style={styles.buttonText}>Explore listing again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
       // padding:20,
        backgroundColor:'white',
    },
     backgroundAnimation: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
    },
     contentContainer: {
        flex: 1,
        zIndex: 1,
        padding: 20,
       // alignItems: 'center',
        marginTop: 30,
    },
    imageContainer:{
        justifyContent:'center',
        alignItems: 'center',
    },
    image:{
        width:170,
        height:200,
        resizeMode:'center',
        marginTop:30,
        marginBottom:10,
        borderRadius:5,
    },
    label:{
        fontSize:14,
        fontWeight:'bold',
        textAlign:"left"
    },
     button: {
        backgroundColor: "#5FCC7D",
        marginTop: 20,
        width: '100%',
        height: 40,
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
    },
     buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // card:{
    //     borderWidth:1,
    //     borderRadius:5,
    //     color:'#dcdcdc99'
    // }
    
})

export default reservationTimingResult;