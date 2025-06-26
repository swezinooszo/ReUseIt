import { StyleSheet } from "react-native";

const itemReviewFormStyles = StyleSheet.create({
         container:{
        flex:1,
        padding:20,
        backgroundColor:'white'
    },
     title: {
        fontSize:20,
        fontWeight:'bold',
        marginTop:30
    },
    viewContainer:{
       // marginTop:10
    },
    label: {
        fontSize:16,
        marginTop:10
    },
    labelWithSmallPadding: {
        fontSize:16,
        marginTop:5
    },
    labelBold: {
        fontSize:16,
        marginTop:10,
        fontWeight:'bold'
    },
    imagesContainer:{
        marginTop:10,
        padding:10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', // subtle dim background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loadingImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
    loadingAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
    },

})

export default itemReviewFormStyles