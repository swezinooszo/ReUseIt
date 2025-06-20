import { TouchableHighlight,StyleSheet,View,Text,ViewStyle } from "react-native";

type Props = {
    onPress: () => void,
    text: string,
    height?: number,
    marginTop?:number,
    borderRadius?:number,
    fontSize?:number,
    backgroundColor?:string,
    color?:string,
    fontWeight?:'normal' | 'bold',
    width?: ViewStyle['width'];
    flex?:number,
    borderWidth?:number,
    borderColor?:string,
    isVisible?:boolean
}
const CustomButton = ({onPress,text,height = 50,marginTop = 20,borderRadius=25,fontSize=18,backgroundColor='#388E3C'
    ,color='#fff',fontWeight='normal',width = '100%' ,flex,borderWidth=0,borderColor,isVisible=true}:Props) => {
    return (
           <TouchableHighlight style={[styles.touchablehightligh,{marginTop,flex,borderRadius,borderWidth,borderColor},isVisible ? styles.visible : styles.hidden]} onPress={onPress}>
                <View style={[styles.button, { height,borderRadius,backgroundColor ,width}]}>
                <Text style={[styles.text,{fontSize,color,fontWeight}]}>{text}</Text>
                </View>
           </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    touchablehightligh:{
    },
    button:{
        alignItems: 'center',
        justifyContent:'center',
        padding: 10,

    },
    text:{
        // fontSize:18,
        // color:'#fff'
    },
    visible: {
        opacity: 1, // Fully visible
        height: 'auto', // Normal height
    },
    hidden: {
        opacity: 0, // Fully invisible
        height: 0, // Removes space it occupies
        width:0
    },
})

export default CustomButton;