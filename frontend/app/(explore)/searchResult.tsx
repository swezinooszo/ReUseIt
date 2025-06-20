import { Text, View, FlatList,Image,TouchableOpacity,
  TouchableHighlight,ActivityIndicator,Modal} from "react-native";
import { useState,useEffect,useRef, useMemo } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomButton from '../components/CustomButton';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomTextInputSearchIcon from "../components/CustomTextInputSearchIcon";
import CustomTextInputSearchIconEditable from "../components/CustomTextInputSearchIconEditable";
import MapView, { Marker,Region } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView,BottomSheetFlatList } from '@gorhom/bottom-sheet';
import CategoryFilter from "../components/CategoryFilter";
import api from '../utils/api';
import { debounce,buildQueryUrl } from "../utils/searchResultUtils";
import styles from '../styles/searchResultStyles';
import { MaterialIcons} from "@expo/vector-icons";

interface GroupedCategories {
  mainCategory: Category;
  subCategories: Category[];
}

interface Category{
  _id:string;
  name:string;
}

interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const DEFAULT_REGION = {
  latitude: 50.4452,  // Regina default
  longitude: -104.6189,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const searchResult = () => {

  const {query}= useLocalSearchParams<{ query: string }>();
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalListings,setTotalListings] = useState(0)
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery,setSearchQuery] = useState('')
  
  const onEndReachedCalledDuringMomentum = useRef(true);

  const router = useRouter();

  {/* Modal Search  */}
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQuery, setModalQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  {/* Region */}
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const snapPoints = useMemo(()=>['25%','50%','90%'],[])

  {/* Categories  */}
  const {categoryId,categoryName,categoryType}= useLocalSearchParams<{ categoryId: string,categoryName:string,categoryType:string }>();
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(categoryName || '');
  const [selectedCategoryType, setSelectedCategoryType] = useState(categoryType || '');
 
  //rebuild debounced function when searchQuery changes
  const debouncedFetchListingsByRegion = useMemo(() =>
    debounce((region: Region) => {
      fetchListingsbyQuery({ isInitial: true, region });
    }, 500),
  [searchQuery]);

    useEffect(() => {
    return () => {
      debouncedFetchListingsByRegion.cancel?.(); 
    };
  }, []);

  const fetchListingsbyQuery = async ({ isInitial = false,  region: overrideRegion = null } : { isInitial?: boolean; region?: Region | null }= {}) => {
  if (loadingMore || (!isInitial && !hasMore)) return;
    const targetPage = isInitial ? 1 : page;
    const activeRegion = overrideRegion || region; // use override if available
    setLoadingMore(true);

  try {
    const url = buildQueryUrl(targetPage, searchQuery, activeRegion,selectedCategoryId != null ? String(selectedCategoryId) : '',selectedCategoryType);
    console.log(`fetchListingsbyQuery => url  ${url}`)

    const response = await api.get(url);
    const newListings = response.data.listings;
    setTotalListings(response.data.total);
    console.log(`fetchListing data => ${newListings.length}`)
    if (isInitial) {
      setListings(newListings);
      setPage(2); // prepare for next page
      setHasMore(newListings.length > 0);
    } else {
      if (newListings.length === 0) {
        setHasMore(false);
      } else {
        setListings(prev => [...prev, ...newListings]);
        setPage(prev => prev + 1);
      }
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error);
  } finally {
    setLoadingMore(false);
  }
};


 // search listing based on category
 // search listing for one time if previous page pass category id
  useEffect(() => {
    if (!selectedCategoryId) return;
      console.log(`searchResult => useEffect fetchListing category param: ${selectedCategoryId}`)
      fetchListingsbyQuery({ isInitial: true });
  }, [categoryId]);

  const onPressCategoryApply = () =>{
      console.log(`searchResult => onPressCategoryApply ${selectedCategoryName}`)
      setModalCategoryVisible(false)
      fetchListingsbyQuery({ isInitial: true });
  }

  // search listing based on search query of modal view
  useEffect(() => {
    if (!searchQuery) return;
     console.log(`searchResult => useEffect fetchliting searchQuery ${searchQuery}`)
    fetchListingsbyQuery({ isInitial: true });
  }, [searchQuery]);

  // search listing based on param of previous main page
  useEffect(()=>{
    if(!query) return;
     setSearchQuery(query)
  },[query])

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

  //  Category
  const onShowCategoryModal = () =>{
    setModalCategoryVisible(true);
  }

  const toggleCategory = (id:string,name:string,type:string) => {
    //setSelectedCategoryId(prev => prev === id ? null : id);
    setSelectedCategoryId(prev => {
    const isSame = prev === id;
    setSelectedCategoryName(isSame ? '' : name);   // ← Set to empty string if deselecting
    return isSame ? null : id;
    });
   // setSelectedCategoryName(name);
    setSelectedCategoryType(type)
  };

  // const onCancelSelectingCategory = () =>{
  //  // setSelectedCategoryId(prev => )
  //   setModalCategoryVisible(false);
  // }
  
  useEffect(() => {
    const fetchCategories = async () =>{
      try{
        const res = await api.get('/categories/grouped')
        setGroupedCategories(res.data)
      } catch (err) {
        console.log('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

    const renderItem = ({ item }:{item:Listing}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {
            router.push({pathname:'/(explore)/listingDetails',params:{listingId:item._id}})
      }}>
      <View>
        {/* source={{ uri: item.image[0] }} */}
        <Image  style={styles.image} source={ item.image[0] ? {uri: item.image[0]} : require('../../assets/images/default_image.png')} />
        {/* <View style={styles.descriptionRow}>
          <Text style={styles.description} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.condition}>{item.condition}</Text> */}

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
      </TouchableOpacity>
    </View>
   );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreacontainer}>

            {/* Modal Categories  start */}
            <Modal
              animationType="none"
              transparent={true}
              visible={modalCategoryVisible}
              onRequestClose={() => setModalCategoryVisible(false)}
              >
                <SafeAreaProvider>
                <SafeAreaView style={styles.safeAreacontainer}>
                  <View style={styles.categoryHeaderContainer}>
                      {/* <TouchableOpacity style={styles.iconWrapper} onPress={onCancelSelectingCategory}>
                        <Ionicons name="close-sharp" size={24} color="black" />
                      </TouchableOpacity> */}
                      <View style={styles.titleWrapper}>
                      <Text style={styles.categoryTitle}>Categories</Text>
                      </View>
                      {/* <View style={styles.iconWrapper}>

                      </View> */}
                  </View>
                  <View style={{ padding: 20,flex:1 }}>
                    <FlatList
                      data={groupedCategories}
                      keyExtractor={(item) => item.mainCategory._id}
                      renderItem={({ item }:{item:GroupedCategories}) => (
                        <View style={{ marginBottom: 20 }}>
                          {/* Main Category */}
                          <TouchableHighlight style={styles.categoriesTouchableHighlight} onPress={() => toggleCategory(item.mainCategory._id,item.mainCategory.name,'main')} underlayColor="#ddd" >
                            <View style={[styles.categoriesView,{backgroundColor: selectedCategoryId === item.mainCategory._id ? '#ACE1AF' : '#E5E4E2'}]}>
                              <Text style={[styles.maincategoryText,{fontWeight:'bold'}]}>
                                {item.mainCategory.name}
                              </Text>
                            </View>
                          </TouchableHighlight>

                          {/* Children */}
                          {item.subCategories.map(sub => (
                            <View style={{paddingLeft:10}}>
                            <TouchableHighlight style={[styles.categoriesTouchableHighlight,{marginTop:5}]} key={sub._id} onPress={() => toggleCategory(sub._id,sub.name,'sub')} underlayColor="#ddd">
                              <View style={[styles.categoriesView,{backgroundColor: selectedCategoryId === sub._id ? '#ACE1AF' : '#E5E4E2'}]}>
                                <Text style={styles.subcategoryText}>
                                  {sub.name}
                                </Text>
                              </View>
                            </TouchableHighlight>
                            </View>
                          ))}
                        </View>
                      )}
                    />
                  </View>
                  <View style={{ padding: 10 }}>
                    <CustomButton fontSize={14} height={40} fontWeight='bold' marginTop={0} text="Apply" onPress={onPressCategoryApply} />
                  </View>
                </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
            {/* Modal Categories  end */}

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
                        <CustomTextInputSearchIconEditable value={modalQuery} onChangeText={setModalQuery}   onSubmitEditing={() => handleSearch(modalQuery)}  placeholder="what you are looking for?"></CustomTextInputSearchIconEditable>
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

            {/* Search Result View */}
            {/* Search bar View  */}
            <View style={styles.mainContainer}>
              <View style={styles.searchBarContainer}>
                <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" onPress={onBack}/>
                </View>
                <View style={{flex:4,height:40}}>
                  <CustomTextInputSearchIcon color='black' onPress={onPress} value={searchQuery}></CustomTextInputSearchIcon>
                </View>
                <View style={{flex:1,height:40,alignItems: 'center',justifyContent:'center'}}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" onPress={() => router.push('/(me)/chatlist')}/>
                </View>
              </View>
              <View style={{marginLeft:10,marginRight:20,marginTop:10}}>
                <CategoryFilter iconName="keyboard-arrow-down" onPress={onShowCategoryModal} text={selectedCategoryName ? selectedCategoryName : 'All Categories'}></CategoryFilter>
               
              </View>
            </View>

            {/* Map View */}
            <GestureHandlerRootView style={styles.mapContainer}>
                <MapView 
                  style={styles.map}
                  initialRegion={{
                      latitude: 50.4452,  // default to Regina
                      longitude: -104.6189,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                  }}
                  region={region}
                 //onRegionChangeComplete={setRegion} 
                  onRegionChangeComplete={(newRegion) => {
                   setRegion(newRegion);
                   debouncedFetchListingsByRegion(newRegion);
                }}
                  >

                    {
                      listings.length > 0 ? (
                        listings.map((listing) => (
                          <Marker
                            key={listing._id}
                            coordinate={{
                              latitude: listing?.location?.coordinates?.[1] ?? 0,
                              longitude: listing?.location?.coordinates?.[0] ?? 0
                            }}
                            title={listing.title} 
                              description={listing.address} 
                          >
                          </Marker>
                        ))
                      ) : (
                        null
                      )
                    }
                  </MapView>

                  {/* BottomSheet */}
                  <BottomSheet
                    index={1}
                    snapPoints={snapPoints}
                    // ref={bottomSheetRef}
                    // onChange={handleSheetChanges}
                    >
                    {/* <BottomSheetView style={styles.contentContainer}> */}
                      <Text style={styles.totalListingTitle}>{totalListings} listings</Text>
                      <BottomSheetFlatList
                        data={listings}
                        // keyExtractor={(item, index) => item._id || index.toString()}
                        keyExtractor={(item, index) => `${item._id ?? 'id'}-${index}`}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatListContainer}
                       // onEndReached={fetchListingsbyQuery}
                        onEndReached={() => {
                          console.log(`onEndReachedCalledDuringMomentum ${onEndReachedCalledDuringMomentum.current}`)
                        if(!onEndReachedCalledDuringMomentum.current){
                            //fetchListingsbyQuery();
                            fetchListingsbyQuery({ isInitial: false })
                            onEndReachedCalledDuringMomentum.current = true;
                          }
                        
                        }} 
                        onEndReachedThreshold={0.1}
                        onMomentumScrollBegin={() => {
                          onEndReachedCalledDuringMomentum.current = false;
                        }}
                        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#888" /> : null}
                      />
                    {/* </BottomSheetView> */}
                  </BottomSheet>
            </GestureHandlerRootView>
        </SafeAreaView>
    </SafeAreaProvider>

  );
}

export default searchResult;


  //   // fetch listing based on region (when user move/zoom in)
  //   const fetchListingsbyRegion = async (region?: Region) => {
  //      console.log(`fetchListingsbyRegion`);
  //       if (loadingMore || !hasMore) return;
  //       setLoadingMore(true);

  //       // set page as 1 every map region change.
  //       const fixed_page = 1;
  //       try {
  //         let url = `/listings/query?page=${fixed_page}&limit=4&search=${searchQuery}`;

  //         if (region) {
  //           const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  //           const minLat = latitude - latitudeDelta / 2;
  //           const maxLat = latitude + latitudeDelta / 2;
  //           const minLng = longitude - longitudeDelta / 2;
  //           const maxLng = longitude + longitudeDelta / 2;

  //           url += `&minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`;
  //         }

  //         const response = await api.get(url);
  //         const newItems = response.data;

  //         console.log(`fetchListingsbyRegion newItems length: ${newItems.length}`);
  //         // if (newItems.length === 0) {
  //         //   setHasMore(false);
  //         // } else {
  //         //  setListings(newItems);//always set new data for new region change
  //        //   setPage(2);//for scroll through next page.
  //        // }
  //        if (newItems.length !== 0) {
  //           setListings(newItems);
  //        }else{
  //          setListings([]);
  //        }
  //         setPage(2);
  //       } catch (error) {
  //         console.error('Failed to fetch listings:', error);
  //       } finally {
  //         setLoadingMore(false);
  //       }
  // };

  // const fetchListingsbyQuery = async () => {
  //   console.log(`fetchListingsbyQuery page ${page} searchQuery ${searchQuery}`)
  //   if (loadingMore || !hasMore) return;
  //   setLoadingMore(true);
  //   try {
  //     let url = `/listings/query?page=${page}&limit=10&search=${searchQuery}`;
  //     if (region) {
  //         const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  //         const minLat = latitude - latitudeDelta / 2;
  //         const maxLat = latitude + latitudeDelta / 2;
  //         const minLng = longitude - longitudeDelta / 2;
  //         const maxLng = longitude + longitudeDelta / 2;

  //         url += `&minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`;
  //     }

  //     const response =  api.get(url)
  //     const newlistings = (await response).data;
  //     console.log(`newlistings ${newlistings} ${newlistings.length}`)
  //     //  if (newItems.length === 0) {
  //     //   setHasMore(false);
  //     // } else {
  //     //   setListings(prev => [...prev, ...newItems]);
  //     //   setPage(prev => prev + 1);
  //     // }
      
  //     if ( page != 1 && newlistings.length === 0) {
  //           setHasMore(false);
  //     } else {
  //       setListings(prev => [...prev, ...newlistings]);
  //       setPage(prev => prev + 1);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch listings:', error);
  //   } finally {
  //     setLoadingMore(false);
  //   }
  // }

  // useEffect(() => {
  //   console.log(`searchResult => useEffect : page ${page} ,searchQuery => ${searchQuery}`)
  //   if (page === 1 && listings.length == 0 && searchQuery) {
  //     fetchListingsbyQuery();
  //   }
  // }, [page, listings, searchQuery]);