import { TextInput,View,StyleSheet } from "react-native";
type Props = {
    onChangeText:(text: string) => void,
    value: string,
    placeholder: string,
    marginTop?:number,
    height?:number,
    multiline?: boolean,
    maxLength?: number;
    errorMessage?:string;
    onEndEditing?:() => void,
    // borderColor?: string;
    backgroundColor?:string,
    fontSize?:number,
    borderRadius?:number
}
const CustomTextInput = ({ onChangeText, value, placeholder,marginTop = 20,height=50,fontSize=16,multiline = false,
    maxLength,errorMessage="",onEndEditing,backgroundColor="#fff",borderRadius=18 }: Props) =>{
    return(
        <TextInput
        style={[styles.input,{marginTop,height,backgroundColor,fontSize,borderRadius},errorMessage ? { borderColor: 'red' } : { borderColor: '#80808030' }]}
        // style={[styles.input,{marginTop,height,}, { borderColor: errorMessage ? "red" : borderColor }]}
        onChangeText={onChangeText}
        value = {value}
        placeholder= {placeholder}
        multiline={multiline}
        maxLength={maxLength}
        onEndEditing={onEndEditing}
        />
    )
}

const styles = StyleSheet.create({
    input : {
       // height: 50,
        borderWidth: 1,
        padding: 15,
        // fontSize:16,
        // borderColor:'grey',
        // borderRadius:18,
        // marginTop:20,
    },
})

export default CustomTextInput;