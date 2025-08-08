import { StyleSheet } from "react-native";
import { Dimensions} from "react-native";
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 30) / 2; // Adjust spacing

const meStyles = StyleSheet.create({

    container:{
      flex:1,
       // padding:20,
      backgroundColor:'#5FCC7D'
    },
    sellerdetailscontainer:{
      flex:1,
       // padding:20,
      backgroundColor:'#fff'
    },
    topContainer:{
      height:50,
      flexDirection:'row',
      backgroundColor:'#5FCC7D',
    },
    middleContainer:{
      height:70,
      backgroundColor:'blue',
    },
     userListingContainer:{
       flex:1,
       backgroundColor:'white'
       
    },
    cardContainer: {
      alignItems: 'center',
      marginTop: 10,
    //  backgroundColor:'red'
    },
   
     imageContainer: {
      zIndex: 2,//zIndex: 2 brings the image in front
      alignItems: 'center',
    },
    image:{
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'absolute',//When you want a view (like a profile image) to visually "float" over another (like a card), you give it:
        top: 0,
    },
     UserInfoContainer:{
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 12,
        marginTop: 50, // push the card down below the image
        paddingTop: 60, // leave space for the overlapping image
        paddingBottom: 20,
       // paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5, // for Android shadow
        zIndex: 1,
    },
     userTitleContainer:{
       alignItems:'center',
      //backgroundColor:'yellow'
    },
    usernameTitle:{
        fontSize: 18,
        fontWeight:'bold',
        color:'#5FCC7D',
        marginTop:0
    },
    yearsTitle:{
        fontSize: 14,
        fontWeight:'bold',
        height:24,//to be align with review
    },
     yearsLabel:{
        fontSize: 14,
        color:'grey',
    },
    reviewsTitle:{
        fontSize: 14,
        fontWeight:'bold'
    },
     reviewLabel:{
        fontSize: 14,
        color:'grey',
    },
     profileTextMainContainer:{
       flexDirection:'row',
       marginTop:10,
    },
    profileTextContainer:{
      flex: 1,   
      alignItems:'center',
      justifyContent:'center',
      marginTop:10,
    
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

      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"//"rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
      },
      modalButton: {
        backgroundColor:"#5FCC7D",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
      },
      modalButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
  
      },
      ratingView : {
        flexDirection:'row',
        alignItems:'center'
      }
    
})

export default meStyles;