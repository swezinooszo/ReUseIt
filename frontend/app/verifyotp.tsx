import React, {useRef, useState} from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { router,useLocalSearchParams } from "expo-router";
import CustomButton from './components/CustomButton'
import CustomTextInput from "./components/CustomTextInput";
import PasswordTextInput from './components/PasswordTextInput';
import { useAuth } from '@/context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import api from './utils/api';
import { showAlertDialog } from './utils/chatUtils';

const verifyotp = () => {
    const { login } = useAuth();

    const {username,email,password} = useLocalSearchParams();
   // const [otp,setOTP] = useState('');
    const [otpText,setOtpText] = useState('Enter the 6-digit verification code that was sent to your email.');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);

    // ***** 6 digits textinput handler
    const handleChange = (text: string, index: number) => {
        if (/^\d?$/.test(text)) {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = text;
        setOtpDigits(newOtpDigits);

        // Move to next input if not the last one
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
        inputs.current[index - 1]?.focus();
        }
    };

    // ***** Verify OTP
     const onVerifyOTP = async () => {
        const otp = otpDigits.join('');
        if (otp.length < 6) {
              showAlertDialog(
                'Please enter all 6 digits.',
                () => {
                   
                },
              );
         return;
        }

        const res = api.post('/auth/verifyotp',{
            email:email,
            otp:otp
        })
        .then(res=> {
            console.log(`'Verify OTP successful!${res.data.token}`)
            login(res.data.token,res.data.user)
        })
        .catch(error=>{
            showAlertDialog(
                error.response.data.message || 'Invalid OTP',
                () => {
                   
                },
              );
            //console.log(error)
        })     
     }

    // ***** Resend OTP
    const onResendOTP = () => {
        const res = api.post('/auth/sendotp',{
            username:username,
            email:email,
            password:password
        })
        .then(res=> {
            console.log(`'resend otp successful!${res.data}`)
            setOtpText(`We Resent OTP to your email. Enter the 6-digit verification code that was sent to your email.`)
        })
        .catch(error=> {
             showAlertDialog(
                error.response.data.message || 'Error in resending OTP',
                () => {
                   
                },
              );
            console.log(error)
        })  
    }

    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{marginTop:20}}></View>
                <Text style={styles.logoTitle}>
                    OTP Verification
                </Text>
                <Text style={styles.subTitle}>
                    {otpText}
                </Text>
                 <View style={styles.otpContainer}>
                    {otpDigits.map((digit, index) => (
                        <TextInput
                        key={index}
                        ref={(ref) => {
                        inputs.current[index] = ref;
                        }}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        value={digit}
                        autoFocus={index === 0}
                        />
                    ))}
                </View>
                <View style={styles.resendOTPContainer}>
                <Text>Code expires in 5 minutes</Text>
                <TouchableOpacity onPress={onResendOTP}>
                    <Text style={styles.otptext}>RESEND OTP</Text>
                </TouchableOpacity>
                </View>
                <CustomButton
                onPress={onVerifyOTP}
                text="Verify"
                fontWeight="bold"
                borderRadius={8}
                backgroundColor="#5FCC7D"
                marginTop={30}
                />
                {/* <View style={{marginTop:40}}>
                <Text>OTP</Text>
                <CustomTextInput onChangeText={setOTP} value={otp} placeholder='Enter your otp' borderRadius={8} marginTop={5}></CustomTextInput>
                <CustomButton onPress={onVerifyOTP} text="Verify" fontWeight="bold" borderRadius={8} backgroundColor='#5FCC7D'/>
                </View> */}
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
    },
      subTitle:{
        fontSize:16,
        marginTop:10
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 20,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: 45,
        height: 50,
        fontSize: 20,
        textAlign: 'center',
    },
    resendOTPContainer:{
        alignItems:'center',
        marginTop:20
    },
     otptext:{
      fontSize: 16,
      marginTop: 5,
      color:'red',//#6EEA8E
      fontWeight:'bold'
    }
})

export default verifyotp;