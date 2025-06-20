
import { StyleSheet } from "react-native";

const chooseCategoryStyles = StyleSheet.create({
      container:{
        flex:1,
        padding:20
    },
    title: {
        fontSize:20,
        fontWeight:'bold',
        marginTop:20
    },
    selectePhotoTitle: {
        fontSize:20,
        fontWeight:'bold',
        color:'grey',
        marginTop:30
    },
    categoryTitle: {
        fontSize:20,
        fontWeight:'bold',
        color:'green',
        marginTop:30
    },
    mainCatScrollViewContainer:{
        marginTop:10,
        padding:10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
    label: {
        fontSize:16,
        marginLeft:10
    },
    mainCategoryContainer:{
        flex:1,
        marginTop:10
    },
    categoryContainer:{
        flexDirection:'row',
        padding:10
    },
    safeAreacontainer : {
      flex:1,
      padding:20,
      backgroundColor: 'white'
   },
    modalContainer : {
     // flex:1,
      // justifyContent: "center",
      // alignItems: "center",
    },
    // modalListContainer: {
    //    flex:8,
    //     paddingHorizontal: 16,
    //     backgroundColor: '#fff',
    // },
    subCatContainer:{
        flex:1
    },
     subCatScrollViewContainer:{
        marginTop:10,
        padding:10,
    },
})
export default chooseCategoryStyles;