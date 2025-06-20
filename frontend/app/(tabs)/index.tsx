import { Text, View,TextInput, FlatList, StyleSheet,Image,TouchableOpacity,ActivityIndicator,Dimensions,Modal} from "react-native";
import { useState,useEffect,useRef } from "react";
import { useRouter,useRootNavigationState } from "expo-router";
import CustomButton from '../components/CustomButton';
import { useAuth } from '@/context/AuthContext';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import CustomTextInput from "../components/CustomTextInput";
import CustomTextInputSearchIcon from "../components/CustomTextInputSearchIcon";
import CustomTextInputSearchIconEditable from "../components/CustomTextInputSearchIconEditable";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import styles from "../styles/indexStyles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Color';

interface Category {
    _id: string;
    name: string;
  parentId:string;
}

interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
}

// const screenWidth = Dimensions.get('window').width;
// const itemWidth = (screenWidth - 30) / 2; // Adjust spacing

export default function Index() {
  const colorScheme = useColorScheme(); // returns 'light' or 'dark'
  const router = useRouter();

  const [categories,setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query,setQuery] = useState('what are you looking for?');

  {/* Modal Search  */}
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQuery, setModalQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onEndReachedCalledDuringMomentum = useRef(true);


  const fetchCategories = async () => {
    try{
        const response = api.get('/categories')
        console.log(`response ${(await response).data}`);
        setCategories((await response).data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }
  const fetchListings = async () =>{
     if (loadingMore || !hasMore) return;
     console.log(`fetchListing => page  ${page}`)
    setLoadingMore(true);
    try {
      const response =  api.get(`/listings?page=${page}&limit=10`) //await axios.get(`https://your-backend.com/api/listings?page=${page}&limit=50`);
      const newItems = (await response).data;
      console.log(`fetchListing data => ${newItems}`)
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

  useEffect(()=>{
    console.log(`useEffect fetchListing`)
      fetchListings();
      fetchCategories();
  },[])

   const renderCategory = ({ item} :{item:Category}) => (
    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => callSearchResultPageCategoryId(item._id,item.name)}>
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f5f5f5',//Colors[colorScheme ?? 'light'].icon,, // You can use item.color if available
        justifyContent: 'center',
        alignItems: 'center',
      }}>
         {
        item._id === '684c8bf9e6ad394af4b0c889' ? (
          <MaterialCommunityIcons name="toaster-oven" size={40} color={Colors[colorScheme ?? 'light'].icon} />  
        ) :  item._id === '684c88bde6ad394af4b0c867'? (
          <MaterialIcons name="computer" size={24} color={Colors[colorScheme ?? 'light'].icon}   />
        ) :  item._id === '684c8b02e6ad394af4b0c873' ? (
          <FontAwesome6 name="mobile-screen-button" size={24} color={Colors[colorScheme ?? 'light'].icon}  />
        ) :(
          <MaterialIcons name="chair" size={24} color={Colors[colorScheme ?? 'light'].icon}   />
         ) 

        }
         {/* <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.name[0]}</Text> */}
      </View>
      <Text style={{ fontSize: 12, marginTop: 4,width:90,textAlign:'center' }}>{item.name}</Text>
    </TouchableOpacity>
 
  );

    const renderItem = ({ item }:{item:Listing}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {
            router.push({pathname:'/(explore)/listingDetails',params:{listingId:item._id}})
      }}>
      <View>
        <Image source={ item.image[0] ? {uri: item.image[0]} : require('../../assets/images/default_image.png')} style={styles.image} />
        <View style={styles.textContainer}>
          <View>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.condition}>{item.condition}</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="black" />
          </TouchableOpacity>
        </View>
      
      </View>

      {/* <View>
        <Image source={ item.image[0] ? {uri: item.image[0]} : require('../../assets/images/default_image.png')} style={styles.image} />
        <View style={styles.descriptionRow}>
          <Text style={styles.description} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.condition}>{item.condition}</Text>
      </View> */}
      </TouchableOpacity>
    </View>
   );

  const onSearchPress= () => {
    console.log(' onSearchPress')
    //router.push('/(explore)/searchPage')
    setModalVisible(true);
   }

  {/* Modal Search  */}
  // fetchSuggestions
  useEffect(() => {
   //console.log(`Indexfetch suggestions ${modalQuery}`)
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

  const callSearchResultPageQueryString = (value: string) => {
    setModalVisible(false);
    console.log('call ***searchResultPage****')
    router.push({ pathname: '/searchResult', params: { query: value } });
  };

   const callSearchResultPageCategoryId = (id: string,name:string) => {
    console.log(`call ***searchResultPage**** categoryId ${id} ${name}`)
    router.push({ pathname: '/searchResult', params: { categoryId: id,categoryName:name,categoryType:'main' } });
  };

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
                        <CustomTextInputSearchIconEditable value={modalQuery} onChangeText={setModalQuery}  onSubmitEditing={() => callSearchResultPageQueryString(modalQuery)}  placeholder="what you are looking for?"></CustomTextInputSearchIconEditable>
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
                            onPress={() => callSearchResultPageQueryString(item)}
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

               {/* top bar */}
              <View style={styles.container}>
                <View style={{flex:0.5,height:40,alignItems: 'center',justifyContent:'center'}}>
                    {/* <MaterialIcons name="menu" size={24} color="black" /> */}
                </View>
                <View style={{flex:4,height:40}}>
                    <CustomTextInputSearchIcon onPress = {onSearchPress} value={query} onChangeText={setQuery}></CustomTextInputSearchIcon>
                </View>
                <View style={{flex:0.5,height:40,alignItems: 'center',justifyContent:'center'}}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="black"  onPress={() => router.push('/(me)/chatlist')} />
                </View>
              </View>

               {/* Categories section */}
              {/* <View style={{padding:20,alignItems:'center'}}>
                    <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={item => item._id}
                    renderItem={renderCategory}
                    showsHorizontalScrollIndicator={false}
                  />
              </View> */}
{/* 
              <Text style={styles.sectionTitle}>Top picks</Text> */}
              <View style={styles.listContainer}>
                {/* <Text style={styles.sectionTitle}>Top picks</Text> */}
                  <FlatList
                    data={listings}
                    // keyExtractor={(item, index) => item._id || index.toString()}
                    keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={renderItem}
                    ListHeaderComponent={
                      <View style={{ paddingVertical: 10 }}>
                         <View style={{padding:20,alignItems:'center'}}>
                            <FlatList
                            horizontal
                            data={categories}
                            keyExtractor={item => item._id}
                            renderItem={renderCategory}
                            showsHorizontalScrollIndicator={false}
                          />
                      </View>
                          <Text style={styles.sectionTitle}>Top picks</Text> 
                      </View>
                    }
                    contentContainerStyle={styles.flatListContainer}
                    onEndReached={() => {
                     if(!onEndReachedCalledDuringMomentum.current){
                         fetchListings();
                         onEndReachedCalledDuringMomentum.current = true;
                      }
                     
                    }} 
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {
                      onEndReachedCalledDuringMomentum.current = false;
                    }}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#888" /> : null}
                  />
              </View>
          
        </SafeAreaView>
    </SafeAreaProvider>

  );
}