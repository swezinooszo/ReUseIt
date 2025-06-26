import { Text, View,TextInput, FlatList, StyleSheet,Image,TouchableOpacity,ActivityIndicator,Dimensions,Modal} from "react-native";
import { useState,useEffect,useRef } from "react";
import { useRouter } from "expo-router";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import CustomTextInputSearchIcon from "../components/CustomTextInputSearchIcon";
import CustomTextInputSearchIconEditable from "../components/CustomTextInputSearchIconEditable";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import styles from "../styles/indexStyles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Color';
import { RefreshControl } from 'react-native';
import ComputerTech from '../../assets/icons/computer.svg';
import HomeAppliance from '../../assets/icons/homeappliance.svg';
import Furniture from '../../assets/icons/furniture.svg';
import Phone from '../../assets/icons/phone.svg';

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
  const [refreshing, setRefreshing] = useState(false);

  const refreshListings = async () => {
    console.log(`call refreshListings`)
    setRefreshing(true);
    try {
      const response = await api.get(`/listings?page=1&limit=10`);
      setListings(response.data);
      setPage(2); // reset page to 2 for next scroll fetch
      setHasMore(true);
    } catch (error) {
      console.error('Error refreshing listings:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try{
        const response = await api.get('/categories')
        console.log(`response ${response.data}`);
        setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }
  const fetchListings = async () =>{
     if (loadingMore || !hasMore) return;
     console.log(`fetchListing => page  ${page}`)
    setLoadingMore(true);
    try {
      const response =  await api.get(`/listings?page=${page}&limit=10`)
      const newItems = response.data;
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
        backgroundColor: '#dcdcdc99',//Colors[colorScheme ?? 'light'].icon,, // You can use item.color if available
        justifyContent: 'center',
        alignItems: 'center',
      }}>
         {
        item._id === '684c8bf9e6ad394af4b0c889' ? ( // home appliance
          <HomeAppliance  width={30} height={30}></HomeAppliance>
          
        ) :  item._id === '684c88bde6ad394af4b0c867'? (// computer & tech
            <ComputerTech  width={30} height={30}></ComputerTech>
          
        ) :  item._id === '684c8b02e6ad394af4b0c873' ? ( // mobile
             <Phone  width={30} height={30}></Phone>
          
        ) :( // furniture
            <Furniture  width={30} height={30}></Furniture>
            
         ) 

        }
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
          <View style={{flex:1,}}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.condition}>{item.condition}</Text>
          </View>
          <TouchableOpacity style={{width:24}}>
            <MaterialIcons name="favorite-border" size={24} color="black" />
          </TouchableOpacity>
        </View>
      
      </View>
      </TouchableOpacity>
    </View>
   );

  const onSearchPress= () => {
    setModalVisible(true);
   }

  {/* Modal Search  */}
  // fetchSuggestions
  useEffect(() => {
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

              <View style={styles.listContainer}>
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
                    refreshing={refreshing}
                    onRefresh={refreshListings}
                    refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={refreshListings}
                      colors={['#5FCC7D']} // Android spinner color(s)
                      tintColor="#5FCC7D"   // iOS spinner color
                      //title="Refreshing..." // Optional text below spinner (iOS only)
                      //titleColor="#5FCC7D"
                    />
                  }
                  />
              </View>
          
        </SafeAreaView>
    </SafeAreaProvider>

  );
}