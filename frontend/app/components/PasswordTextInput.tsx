import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet,TouchableHighlight,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

type Props = {
    onChangeText:(text: string) => void,
    value: string,
    placeholder: string,
    marginTop?:number,
    borderRadius?:number,
    toggleSecureText:() => void,
    secureText:boolean
}

const PasswordTextInput = ({ onChangeText,value, placeholder,borderRadius=25,marginTop=20,toggleSecureText,secureText }: Props) => {
 

  return (
      <View style={[styles.inputContainer,{borderRadius}]}>
        <TextInput
          style={[styles.input,{borderRadius,marginTop}]}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={secureText}
        />
        <TouchableOpacity onPress={toggleSecureText} style={styles.icon}>
         <Ionicons
          name={secureText ? 'eye-off' : 'eye'}
          size={24}
          color="gray"
        />
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  touchableHighlight: {
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',         // Align icon and input horizontally
    alignItems: 'center',         // Center items vertically
    borderColor: '#80808030',
    borderWidth: 1,
    backgroundColor:"#fff",
    // borderRadius: 25,
  },
  icon: {
    marginRight: 10,              // Space between icon and input
  },
  input: {
    flex: 1,                      // Allow TextInput to take remaining space
    height: 50,
    fontSize:16,
    padding: 15,
  },
});

export default PasswordTextInput;
