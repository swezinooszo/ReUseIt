// SelectInput.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet,GestureResponderEvent,ViewStyle,DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    label: string;
    value?: string;
    onPress: (event: GestureResponderEvent) => void;
    // width?: DimensionValue ;
    // flex?: number;
     width?: ViewStyle['width'];
    flex?:number,
};

const CustomButtonInput: React.FC<Props> = ({ label, value, onPress,width,flex }) => {
    // const containerStyle: ViewStyle = {
    //     ...(width !== undefined ? { width } : {}),
    //     ...(flex !== undefined ? { flex } : {}),
    // };

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.inputContainer,{width,flex}]}>
                <Text style={[styles.inputText, { color: value ? '#000' : '#aaa' }]}>
                    {value || label}
                </Text>
                {/* <Ionicons name="chevron-down" size={20} color="#666" /> */}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
      //  width:"100%",
     // width:500,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 0,
        fontSize: 16,
        height: 50,
        backgroundColor: '#e5e5ea',
       // flex:1
         flexDirection: 'row',
         justifyContent: 'space-between',
       // alignItems: 'center',
    },
    inputText: {
        fontSize: 16,
    },
});

export default CustomButtonInput;
