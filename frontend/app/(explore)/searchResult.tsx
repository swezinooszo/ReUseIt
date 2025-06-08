import { Text, View,TextInput, FlatList, StyleSheet,Image,TouchableOpacity,ActivityIndicator,Dimensions,Modal} from "react-native";
import { useState,useEffect,useRef } from "react";
import { useRouter,useRootNavigationState, useLocalSearchParams } from "expo-router";
import CustomButton from '../components/CustomButton';
import { useAuth } from '@/context/AuthContext';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import CustomTextInputSearchIcon from "../components/CustomTextInputSearchIcon";
import CustomTextInputSearchIconEditable from "../components/CustomTextInputSearchIconEditable";

interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
}

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 30) / 2; // Adjust spacing

const searchResult = () => {

  const {query}= useLocalSearchParams<{ query: string }>();
  const [listings, setListings] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery,setSearchQuery] = useState('')
  
  const router = useRouter();
  const firstLoad = useRef(true);

    {/* Modal Search  */}
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQuery, setModalQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchListingsbyQuery = async () =>{
     if (loadingMore || !hasMore) return;
    console.log(` fetchListingsbyQuery ${searchQuery} page ${page} `)
    setLoadingMore(true);
    try {
      const response =  api.get(`/listings/query?page=${page}&limit=4&search=${searchQuery}`)
      const newItems = (await response).data;
      console.log(`newItems ${newItems} ${newItems.length}`)
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setListings(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoadingMore(false);
    }
  }

  // search listing based on param of previous main page
  useEffect(()=>{
    if(!query) return;
     setSearchQuery(query)
  },[query])

  // search listing based on search query of modal view
  useEffect(() => {
  if (!searchQuery) return;
    setPage(1);
    setHasMore(true);
    setListings([]);
  }, [searchQuery]);

  useEffect(() => {
    if (page === 1 && searchQuery) {
       if (firstLoad.current) {
          firstLoad.current = false;
          return; // skip first render
        }
      fetchListingsbyQuery();
    }
  }, [page, searchQuery]);

  // useEffect(()=>{
  //   console.log(`useEffect searchresult after setSearchQuery ${searchQuery}`)
  //   if (!searchQuery) return;
  //    console.log(` data in searchQuery ${searchQuery}`)
  //   setPage(1); // Reset page to 1 when search query changes
  //   setHasMore(true);
  //   setListings([]); // Optional: reset list on new search
  //   fetchListingsbyQuery();
  // },[searchQuery])

    {/* Modal Search  */}
    // fetchSuggestions
    useEffect(() => {
      console.log(` searchResultPage fetch suggestions ${modalQuery}`)
      const fetchSuggestions = async () => {
        if (modalQuery.trim() === '') {
          setSuggestions([]);
          return;
        }

        try {
          const res = await api.get(`/listings/suggestions?query=${modalQuery}`);
          console.log(`fetch suggestions data ${res.data}`)
          setSuggestions(res.data); // Expect array of strings
        } catch (err) {
          console.log('Error fetching suggestions:', err);
        }
      };

      fetchSuggestions();
    }, [modalQuery]);

   const onBack = () => {
    router.back()
   }

  const onPress= () => {
    setModalQuery(searchQuery)
    setModalVisible(true)
   }

  const handleSearch = (value: string) => {
    setModalVisible(false);
    setSearchQuery(value)
  };

    const renderItem = ({ item }:{item:Listing}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {
            router.push({pathname:'/(explore)/listingDetails',params:{listingId:item._id}})
      }}>
      <View>
        <Image source={{ uri: item.image[0] }} style={styles.image} />
        <View style={styles.descriptionRow}>
          <Text style={styles.description} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.condition}>{item.condition}</Text>
      </View>
      </TouchableOpacity>
    </View>
   );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreacontainer}>

            {/* Modal Search  start */}
            <Modal
                  animationType="none"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
              >
                 <SafeAreaProvider>
                <SafeAreaView style={styles.safeAreacontainer}>
                  <View style={styles.modalContainer}>
                    <View style={{flex:0.5,height:40,alignItems: 'center',justifyContent:'center'}}>
                    </View>
                    <View style={{flex:4,height:40}}>
                        <CustomTextInputSearchIconEditable value={modalQuery} onChangeText={setModalQuery} placeholder="what you are looking for?"></CustomTextInputSearchIconEditable>
                    </View>
                    <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}><Text>Cancel</Text></TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.modalListContainer}>
                      <FlatList
                        data={suggestions}
                        keyExtractor={(item, index) => `${item}-${index}`}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleSearch(item)}
                            style={styles.suggestionItem}
                          >
                            <Text>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                  </View>
                </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
            {/* Modal Search  end */}


            <View style={styles.container}>
              <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
                  <Ionicons name="chevron-back" size={24} color="black" onPress={onBack}/>
              </View>
              <View style={{flex:4,height:40}}>
                <CustomTextInputSearchIcon color='black' onPress={onPress} value={searchQuery}></CustomTextInputSearchIcon>
              </View>
              <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
              </View>
            </View>
            <View style={styles.listContainer}>
                 <FlatList
                  data={listings}
                  // keyExtractor={(item, index) => item._id || index.toString()}
                  keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  renderItem={renderItem}
                  contentContainerStyle={styles.flatListContainer}
                  onEndReached={fetchListingsbyQuery}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#888" /> : null}
                />
            </View>
        </SafeAreaView>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
   safeAreacontainer : {
      flex:1,
      flexDirection:'column',
      backgroundColor: 'white'
   },
    container : {
      flex:0.5,
      // justifyContent: "center",
      // alignItems: "center",
      flexDirection:'row'
    },
    listContainer: {
       flex:8,
      //  backgroundColor:'yellow'
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
      borderRadius: 8,
      backgroundColor:'yellow'
    },
    descriptionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    description: {
      fontSize: 14,
      flex: 1,
      marginRight: 4,
    },
    price: {
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 4,
    },
    condition: {
      fontSize: 12,
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
   
})

export default searchResult;