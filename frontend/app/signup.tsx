import React, {useEffect, useState} from 'react';
import {View,TextInput,StyleSheet,Text} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from './components/CustomButton'
import CustomTextInput from "./components/CustomTextInput";
import PasswordTextInput from './components/PasswordTextInput';
import { useAuth } from '@/context/AuthContext';
import api from './utils/api';

const signup = () => {
    console.log('Sign Up screen');
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);

    const router = useRouter();
    const { login } = useAuth();

    const toggleSecureText = () => setSecureText(prev => !prev);

    const onSignUp = () => {
       // router.replace('/');
        const res = api.post('/auth/sendotp',{
            username:username,
            email:email,
            password:password
        })
        .then(res=> {
            console.log(`'send otp successful!${res.data}`)
           router.replace({pathname: '/verifyotp',params:{email:email}})
        })
        .catch(error=> {
            console.error('Error Message:', error.message);
            console.error('Error Config:', error.config);
            console.error('Error Code:', error.code);
        })  

        // const fakeToken = 'signup-token';
        // login(fakeToken); 
    }
    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{marginTop:20}}></View>
                <Text style={styles.logoTitle}>
                    Log in
                </Text>
                <View style={{marginTop:40}}>
                <Text>Username</Text>
                <CustomTextInput onChangeText={setUsername} value={username} placeholder='Enter your username' borderRadius={8} marginTop={5}></CustomTextInput>
                <Text style={{marginTop:20}}>Email</Text>
                <CustomTextInput onChangeText={setEmail} value={email} placeholder='Enter your email' borderRadius={8} marginTop={5}></CustomTextInput>
                 <Text style={{marginTop:20}}>Password</Text>
                <PasswordTextInput onChangeText={setPassword} value={password} placeholder='Enter your password' borderRadius={8} marginTop={5} toggleSecureText={toggleSecureText} secureText={secureText}></PasswordTextInput>
                <CustomButton onPress={onSignUp} text="Log in" fontWeight="bold" borderRadius={8}/>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
     container :{
        flex: 1,
        padding:20,
        flexDirection:'column',
        backgroundColor:'#ffffff',
    },
     logoTitle:{
        fontSize:25,
        fontWeight: 'bold',
    }
})
export default signup;