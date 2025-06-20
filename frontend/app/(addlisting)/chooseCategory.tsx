import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal,Image,StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Fontisto from '@expo/vector-icons/Fontisto';
import api
 from '../utils/api';
import styles from '../styles/chooseCategoryStyles';

interface Category{
  _id:string;
  name:string;
  parentId:string;
}

const chooseCategory = () => {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMainCategory,setSelectedMainCategory] = useState<Category>()
  const router = useRouter();
  const { images } = useLocalSearchParams();

  const fetchMainCategories = async () => {
    try{
        const res = api.get('/categories')
        setMainCategories((await res).data)
    }catch(error){
      console.error('Error loading messages:', error);
    }
  };

  const handleMainCategorySelect = async (mainCategory:Category) => {
    console.log(`handleMainCategorySelect ${mainCategory}`)
    setSelectedMainCategory(mainCategory); 
    const res = await api.get(`/categories/sub/${mainCategory._id}`);
    setSubCategories(res.data);
    setModalVisible(true);
  };

  const handleSubCategorySelect = (sub:Category) => {
    setModalVisible(false);
    router.push({
      pathname: '/(addlisting)/itemDetailsForm',
      params: {
        images,
        mainCategory: JSON.stringify(selectedMainCategory),
        subCategory: JSON.stringify(sub),
        // categoryId: sub.parentId,
         subCategoryId: sub._id,
      },
    });
  };

  useEffect(() => {
    fetchMainCategories();
  }, []);

  const onClose = () =>{
    router.back()
  }

   const onCloseModal = () =>{
    setModalVisible(false)
  }
  return (
      <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AntDesign name="close" size={24} color="black" onPress={onClose}/> 
        <Text style={styles.selectePhotoTitle}>Selected Photo</Text>
        <View>
            <ScrollView style={styles.mainCatScrollViewContainer} horizontal>
                {typeof images === 'string' && JSON.parse(images).map((uri: string, idx: number) => (
                    <Image key={idx} source={{ uri }} style={styles.image}  />
                ))}
            </ScrollView>
        </View>

       <Text style={styles.categoryTitle}>Choose Category</Text>
       <View style={styles.mainCategoryContainer}>
        {mainCategories.map((cat) => (
                <TouchableOpacity key={cat._id} onPress={() => { handleMainCategorySelect(cat)}}>
                <View style={styles.categoryContainer}>
                  <Fontisto name="tv" size={24} color="black" />
                  <Text style={styles.label}>{cat.name}</Text>
                </View>
                  <View style={{height:1,width:'100%',backgroundColor:'grey'}}></View>
                </TouchableOpacity>
        ))}
            
       </View>
      <Modal visible={modalVisible} animationType="slide">
         <SafeAreaProvider>
            <SafeAreaView style={styles.safeAreacontainer}>
                 <View >
                    <AntDesign name="close" size={24} color="black" onPress={onCloseModal}/> 
                    <Text style={styles.title}> {selectedMainCategory?.name}</Text>       
                </View>
                <View style={styles.subCatContainer}>
                    <ScrollView style={styles.subCatScrollViewContainer}>
                    {subCategories.map((sub) => (
                        <TouchableOpacity key={sub._id} onPress={() => handleSubCategorySelect(sub)}>
                            <View style={styles.categoryContainer}>
                            <Text style={styles.label}>{sub.name}</Text>
                            </View>
                            <View style={{height:1,width:'100%',backgroundColor:'grey'}}></View>
                        </TouchableOpacity>
                 
                    ))}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default chooseCategory