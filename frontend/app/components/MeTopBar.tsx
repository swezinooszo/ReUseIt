import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/meStyles';

interface MeTopBarProps {
  onLogout: () => void;
}

const MeTopBar: React.FC<MeTopBarProps> = ({ onLogout }) => {
  const router = useRouter();

  return (
                <View style={styles.topContainer}>
                    <View style={{flex:7,height:40,alignItems: 'center',justifyContent:'center'}}>
            
                    </View>
                    <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
                        <TouchableOpacity  onPress={onLogout} >
                            <Ionicons name="log-out-outline" size={30} color="white" /> 
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
                        <TouchableOpacity   onPress={() => router.push('/(me)/FavoriteList')}  >
                            <MaterialIcons name= "favorite" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
                        <TouchableOpacity   onPress={() => router.push('/(me)/chatlist')}  >
                            <Ionicons name="chatbubble-ellipses-outline" size={30} color="white" />  
                        </TouchableOpacity>
                    </View>
                </View>
  );
};

export default MeTopBar;

