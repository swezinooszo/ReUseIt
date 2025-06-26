import { StyleSheet, Dimensions } from 'react-native';
import searchResult from '../(explore)/searchResult';

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 30) / 2;


const searchResultStyles = StyleSheet.create({
   safeAreacontainer : {
      flex:1,
      flexDirection:'column',
      backgroundColor: 'white'
   },
    mainContainer : {
     // height:100,
     marginBottom:10,
    },
    searchBarContainer : {
      //flex:0.5,
      flexDirection:'row'
    },
    mapContainer: {
      flex:9,
      backgroundColor:'yellow'
    },
    map: {
      width: '100%',
      height: '100%',
    },
    listContainer: {
       flex:4,
    },
    sectionTitle:{
      fontSize:18,
      fontWeight:'bold',
      color:'green'
    },
    flatListContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    card: {
      width: itemWidth,
      backgroundColor: '#fff',
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2,
      padding: 8,
    },
    image: {
      width: '100%',
      height: itemWidth,
      borderRadius: 8
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
    condition: {
      fontSize: 14,
      color: '#777',
    },
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
    totalListingTitle:{
      fontSize: 16,
      fontWeight:'bold',
      textAlign:'center',
      // width:'100%'
    },
    categoriesView:{
      height:35,
      borderRadius:17, 
      alignSelf: 'flex-start', 
      padding:8, 
      borderWidth:1,
      borderColor:'grey'
    },
    categoriesTouchableHighlight:{
      borderRadius:15,
      alignSelf: 'flex-start'
    },
    maincategoryText:{
      fontSize:14,
    },
     subcategoryText:{
      fontSize:12,
    },
    categoryHeaderContainer:{
      flexDirection:'row',
      marginLeft:20,
      marginRight:20,
      height:40,
      alignItems: 'center', // align icon and title centre vertically
    },
    iconWrapper: {
      width: 40, // same width as the icon to balance left/right
    },
    titleWrapper: {
     flex: 1, // fills the remaining space
     alignItems: 'center',// align text verticall
    },
    categoryTitle: {
      fontSize: 16, 
      fontWeight:'bold',
    },
    priceView:{
      backgroundColor: 'white',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3, // Android shadow
      alignSelf: 'flex-start', 
    },
     overlayCard: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5
  },
    // {backgroundColor:'white',padding:5,paddingHorizontal:10,borderWidth:1,borderColor:'gray',borderRadius:20}
   
})

export default searchResultStyles;