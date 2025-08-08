import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
     safeAreacontainer: {
        flex:1,
        padding:20,
        flexDirection: 'column',
        backgroundColor:'white'
    },
    reviewTitle: {
        fontSize:20,
        fontWeight:'bold',
        marginTop:20
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
    reviewLabel:{
        fontSize:14
    },
    SubmitButton: {
    height:40,
    backgroundColor:'#5FCC7D',
    alignItems:'center',
    justifyContent:'center',
    borderColor:"#fff",
    borderWidth:1,
    borderRadius:5,
    padding:5,
    marginTop:30
  },
  SubmitText: {
    fontSize:16,
    color:"#FFF",
    fontWeight:'bold'
  },
  reviewListTitle:{
      fontSize: 18,
      fontWeight:'bold',
      color:'grey'
  },
  reviewContainer:{
    flexDirection:'row',
    marginTop:30
  },
  textContainer:{
        width: 50,
        height: 50,
        marginRight:10
  },
  reviewerTitle:{
    fontSize:16,
    fontWeight:'bold'
  },
  ratingContainer:{
    flexDirection: 'row',
     marginTop: 4 
  },
   commentTitle:{
    fontSize:16,
    marginTop:10
  },
  filterButton: {
  marginHorizontal: 10,
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ccc',
  fontSize: 14,
},
activeFilter: {
  backgroundColor: '#f1c40f',
  color: '#fff',
  borderColor: '#f1c40f',
},

})

export default styles