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
    subViewContainer :{
        flex:1
    },
    chatListTitleContainer:{
        flex:4,
    },
     chatListTitle: {
        fontSize:18,
        fontWeight:'bold',
        textAlign:'center',
    },
  
})

export default chatListStyles;