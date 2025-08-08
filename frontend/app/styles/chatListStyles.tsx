import { StyleSheet } from "react-native";

const chatListStyles = StyleSheet.create({
     safeAreacontainer : {
      flex:1,
      flexDirection:'column',
      backgroundColor: 'white',
      padding:15
   },
     chatListHeaderContainer:{
        flex:0.5,
        flexDirection:'row',
    },
    chatListContainer:{
        flex:9.5,
    },
    mainViewContainer :{
        flex:1,
        flexDirection:'row',
    },
    subViewContainer :{
        flex:1,
    },
    chatListTitleContainer:{
        flex:4,
    },
     chatListTitle: {
        fontSize:18,
        fontWeight:'bold',
        textAlign:'center',
    },
    imageContainer:{
        width: 50,
        height: 50,
        marginRight:10
    },
      image:{
        width: 50,
        height: 50,
        borderRadius: 25,
        position: 'absolute',//When you want a view (like a profile image) to visually "float" over another (like a card), you give it:
        top: 0,
    },
  
})

export default chatListStyles;