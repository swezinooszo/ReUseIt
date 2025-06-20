import { TextInput,View,StyleSheet,Text } from "react-native";

type Props = {
    onChangeText:(text: string) => void,
    value: string,
    placeholder: string,
    errorMessage?:string,
    onEndEditing?:() => void,
    marginTop?:number,
    height?:number,
    backgroundColor?:string,
    prefixText?:string,
    suffixText?:string,
    borderRadius?:number
}
const CustomTextInputWithText = ({ onChangeText, value, placeholder ,errorMessage="",onEndEditing,marginTop=0,borderRadius=18,height=50,backgroundColor="#fff",prefixText, suffixText=''}: Props) =>{
    return(
        <View style={[styles.inputContainer,{marginTop,backgroundColor,borderRadius},errorMessage ? { borderColor: 'red' } : { borderColor: '#80808030' }]}>
             {/* Text at the Start */}
            <Text style={[styles.prefixText, prefixText?.length!==0 ? styles.visible : styles.hidden]}>{prefixText}</Text>
            <TextInput
            style={[styles.input,{height,borderRadius}]}
            onChangeText={onChangeText}
            value = {value}
            placeholder= {placeholder}
            keyboardType="numeric"
            onEndEditing={onEndEditing}
            />
             {/* Text at the End */}
             <Text style={styles.suffixText}>{suffixText}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
      //  borderColor: '#ccc',
        // borderRadius: 18,
        paddingHorizontal: 10,
      },
      input : {
        flex:1,
      //  height: 50,
       // borderWidth: 1,
       // padding: 15,
        fontSize:16,
        // borderColor:'grey',
       // borderRadius:18,
       // marginTop:20,
    },
    prefixText: {
        fontSize: 16,
        color: '#388E3C',
        marginRight: 5,
        fontWeight:'bold'
      },
      suffixText: {
        fontSize: 16,
        color: '#388E3C',
        marginLeft: 5,
        fontWeight:'bold'
      },
      visible:{
        opacity:1,
     
      },
      hidden:{
        opacity:0,
        width:0
      }
})

export default CustomTextInputWithText;