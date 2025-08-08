import { StyleSheet } from "react-native";
import { Dimensions} from "react-native";
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 30) / 2; // Adjust spacing

const indexStyles = StyleSheet.create({
       safeAreacontainer : {
      flex:1,
      flexDirection:'column',
      backgroundColor: 'white'
   },
    container : {
      flex:0.5,
      // justifyContent: "center",
      // alignItems: "center",
      flexDirection:'row',
      marginBottom:10,
    },
    listContainer: {
       flex:9,
      //  backgroundColor:'yellow'
    },
    sectionTitle:{
      fontSize:18,
      fontWeight:'bold',
      color:'#51AD6B',
      
      marginLeft:20,
    },
    flatListContainer: {
      paddingHorizontal: 10,
      paddingTop: 0,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    // card: {
    //   width: itemWidth,
    //   backgroundColor: '#fff',
    //   borderRadius: 10,
    //   overflow: 'hidden',
    //   elevation: 2,
    //   padding: 8,
    // },
    // image: {
    //   width: '100%',
    //   height: itemWidth,
    //   borderRadius: 8,
    // },
    // textContainer: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   alignItems: 'flex-start',
    //   marginTop: 5,
    // },
    // title: {
    //   fontSize: 14,
    //   flex: 1,
    //   fontWeight: 'bold',
    //   marginRight: 4,
    // },
    // price: {
    //   fontWeight: 'bold',
    //   fontSize: 14,
    //   marginTop: 4,
    // },
    // condition: {
    //   fontSize: 14,
    //   color: '#777',
    // },
    modalContainer : {
      flex:1,
      // justifyContent: "center",
      // alignItems: "center",
      flexDirection:'row'
    },
    modalListContainer: {
       flex:8,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    suggestionItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },


})

export default indexStyles;