import React, {useEffect, useState} from 'react';
import {View,Text,StyleSheet} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { router,useLocalSearchParams } from "expo-router";
import CustomButton from './components/CustomButton'
import CustomTextInput from "./components/CustomTextInput";
import PasswordTextInput from './components/PasswordTextInput';
import { useAuth } from '@/context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import api from './utils/api';

const verifyotp = () => {
    const { login } = useAuth();

    const {email} = useLocalSearchParams();
    const [otp,setOTP] = useState('');

     const onVerifyOTP = async () => {
       
        const res = api.post('/auth/verifyotp',{
            email:email,
            otp:otp
        })
        .then(res=> {
            console.log(`'Verify OTP successful!${res.data.token}`)
            login(res.data.token)
        })
        .catch(error=>console.log(error))     

        // const fakeToken = 'abc123';
        // login(fakeToken);
     }

  

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{marginTop:20}}></View>
                <Text style={styles.logoTitle}>
                    Verify OTP
                </Text>
                <View style={{marginTop:40}}>
                <Text>OTP</Text>
                <CustomTextInput onChangeText={setOTP} value={otp} placeholder='Enter your otp' borderRadius={8} marginTop={5}></CustomTextInput>
                <CustomButton onPress={onVerifyOTP} text="Verify OTP" fontWeight="bold" borderRadius={8}/>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
       
    },
    logoTitle:{
        fontSize:25,
        fontWeight: 'bold',
    }
})

export default verifyotp;