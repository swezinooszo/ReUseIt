import { StyleSheet } from "react-native";

const chatStyles = StyleSheet.create({
    safeAreacontainer: {
        flex:1,
        padding:20,
        flexDirection: 'column',
        backgroundColor:'white'
    },
    chatHeaderContainer:{
        //flex:0.5,
        height:40,
        flexDirection:'row',
    },
    chatContainer:{
        flex:1,
        marginTop:20,
        marginBottom:40
    },
    subViewContainer :{
        flex:1
    },
    chatTitleContainer:{
        flex:4,
    },
    chatTitle: {
        fontSize:16,
        fontWeight:'bold',
        textAlign:'center',
    },
    messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
    messageLeft: {
      alignSelf: 'flex-start',
      backgroundColor: '#e5e5ea',
      borderTopLeftRadius: 0,
    },

    messageRight: {
      alignSelf: 'flex-end',
      backgroundColor: '#007aff',
      borderTopRightRadius: 0,
    },

    messageText: {
      color: '#000',
      fontSize: 16,
    },

    timeStampLeft: {
      alignSelf: 'flex-start',
      borderTopLeftRadius: 0,
    },

    timeStampRight: {
      alignSelf: 'flex-end',
      borderTopRightRadius: 0,
    },

    senderText: {
      color: '#fff',
    },

    receiverText: {
      color: '#000',
    },

    timestamp: {
      fontSize: 10,
     // color: 'gray',
      marginTop: 4,
      alignSelf: 'flex-end',
    },
     messageBottomContainer:{
        //flex:1,
        height:50,
        flexDirection:'row',
        alignItems:'center'
    },
  input: {
    flex: 1,
    fontSize: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: 'white',
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    // backgroundColor: 'green',
    // borderRadius: 20,
  },
  sendButtonText: {
    fontSize:16,
    color: '#5FCC7D',
    fontWeight: 'bold',
  },
   OutlineButton: {
   //flex:1,
    width:100,
    height:40,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    borderWidth:1,
    borderColor:'grey'
  },
   OutlineText: {
    fontSize:14,
    fontWeight:'bold'
  },
   FilledButton: {
   // flex:1,
    width:100,
    height:40,
    backgroundColor:'#5FCC7D',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    padding:5
  },
  FilledText: {
    fontSize:14,
    color:"#FFF",
    fontWeight:'bold'
  },
   DisabledButton: {
   // flex:1,
    width:100,
    height:40,
    backgroundColor:'grey',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    padding:5
  },
  DisabledText: {
    fontSize:14,
    color:"#fff",
    fontWeight:'bold'
  },
   FilledReviewButton: {
   // flex:1,
    minWidth:100,
    height:40,
    backgroundColor:'#5FCC7D',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    padding:5
  },
  image:{
    width:60,
    height:60,
    borderRadius:30,
  },
  userIcon:{
    alignItems:'center',
    marginTop:50,
    marginBottom:50
  },
  SettingMainContainer: {
      flex:1,
      padding:20,
      flexDirection: 'column',
      backgroundColor:'#000'
  },
  SettingContainer:{
    alignItems:'center',
    justifyContent:'center',
    flex:1,
    backgroundColor:'#000'
  },
  SettingLabel: {
    fontSize:16,
    color:"#FFF",
    textAlign:'center'
  },
  SettingButton: {
    width:130,
    height:40,
    backgroundColor:'#000',
    alignItems:'center',
    justifyContent:'center',
    borderColor:"#fff",
    borderWidth:1,
    borderRadius:5,
    padding:5,
    marginTop:10
  },
  SettingText: {
    fontSize:16,
    color:"#FFF",
    fontWeight:'bold'
  },
})

export default chatStyles;