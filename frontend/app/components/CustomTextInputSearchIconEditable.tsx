import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet,TouchableHighlight,TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
    onChangeText:(text: string) => void,
    value: string,
    placeholder: string
}

const CustomTextInputSearchIconEditable = ({ onChangeText,value, placeholder }: Props) => {
  return (
    // <TouchableHighlight style={styles.touchableHighlight} underlayColor='#DDDDDD'>
        <View style={styles.inputContainer}>
          <MaterialIcons name="search" size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
          />
        </View>
      // </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchableHighlight: {
    borderRadius: 8,
  },
  TouchableOpacity:{
    flex:4,
    height:40,
  },
  inputContainer: {
    flexDirection: 'row',         // Align icon and input horizontally
    alignItems: 'center',         // Center items vertically
    backgroundColor:"#eeeeee",
    borderRadius: 5,
    height:40,
  },
  icon: {
    marginLeft: 10,              
  },
  input: {
    flex: 1,                      // Allow TextInput to take remaining space
    height: 40,
    fontSize:16,
    padding: 5,
  },
   text: {
    flex: 1,                      // Allow TextInput to take remaining space
    fontSize:16,
    padding: 5,
  },
});

export default CustomTextInputSearchIconEditable;
