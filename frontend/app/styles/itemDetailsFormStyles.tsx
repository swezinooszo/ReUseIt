import { StyleSheet } from "react-native"

const itemDetailsFormStyles = StyleSheet.create({
    container:{
        flex:1,
        padding:15,
        backgroundColor:'white'
    },
    title: {
        fontSize:20,
        fontWeight:'bold',
        marginTop:20
    },
    subContainer:{
        flex:1,
        marginTop:30
    },
    label: {
        fontSize:16,
        marginTop:10
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
    selectInput: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        padding: 12, marginBottom: 12, justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center',
    },
     modalContainer:{
        flex:1
    },
    optionsFlatContainer:{
        marginTop:10,
        padding:10,
    },
    modalOption: {
        padding: 15, borderBottomWidth: 1, borderColor: '#eee',
        fontSize: 16,
    },
})

export default itemDetailsFormStyles