
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20
    },
    title: {
        fontSize:20,
        fontWeight:'bold',
        marginTop:10
    },
    photoMainContainer:{
        flexDirection:'row',
        marginTop:20,
        //padding:20
    },
     photoContainer:{
        width:150,
        height:120,
       // borderWidth:.5,
        borderRadius:20,
        // borderColor:'#D9D9D9',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#dcdcdc99',
    },
    label: {
        fontSize:16,
    },
    scrollViewContainer:{
        marginTop:10,
        padding:10
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 8,
    },
    image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    },
    deleteIcon: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'white',
        borderRadius: 10,
        zIndex: 1,
    },
})

export default styles;