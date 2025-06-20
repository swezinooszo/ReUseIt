import { Text,StyleSheet } from "react-native";

type Props = {
    name:string,
    fontWeight?: 'normal' | 'bold' ,
    fontSize?:number,
    flex?:number,
    color?:string,
    backgroundColor?:string,
    marginTop?:number
}
const CustomText = ({name,fontWeight = 'normal', fontSize = 20,flex=1,color,backgroundColor,marginTop=0}:Props) =>{
    return(
        <Text style={{fontSize,fontWeight,flex,color,backgroundColor,marginTop}}>
                {name}
        </Text>
    )

}


// const styles = StyleSheet.create({
//     label:{
//         fontSize: 20,
//         fontWeight:fontweight,
//     }
// })

export default CustomText;