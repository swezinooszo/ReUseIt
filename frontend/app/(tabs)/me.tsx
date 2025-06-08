import React,{useEffect,useState} from 'react'
import {View,Text,StyleSheet} from "react-native"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import CustomButton from "../components/CustomButton";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {jwtDecode} from 'jwt-decode';


type MyJwtPayload = {
  id: string; // or userId: string;
};
const me = () => {
    const [token,setToken] = useState('');
    const { logout } = useAuth();
    const onLogout = () => {
      logout();
    }

//     useEffect(() => {
//       const loadToken = async () => {
//         console.log("loadToken")
//         const storedToken = await AsyncStorage.getItem('userToken');
//         console.log(`storedToken ${storedToken}`)
//         if (storedToken) {
//           setToken(storedToken);
//          const decoded = jwtDecode<MyJwtPayload>(storedToken);
//           console.log("Decoded JWT:", decoded.id);
//         }
//       };
//       loadToken();
//   }, []);

    return(
        <SafeAreaProvider>
            <SafeAreaView>
                <Text >
                    Me screen
                </Text>
                <CustomButton onPress={onLogout} text="Log out" fontWeight="bold"/>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    input: {
        
    }
})
export default me;