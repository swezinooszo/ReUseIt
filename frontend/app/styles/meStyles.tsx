import { StyleSheet } from "react-native";
import { Dimensions} from "react-native";
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 30) / 2; // Adjust spacing

const meStyles = StyleSheet.create({
    container:{
        flex:1,
       // padding:20,
        backgroundColor:'white'
    },
    topViewContainer:{
        height: 100,
        //backgroundColor:'lightblue',
        flexDirection:'row',
        alignItems:'center',
        padding:20
    },
    userListingContainer:{
       flex:1,
      // backgroundColor:'green'
    },
    image:{
        width:60,
        height:60,
        borderRadius:30,
    },
     userTitleContainer:{
        marginLeft:10,
    },
    usernameTitle:{
        fontSize: 14,
        fontWeight:'bold'
    },
    yearsTitle:{
        fontSize: 14,
    },
    reviewsTitle:{
        fontSize: 14,
        marginTop:5,
        color: 'grey',
    },
    listingCountTitle:{
        fontSize: 16,
        fontWeight:'bold'
    },
     row: {
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    flatListContainer: {
      paddingHorizontal: 10,
      paddingTop: 0,
    },
    card: {
      width: itemWidth,
      backgroundColor: '#fff',
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2,
      padding: 8,
    },
    imageCard: {
      width: '100%',
      height: itemWidth,
      borderRadius: 8
    },
    descriptionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    description: {
      fontSize: 14,
      flex: 1,
      marginRight: 4,
    },
    condition: {
      fontSize: 14,
      color: '#777',
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 5,
    },
    title: {
      fontSize: 14,
      flex: 1,
      fontWeight: 'bold',
      marginRight: 4,
    },
    price: {
      fontWeight: 'bold',
      fontSize: 14,
      marginTop: 4,
    },
    reservedItem: {
      width:'100%',
      padding:4,
      fontSize: 14,
      backgroundColor:'#5FCC7D',
      position:'absolute',
      bottom: 0,
    },
     soldItem: {
      width:'100%',
      padding:4,
      fontSize: 14,
      backgroundColor:'red',
      position:'absolute',
      bottom: 0,
    },
    
})

export default meStyles;