import React, {useEffect, useState} from 'react';
import {View,TextInput,StyleSheet,Text,TouchableOpacity} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from './components/CustomButton'
import CustomTextInput from "./components/CustomTextInput";
import PasswordTextInput from './components/PasswordTextInput';
import { useAuth } from '@/context/AuthContext';
import api from './utils/api';
import axios from 'axios';
import LottieView from 'lottie-react-native';

const signup = () => {
    console.log('Sign Up screen');
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);

    const router = useRouter();
    const { login } = useAuth();

    const toggleSecureText = () => setSecureText(prev => !prev);
    const [loading, setLoading] = useState(false);

    const onSignUp = async () => {
       // router.replace('/');
         setLoading(true);
        try{
             const res = await api.post('/auth/sendotp',{
                username:username,
                email:email,
                password:password
            })
            router.replace({pathname: '/verifyotp',params:{email:email,username:username,password:password}})
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

        // const res = api.post('/auth/sendotp',{
        //     username:username,
        //     email:email,
        //     password:password
        // })
        // .then(res=> {
        //     console.log(`'send otp successful!${res.data}`)
        //    router.replace({pathname: '/verifyotp',params:{email:email,username:username,password:password}})
        // })
        // .catch(error=> {
        //     console.error('Error Message:', error.message);
        //     console.error('Error Config:', error.config);
        //     console.error('Error Code:', error.code);
        // })  

    }

     const onNavigateSignIn = () =>{
            router.replace('/signin')
    }

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{marginTop:20}}></View>
                <Text style={styles.logoTitle}>
                    Sign up
                </Text>
                <View style={{marginTop:40}}>
                <Text>Username</Text>
                <CustomTextInput onChangeText={setUsername} value={username} placeholder='Enter your username' borderRadius={8} marginTop={5}></CustomTextInput>
                <Text style={{marginTop:20}}>Email</Text>
                <CustomTextInput onChangeText={setEmail} value={email} placeholder='Enter your email' borderRadius={8} marginTop={5}></CustomTextInput>
                 <Text style={{marginTop:20}}>Password</Text>
                <PasswordTextInput onChangeText={setPassword} value={password} placeholder='Enter your password' borderRadius={8} marginTop={5} toggleSecureText={toggleSecureText} secureText={secureText}></PasswordTextInput>
                <CustomButton onPress={onSignUp} text="Sign up" fontWeight="bold" borderRadius={8} backgroundColor='#5FCC7D'/>
                </View>

                 <View style={styles.singinContainer}>
                    <Text style={styles.text}>Already have an account? </Text>
                    <TouchableOpacity onPress={onNavigateSignIn}>
                    <Text style={styles.signintext}>Sign in</Text>
                    </TouchableOpacity>
                </View>
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
     container :{
        flex: 1,
        padding:20,
        flexDirection:'column',
        backgroundColor:'#ffffff',
    },
     logoTitle:{
        fontSize:25,
        fontWeight: 'bold',
    },
     singinContainer:{
        flexDirection:'row',
        marginTop:15,
        alignItems:'center',
        justifyContent:'center'
    },
    text: {
    fontSize: 16,
    marginTop: 5,
    },
    signintext:{
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
export default signup;