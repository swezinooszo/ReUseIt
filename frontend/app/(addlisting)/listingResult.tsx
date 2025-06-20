import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StyleSheet,View,Text,TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import {router} from 'expo-router'
import CustomText from '../components/CustomText';

const listingResult = () =>{

    const goBackToListing = () =>{
        router.navigate('/(tabs)')
    }

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Ionicons name="checkmark-circle-outline" size={96}></Ionicons>
                <CustomText name="Congratulation!!!"  flex={0} fontWeight="bold"/>
                 <CustomText name="Your Listing is successfully listed!"  flex={0} fontWeight="bold"/>

                <TouchableOpacity onPress={goBackToListing} style={{marginTop:20}} >
                    <Text style={{color:'#388E3C', fontWeight:'bold', fontSize:20}}>Go Back to  Listing</Text>
                </TouchableOpacity>
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
})

export default listingResult;