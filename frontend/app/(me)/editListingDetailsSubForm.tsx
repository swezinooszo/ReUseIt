import { View, Text,ScrollView,Image,TouchableOpacity,TextInput,Modal,FlatList,KeyboardAvoidingView,Platform, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React,{useEffect,useState}  from 'react'
import api from '../utils/api';
import { router, useLocalSearchParams } from 'expo-router';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import styles from '../styles/editListingDetailsFormStyles';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { categoryFormFields } from '../lib/categoryFormFields';
import Camera from '../../assets/icons/camera.svg';
import Gallery from '../../assets/icons/gallery.svg';
import { takePhoto, pickImages } from '../utils/imageHelper';
import CustomButton from '../components/CustomButton';
import CustomTextInputWithText from '../components/CustomTextInputWithText';
import CustomTextInput from '../components/CustomTextInput';
import { useMemo } from 'react';
import { useListingStore } from '../utils/listingStore';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Category{
  _id:string;
  name:string;
  parentId:string;
}

interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  description: string;
  address: string;
  sellerId:User;
  categoryId:string;
  subCategoryIds: string[],
  dynamicFields?: { [key: string]: string }; // add this
  createdAt:string;
  isReserved: Boolean;
  isSold: Boolean;
}

type SelectModalState = {
  visible: boolean;
  options: string[];
  fieldKey: string;
};

const editListingDetailsSubForm = () => {
    const { setUpdatedListing } = useListingStore();
    const conditionOptions = ['Like new', 'Lightly used', 'Well used', 'Heavily used'];

    const { listing} = useLocalSearchParams();
    const [listingData, setListingData] = useState<Listing | null>();
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [conditionModalVisible, setConditionModalVisible] = useState(false);
   // const dynamicFields = categoryFormFields[listingData?.subCategoryIds[0] as keyof typeof categoryFormFields]?.fields || [];
    const dynamicFields = useMemo(() => {
    if (!listingData?.subCategoryIds?.length) return [];
    const subCatId = listingData.subCategoryIds[0];
    return categoryFormFields[subCatId as keyof typeof categoryFormFields]?.fields || [];
    }, [listingData]);

    const [selectModal, setSelectModal] = useState<SelectModalState>({ visible: false, options: [], fieldKey: '' });

    //updated listing data
    const [title,setTitle] = useState('');
    const [condition,setCondition] = useState('');
    const [price,setPrice] = useState('');
    const [description,setDescription] = useState('');


    // update listing data
     useEffect(() => {
        if(!listingData) return

        setTitle(listingData.title)
        setCondition(listingData.condition)
        setPrice(String(listingData.price))
        setDescription(listingData.description)

        // Only initialize dynamic fields if listingData is available and formData doesn't already have them
        if (listingData.dynamicFields) {
            setFormData(prev => ({
            ...prev,
            ...listingData.dynamicFields,
            }));
        }
        
    }, [listingData]);

    // retrieve listing param
    useEffect(() => {
         try {
            const param = JSON.parse(listing as string) as Listing;
            setListingData(param)
         }catch (error) {
            console.error('Failed to parse listing params:', error);
        }
    }, [listing]);


    const onBack = () =>{
        router.back()
    }


    const handleChange = (key:string, value:any) => {
        console.log(`handleChange key $${key} value ${value}`)
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const openSelectModal = (fieldKey:string, options:string[]) => {
        setSelectModal({ visible: true, options, fieldKey });
    };

    const handleOptionSelect = (option:string) => {
        handleChange(selectModal.fieldKey, option);
        setSelectModal({ visible: false, options: [], fieldKey: '' });
    };

    const onSaveListing = () =>{
         if (!listingData) return;

        const updatedListing = {
            title,
            price: Number(price),
            condition,
            description,
            dynamicFields: formData,
        };
        setUpdatedListing(updatedListing);
        router.back();
    }

  return (
       <SafeAreaProvider>
        <KeyboardAvoidingView
             style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={30} // adjust based on header height
            >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
             <AntDesign name="close" size={24} color="black" onPress={onBack}/> 
            <Text style={styles.title}>Item Details</Text>
            <View >
             <ScrollView >
                {/* show listing's static fields (title, condition, price)  */}
                   <Text style={[styles.label,{marginTop:20}]}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your listing title"
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />

                    <Text style={styles.label}>Condition</Text>
                         <TouchableOpacity
                            onPress={() => setConditionModalVisible(true)}
                            >
                            <View style={[styles.input,{flexDirection:'row', justifyContent: 'space-between',}]}>
                                <Text style={{ fontSize:16 }}>
                                    {condition}
                                </Text>
                                  <Ionicons name="chevron-down" size={20} color="#666" />
                            </View>
                    </TouchableOpacity>

                      {/* Dynamic fields */}
                        {dynamicFields.map(field => {
                            if (field.type === 'select') {
                            return (
                                <View  key={field.key}>
                                    <Text style={styles.label}>{field.label}</Text>
                                    <TouchableOpacity
                                        onPress={() => openSelectModal(field.key, field.options || [])}
                                        >
                                        <View style={[styles.input,{flexDirection:'row', justifyContent: 'space-between',}]}>
                                             <Text style={{ fontSize:16 }}>
                                                {formData[field.key] || `Select ${field.label}`}
                                            </Text>
                                             <Ionicons name="chevron-down" size={20} color="#666" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                            }

                            // Default to text input
                            return (
                                <View key={field.key}>
                                    <Text style={styles.label}>{field.label}</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={field.placeholder || field.label}
                                        value={formData[field.key] || ''}
                                        onChangeText={(text) => handleChange(field.key, text)}
                                    />
                            </View>
                           
                            );
                        })}

                         <Text style={styles.label}>Price</Text>
                         <CustomTextInputWithText borderRadius={5} prefixText="$" backgroundColor="#e5e5ea" marginTop={5}  onChangeText={(text) => setPrice(text)} value={price} placeholder="Enter Item Price"/>
                        
                        <Text style={styles.label}>Description (Optional)</Text>
                        <CustomTextInput marginTop={5} borderRadius={5} backgroundColor="#e5e5ea" onChangeText={(text) => setDescription(text)}  value={description} placeholder="Enter Item Description" multiline={true} maxLength={350} height={120}/>

                        <View style={[styles.SaveButtonContainer,{marginTop:20}]}>
                        <TouchableOpacity style={styles.SaveButton} onPress={onSaveListing}>
                            <Text style={styles.SaveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                     {/* Condition Modal */}
                    <Modal visible={conditionModalVisible} animationType="slide">
                        <SafeAreaProvider>
                        <SafeAreaView style={styles.conditionModalContainer}>
                            <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            onPress={() => setConditionModalVisible(false)}
                            />
                            <View style={styles.modalContainer}>
                            <FlatList
                                data={conditionOptions}
                                keyExtractor={(item, index) => `${item}-${index}`}
                                renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        //handleChange('condition', item);
                                        setCondition(item)
                                        setConditionModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalOption}>{item}</Text>
                                </TouchableOpacity>
                                )}
                            />
                            </View>
                        </SafeAreaView>
                           </SafeAreaProvider>
                    </Modal>

                     {/* Options Modal */}
                    <Modal visible={selectModal.visible} animationType="slide">
                            <SafeAreaView style={styles.conditionModalContainer}>
                                <View >
                                    <AntDesign name="close" size={24} color="black" onPress={() => setSelectModal({ visible: false,  options: [],   fieldKey: '',})}/>      
                                </View>
                                <View style={styles.modalContainer}>
                                    <FlatList style={styles.optionsFlatContainer}
                                        data={selectModal.options}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => handleOptionSelect(item)}>
                                            <Text style={styles.modalOption}>{item}</Text>
                                            </TouchableOpacity>
                                    )}
                                    />
                                    </View>
                                </SafeAreaView>
                    </Modal>

            </ScrollView>

        </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>
         </KeyboardAvoidingView>
        </SafeAreaProvider>
   
  )
}

export default editListingDetailsSubForm