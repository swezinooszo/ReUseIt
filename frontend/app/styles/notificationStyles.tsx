import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
   container:{
      flex:1,
       // padding:20,
      backgroundColor:'#fff'
    },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  list: {
    padding: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    
  },
   itemUnread: {
    backgroundColor: '#e0e0e0', // light grey background for unread
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    flexDirection:'row',
   // backgroundColor: "pink",
    alignItems:'center'
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight:5
  },
  message: {
    color: "#555",
    fontSize: 16,
  },
  time: {
    fontSize: 14,
    color: "#999",
    fontWeight:'bold'
  },
});

export default styles