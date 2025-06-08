// import { useState, useEffect } from 'react';
// import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import api from '../utils/api';
// import CustomTextInputSearchIconEditable from '../components/CustomTextInputSearchIconEditable';

// interface suggestions{
//    _id: string;
//     title: string;
// }
// export default function searchPage() {
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (query.trim() === '') {
//         setSuggestions([]);
//         return;
//       }

//       try {
//         const res = await api.get(`/listings/suggestions?query=${query}`);
//         setSuggestions(res.data); // Expect array of strings
//       } catch (err) {
//         console.log('Error fetching suggestions:', err);
//       }
//     };

//     fetchSuggestions();
//   }, [query]);

//   const handleSearch = (value: string) => {
//     router.replace({ pathname: '/searchResult', params: { query: value } });
//   };

//   const onCancel = () => {
//     router.back()
//   }
//   return (
//       <SafeAreaProvider>
//           <SafeAreaView style={styles.safeAreacontainer}>
//               <View style={styles.modalContainer}>
//                 <View style={{flex:0.5,height:40,alignItems: 'center',justifyContent:'center'}}>
//                 </View>
//                 <View style={{flex:4,height:40}}>
//                     <CustomTextInputSearchIconEditable value={query} onChangeText={setQuery} placeholder="what you are looking for?"></CustomTextInputSearchIconEditable>
//                 </View>
//                 <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
//                     <TouchableOpacity onPress={onCancel}><Text>Cancel</Text></TouchableOpacity>
//                 </View>
//               </View>
//                <View style={styles.modalListContainer}>
//                   <FlatList
//                     data={suggestions}
//                     keyExtractor={(item, index) => `${item}-${index}`}
//                     renderItem={({ item }) => (
//                       <TouchableOpacity
//                         onPress={() => handleSearch(item)}
//                         style={styles.suggestionItem}
//                       >
//                         <Text>{item}</Text>
//                       </TouchableOpacity>
//                     )}
//                   />
//                </View>
//           </SafeAreaView>
//       </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   safeAreacontainer : {
//       flex:1,
//       flexDirection:'column',
//       backgroundColor: 'white'
//    },
//      modalContainer : {
//       flex:0.5,
//       // justifyContent: "center",
//       // alignItems: "center",
//       flexDirection:'row'
//     },
//     modalListContainer: {
//        flex:8,
//         paddingHorizontal: 16,
//         backgroundColor: '#fff',
//     },
//   suggestionItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
// });
