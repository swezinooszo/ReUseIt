import { Text, View,KeyboardAvoidingView,Platform, FlatList, StyleSheet,Image,TouchableOpacity,ActivityIndicator,Dimensions,Modal} from "react-native";
import { useState,useEffect,useRef } from "react";
import { useRouter } from "expo-router";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import CustomTextInputSearchIcon from "../components/CustomTextInputSearchIcon";
import CustomTextInputSearchIconEditable from "../components/CustomTextInputSearchIconEditable";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import styles from "../styles/indexStyles";
import { useColorScheme } from 'react-native';
import { RefreshControl } from 'react-native';
import ComputerTech from '../../assets/icons/computer.svg';
import HomeAppliance from '../../assets/icons/homeappliance.svg';
import Furniture from '../../assets/icons/furniture.svg';
import Phone from '../../assets/icons/phone.svg';
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from '@/context/AuthContext';
import { getTokenAndUserId } from "../utils/listingDetailsUtils";
import ListingCard from "../components/ListingCard";
import { saveListing } from "../utils/homeUtils";
import { showAlertDialog } from "../utils/chatUtils";
import { getUser } from "../utils/meUtils";
import { showConfirmationDialog } from '@/app/utils/chatUtils';
import { soldListing,unReserveListing } from "@/app/utils/chatUtils";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface ListingWithBuyer {
  listing: Listing;
  buyerId: string;
}

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
  isReserved:boolean;
  isSold:boolean;
  sellerId:string;
}

export default function Index() {
  const { notification, expoPushToken, error } = useNotification();
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  const { saveExpoPushToken } = useAuth();

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

  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>(''); 
  const [promptListings, setPromptListings] = useState<ListingWithBuyer[]>([]);

  const refreshListings = async () => {
    console.log(`call refreshListings`)
    setRefreshing(true);
    try {
       // 1. Fetch new listings
      const response = await api.get(`/listings?page=1&limit=10`);
      setListings(response.data);
      setPage(2); // reset page to 2 for next scroll fetch
      setHasMore(true);

      // 2. Fetch updated user favorites
      // const user = await getUser();
      // setUserFavorites(user.favorites || []);
      // setUserId(user._id);
      fetchUserFavorites()
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

   const fetchUserFavorites = async () => {
     try {
          const response = await getUser();
          console.log('fetchUserFavorites ', `response.favorites userId ${response._id}`);
           setUserFavorites(response.favorites || []);
           setUserId(response._id);
          } catch (error: any) {
            const errMsg = error?.response?.data?.message || 'Something went wrong.';
            showAlertDialog( errMsg,() => { },);
      }
  };

  useEffect(()=>{
    console.log(`Index.tsx useEffect`)
      fetchListings();
      fetchUserFavorites();
      fetchCategories();
  },[])

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log(`Index.tsx useEffect`)
  //     fetchListings();
  //     fetchUserFavorites();
  //     fetchCategories();
  //   }, [])
  // );

  //save userId & expoPushToken to backend to show notification
  useEffect(() =>{
     console.log(`Index.tsx useEffect expoPushToken ${expoPushToken}`)
    if(!expoPushToken){return}

    const getUserId = async () =>{
      try {
        //get userId from jwt token
        const { token, userId } = await getTokenAndUserId();
        console.log(`useEffect home page userId => ${userId}`)
         //save userId & expoPushTOken to backend 
        const result = await api.post('/users/savetoken', {
              userId: userId,
              expoPushToken: expoPushToken,
        });
        //this is saved in AuthContext to clear the userId and expoPushToken from database when user log out
        saveExpoPushToken(userId as string,expoPushToken)
        console.log(`useEffect home page savetoken result => ${result.data}`)
       } catch (error) {
        console.error('Error saving push token:', error);
      }
    }

    getUserId();
  },[expoPushToken])

  const onSearchPress= () => {
    setModalVisible(true);
   }

  {/* Modal Search  */}
  // fetchSuggestions
  useEffect(() => {
      console.log(`Index.tsx useEffect modalQuery ${modalQuery}`)
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

   const handleFavorite = async (listingId:string) => {
    try {
      const result = await saveListing(listingId);
      console.log('Updated favorites:', result.favorites);

      // Update local favorite state
      setUserFavorites((prevFavorites) => {
        const isAlreadyFavorite = prevFavorites.includes(listingId);
        if (isAlreadyFavorite) {// is favorite there, remove (means user want to remove it by clicking red fav icon)
          return prevFavorites.filter((id) => id !== listingId);
        } else {
          return [...prevFavorites, listingId];
        }
      });

    } catch (error: any) {
      const errMsg = error?.response?.data?.message || 'Something went wrong.';
      showAlertDialog( error.response.data.message,() => { },);
    } 
  };

  /// *** prompt user
  useEffect(() => {
    if (!promptListings.length) return;
     console.log(`index.tsx useFocusEffect promptListings.length ${promptListings}`)
    promptListings.forEach(({ listing, buyerId }) => {

        showConfirmationDialog(
              'Confirmation',
              'Is Transaction Complete?',
              () => soldListing(listing._id as string),//subscribers.current.forEach((cb) => cb(data, 'ok')),
              () =>  unReserveListing(listing._id  as string, buyerId as string)//subscribers.current.forEach((cb) => cb(data, 'cancel'))
            );


      // // Show alert only if we haven't shown for this listing already
      // if (!alertShownFor.has(listing._id)) {
      //   showConfirmationDialog(
      //     'Confirmation',
      //     'Is Transaction Complete?',
      //     () => {
      //       soldListing(listing._id);
      //       setAlertShownFor(prev => new Set(prev).add(listing._id));
      //     },
      //     () => {
      //       unReserveListing(listing._id, buyerId);
      //       setAlertShownFor(prev => new Set(prev).add(listing._id));
      //     }
      //   );
      // }

    });
  }, [promptListings]);

  // useEffect(()=>{
  //     checkListingPrompt();
  // },[userId])

  useFocusEffect(
    useCallback(() => {
        console.log(`index.tsx useFocusEffect checkListingPrompt`)
        if(!userId) return
        checkListingPrompt();
    }, [userId])
  );

  // ** check listing prompt if user disabled notification
  const checkListingPrompt = async () => {
    try{
      console.log(`index.tsx checkListingPrompt userId ${userId}`)
      //const response = await api.get(`/listings/user/${user?._id}`);
      const res = await api.get(`/listings/promptcheck/${userId}`);
      console.log(`index.tsx checkListingPrompt res ${res}`)
      const listings: ListingWithBuyer[] = res.data.listings;
      console.log(`index.tsx checkListingPrompt listings ${listings}`)
      setPromptListings(listings || []);
    } catch (error) {
      console.error('Error saving push token:', error);
    }
 };

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
                  <KeyboardAvoidingView
                      style={{ flex: 1 }}
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      //keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // adjust based on header height
                      >
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
                       
                          {/* {
                            suggestions.length > 0 ?
                             <View style={{height:40}}>
                               <CustomText name="There are available to buy..." color="green"></CustomText>
                            </View> 
                            : <></>
                          } */}
                     
                          <FlatList
                            data={suggestions}
                            keyExtractor={(item, index) => `${item}-${index}`}
                             // Show this above the list
                              // ListHeaderComponent={
                              //   suggestions.length > 0 ? (
                              //     <View style={{ alignItems:'center' }}>
                              //       <CustomText name="There are items available to buy..." color="green" marginBottom={20} />
                              //     </View>
                              //   ) : null
                              // }
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                onPress={() => callSearchResultPageQueryString(item)}
                                style={styles.suggestionItem}
                              >
                                <Text>{item}</Text>
                              </TouchableOpacity>
                            )}
                            // Show this below the list
                            // ListFooterComponent={
                            //   suggestions.length > 0 ? (
                            //     <View style={{alignItems: 'center',justifyContent:'center', marginBottom:50}}>
                            //       <CustomText
                            //         name="List your item to sell!"
                            //         color="green"
                            //          marginTop={30}
                            //       />
                            //       <CustomButton
                            //         text="Add Listing"
                            //         height={40}
                            //         width={200}
                            //         fontWeight="bold"
                            //         onPress={listTheItem}
                            //         borderRadius={5}
                            //         backgroundColor="#5FCC7D"
                            //         marginTop={20}
                            //       />
                            //     </View>
                            //   ) : null
                            // }
                          />

                 
                          {/* {
                            suggestions.length > 0 ?
                                <View style={{height:80,}}>
                                 <CustomText name="List your item to sell!" color="green" fontSize={16}></CustomText> 
                                 <CustomButton text=" Add Listing" height={40} fontWeight="bold" onPress={listTheItem} borderRadius={5} backgroundColor="#5FCC7D" ></CustomButton>
                                </View>
                               : <></>
                          } */}
                     
                      </View>
                    </SafeAreaView>
                  </KeyboardAvoidingView>
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
                    keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                     renderItem={({ item }) => (
                        <ListingCard
                        listing={item}
                        isFavorited={userFavorites.includes(item._id)}
                        isUserListing={item.sellerId === userId} // ← Check ownership
                        onPress={() =>
                            router.push({
                            pathname: '/(explore)/listingDetails',
                            params: { listingId: item._id },
                            })
                        }
                        onFavoritePress={() => handleFavorite(item._id)}
                        />
                    )}
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