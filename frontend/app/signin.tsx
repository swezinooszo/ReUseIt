import React, {useEffect, useState} from 'react';
import {View,Text,StyleSheet} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from './components/CustomButton'
import CustomTextInput from "./components/CustomTextInput";
import PasswordTextInput from './components/PasswordTextInput';
import { useAuth } from '@/context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import api from './utils/api';

const signin =  () => {
    const { login } = useAuth();

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const toggleSecureText = () => setSecureText(prev => !prev);

     const onSignIn = () => {
        // router.replace('/verifyotp')

        const res = api.post('/auth/login',{
            email:email,
            password:password
        })
        .then(res=> {
            console.log(`'login successful!${res.data}`)
            login(res.data.token)
        })
        .catch(error=>console.log(error))     

        // const fakeToken = 'abc123';
        // login(fakeToken);
     }

     const onNavigateSignUp = () =>{
        router.replace('/signup')
     }

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{marginTop:20}}></View>
                <Text style={styles.logoTitle}>
                    Log in
                </Text>
                <View style={{marginTop:40}}>
                <Text>Email</Text>
                <CustomTextInput onChangeText={setEmail} value={email} placeholder='Enter your email' borderRadius={8} marginTop={5}></CustomTextInput>
                 <Text style={{marginTop:20}}>Password</Text>
                <PasswordTextInput onChangeText={setPassword} value={password} placeholder='Enter your password' borderRadius={8} marginTop={5} toggleSecureText={toggleSecureText} secureText={secureText}></PasswordTextInput>
                <CustomButton onPress={onSignIn} text="Log in" fontWeight="bold" borderRadius={8}/>
                </View>

                 <CustomButton onPress={onNavigateSignUp} text="Here to Sign Up" fontWeight="bold" borderRadius={8}/>
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

export default signin;