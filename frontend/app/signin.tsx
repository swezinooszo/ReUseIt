import React, {useEffect, useState} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,KeyboardAvoidingView,ScrollView,Platform,Button} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from './components/CustomButton'
import CustomTextInput from "./components/CustomTextInput";
import PasswordTextInput from './components/PasswordTextInput';
import { useAuth } from '@/context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import api from './utils/api';
import LottieView from 'lottie-react-native';
import axios from 'axios';
//import { useNotification } from "@/context/NotificationContext";

const signin =  () => {
    // const { notification, expoPushToken, error } = useNotification();
    // if (error) {
    //     return <Text>Error: {error.message}</Text>;
    // }

    const { login } = useAuth();

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const toggleSecureText = () => setSecureText(prev => !prev);
    const [loading, setLoading] = useState(false);

     const onSignIn = async () => { 
        // router.replace('/verifyotp')
         setLoading(true);
        try{
             const res = await api.post('/auth/login',{
                email:email,
                password:password
            })
            login(res.data.token,res.data.user)
        }catch(error: unknown){
            console.log(`submitting server error ${error}`)
            if (axios.isAxiosError(error) && error.response) {
                const message = error.response.data.message || 'Login failed';
                console.log('Login error:', message);
                 alert(message); // or set a state to display in the UI
            } else {
                console.error('Unexpected error:', error);
                alert('Something went wrong. Please try again.');
            }


        }finally {
            setLoading(false); // Hide loading 
        }

        // const res = api.post('/auth/login',{
        //     email:email,
        //     password:password
        // })
        // .then(res=> {
        //     console.log(`'login successful!${res.data}`)
        //     login(res.data.token)
        // })
        // .catch(error=>console.log(error))     
     }

     const onNavigateSignUp = () =>{
        router.replace('/signup')
     }

    //  const sendNotification = async () => {
    //      const message = {
    //         to: expoPushToken,
    //         sound: 'default',
    //         title: 'Original Title',
    //         body: 'And here is the body!',
    //         data: { someData: 'goes here' },
    //     };

    //     await fetch('https://exp.host/--/api/v2/push/send', {
    //         method: 'POST',
    //         headers: {
    //         Accept: 'application/json',
    //         'Accept-encoding': 'gzip, deflate',
    //         'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(message),
    //     });
    //  }
    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>


              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


                <View style={{marginTop:20}}></View>
                <Text style={styles.logoTitle}>
                    Log in
                </Text>
                <Text style={styles.subTitle}>
                    Log in to start selling and buying on ReUseIt
                </Text>
                <View style={{marginTop:40}}>
                <Text>Email</Text>
                <CustomTextInput onChangeText={setEmail} value={email} placeholder='Enter your email' borderRadius={8} marginTop={5}></CustomTextInput>
                 <Text style={{marginTop:40}}>Password</Text>
                <PasswordTextInput onChangeText={setPassword} value={password} placeholder='Enter your password' borderRadius={8} marginTop={5} toggleSecureText={toggleSecureText} secureText={secureText}></PasswordTextInput>
                <CustomButton onPress={onSignIn} text="Log in" fontWeight="bold" borderRadius={8} backgroundColor='#5FCC7D'/>
                </View>

                <View style={styles.singupContainer}>
                <Text style={styles.text}>Don't have an account? </Text>
                <TouchableOpacity onPress={onNavigateSignUp}>
                    <Text style={styles.signuptext}>Sign up</Text>
                </TouchableOpacity>
               </View>


                {/* <View>
                    <Text>{expoPushToken}</Text>
                    <Text>{notification?.request.content.title}</Text>
                    <Text>
                    {JSON.stringify(notification?.request.content.data, null, 2)}
                    </Text>
                </View> */}
                 {/* <CustomButton onPress={onNavigateSignUp} text="Here to Sign Up" fontWeight="bold" borderRadius={8}/> */}

                </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

             {/* loading indicator */}
            {loading && (
            <View style={styles.loadingOverlay}>
                <View style={styles.loadingBox}>
                <LottieView
                    source={require('../assets/animation/loading.json')}
                    autoPlay
                    loop
                    style={styles.loadingAnimation}
                />
                <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </View>
            )}
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
    },
    subTitle:{
        fontSize:16,
        marginTop:10
    },
    singupContainer:{
        flexDirection:'row',
        marginTop:15,
        alignItems:'center',
        justifyContent:'center'
    },
    text: {
    fontSize: 16,
    marginTop: 5,
    },
    signuptext:{
      fontSize: 16,
      marginTop: 5,
      color:'red',//#6EEA8E
      fontWeight:'bold'
    },
    loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', // subtle dim background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
    loadingAnimation: {
    width: 150,
    height: 100,
    marginBottom: 0,
    },
})

export default signin;