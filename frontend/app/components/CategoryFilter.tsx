import { View,StyleSheet,Text,TouchableHighlight,ViewStyle } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentType } from 'react';

type IconComponentProps = {
  name: string;
  size?: number;
  color?: string;
};


type Props = {
    onPress: () => void,
    text: string,
    fontSize?:number,
    // width?: number;
    height?: number;
    borderRadius?: number;
     iconName?: keyof typeof MaterialIcons.glyphMap;
    // iconName: string;
    // iconComponent?: ComponentType<IconComponentProps>; // The icon component itself (e.g. MaterialIcons)
}

const CategoryFilter = ({onPress,text,fontSize=12,height = 30,borderRadius = 15,iconName}:Props) =>{//,iconComponent:Icon
    return(
        <TouchableHighlight onPress={onPress} underlayColor="#ddd" style={{ borderRadius, alignSelf: 'flex-start' }}>
            <View style={[styles.container,{height, borderRadius, alignSelf: 'flex-start',flexDirection:'row',padding:5  }]} >
                <Text style={{fontSize}}>{text}</Text>
                {
                    iconName && (<MaterialIcons name={iconName} size={15} color="black" />)
                }
                {/* {Icon && iconName && (
                    <Icon name={iconName} size={15} color="black" />
                )} */}
                {/* <MaterialIcons name="keyboard-arrow-down" size={15} color="black" /> */}
            </View>
            
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container:{
        // width:40,
        // height:20,
        // borderRadius:10,
        borderWidth:1,
        borderColor:'grey',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12, // padding gives space around the text
        paddingVertical: 6, // optional for vertical breathing room
    },
    text:{
       // fontSize:12
    }
})

export default CategoryFilter