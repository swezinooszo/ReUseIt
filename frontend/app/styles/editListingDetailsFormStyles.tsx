
import { StyleSheet } from "react-native";

const editListingDetailsFormStyles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        color:'white'
    },
    subContainer:{
        flex:1,
        marginTop:30
    },
    title: {
        fontSize:20,
        fontWeight:'bold',
        marginTop:30
    },
     photoMainContainer:{
        flexDirection:'row',
        marginTop:20,
        //padding:20
    },
     photoContainer:{
        width:100,
        height:80,
       // borderWidth:.5,
        borderRadius:10,
        // borderColor:'#D9D9D9',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#dcdcdc99',
    },
     imageIconlabel: {
        fontSize:12,
        textAlign:'center'
    },
    scrollViewContainer:{
        marginTop:10,
        padding:10,
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
     label: {
        fontSize:16,
        marginTop:10
    },
    labelBold: {
        fontSize:16,
        marginTop:10,
        fontWeight:'bold'
    },
     editDetailsContainer:{
       marginTop:5,
       borderWidth:1,
       borderColor:'#ccc',
       padding:10,
       borderRadius:5,
    },
    labelWithSmallPadding: {
        fontSize:16,
        marginTop:5
    },
    input: {
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5,
        padding: 15, 
        marginTop:10,
        fontSize:16,
        height:50,
        backgroundColor:'#e5e5ea'
    },
     modalContainer:{
        flex:1
    },
     modalOption: {
        padding: 15, borderBottomWidth: 1, borderColor: '#eee',
        fontSize: 16,
    },
    conditionModalContainer:{
        flex:1,
        padding:15,
        backgroundColor:'white'
    },
    optionsFlatContainer:{
        marginTop:10,
        padding:10,
    },
    EditButtonContainer:{
        alignItems:'flex-end'
    },
    EditButton: {
    flex:1,
    width:100,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5
   },
   EditText: {
      fontSize:16,
      fontWeight:'bold',
      color:'#5FCC7D'
    },
    SaveButtonContainer:{
        alignItems:'flex-end'
    },
    SaveButton: {
    flex:1,
    width:100,
    height:40,
    backgroundColor:'#5FCC7D',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5
   },
  SaveText: {
      fontSize:16,
      fontWeight:'bold',
      color:'#fff'
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
export default editListingDetailsFormStyles;