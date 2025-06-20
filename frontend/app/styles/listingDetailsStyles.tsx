import { StyleSheet } from "react-native";
import { Dimensions

 } from "react-native";
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const listingDetailsStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  imageList: {
    height: screenHeight * 0.5,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.5,
    resizeMode: 'cover',
  },
  scrollViewContainer: {
    //padding: 16,
    flex: 1,
   // marginBottom: 70, // space for footer
  },
   title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    marginBottom: 8,
  },
   details: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  label: {
    fontSize: 14,
    color: 'grey',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
   bottom: {
    flexDirection: 'row',
    height:100,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    gap:10,
  },
  makeOfferButton: {
    flex:1,
    height:50,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    borderWidth:1,
    borderColor:'grey'
  },
   makeOfferText: {
    fontSize:16,
    fontWeight:'bold'
  },
  ChatButton: {
    flex:1,
    height:50,
    backgroundColor:'#5FCC7D',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5
  },
  ChatText: {
      fontSize:16,
      fontWeight:'bold',
      color:'#fff'
    },

  // footer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   flexDirection: 'row',
  //   width: '100%',
  //   justifyContent: 'space-between',
  //   padding: 10,
  //   backgroundColor: '#fff',
  //   borderTopWidth: 1,
  //   borderColor: '#eee',
  // },
  // buttonOutline: {
  //   flex: 1,
  //   marginRight: 10,
  //   borderWidth: 1,
  //   borderColor: '#333',
  //   padding: 14,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  // buttonFilled: {
  //   flex: 1,
  //   backgroundColor: '#007bff',
  //   padding: 14,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  // buttonText: {
  //   color: '#333',
  //   fontWeight: '600',
  // },
  // buttonTextWhite: {
  //   color: '#fff',
  //   fontWeight: '600',
  // },
  
 dotsContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 3,
 },
 dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#ccc',
  marginHorizontal: 4,
 },
 activeDot: {
  backgroundColor: '#007bff',
 },
 backButton: {
    position: 'absolute',
    top: 40, // Adjust depending on your status bar height
    left: 16,
    zIndex: 10,
  // backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  // borderRadius: 20,
  },
  sellername:{
    fontSize: 16,
    marginTop: 5,
    color:'#6EEA8E',
    fontWeight:'bold'
  }
});

export default listingDetailsStyles;