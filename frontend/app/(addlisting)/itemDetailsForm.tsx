import { View,Text,StyleSheet,ScrollView,TextInput,TouchableOpacity,Modal,Button,
    FlatList, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback} from "react-native";
import { useState,useEffect } from "react";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useLocalSearchParams,router } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import CustomTextInput from "../components/CustomTextInput";
import CustomTextInputWithText from "../components/CustomTextInputWithText";
import { categoryFormFields } from '../lib/categoryFormFields';
import CustomButton from "../components/CustomButton";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';

interface Category{
  _id:string;
  name:string;
  parentId:string;
}

type SelectModalState = {
  visible: boolean;
  options: string[];
  fieldKey: string;
};

const itemDetailsForm = () =>{

    const {images,mainCategory,subCategory}= useLocalSearchParams();
    const {subCategoryId } = useLocalSearchParams<{subCategoryId:string}>()

    const dynamicFields = categoryFormFields[subCategoryId as keyof typeof categoryFormFields]?.fields || [];

    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [selectModal, setSelectModal] = useState<SelectModalState>({ visible: false, options: [], fieldKey: '' });

    const conditionOptions = ['Like new', 'Lightly used', 'Well used', 'Heavily used'];
    const [conditionModalVisible, setConditionModalVisible] = useState(false);
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [address,setAddress] = useState('');
    const [latitude,setLatitude] = useState<number | null>(null);
    const [longitude,setLongitude] = useState<number | null>(null);

    const onClose = () =>{
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
    
    const doneFillingForm = () => { //handleSubmit
        console.log('Submitting:', formData);
         // Navigate to review page
        router.push({
          pathname: '/(addlisting)/itemReviewForm',
          params: {
            images,
            form: JSON.stringify(formData),
            mainCategory,
            subCategory,
          },
        });
    };

    return(
          <SafeAreaProvider>
            <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={30} // adjust based on header height
            >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <AntDesign name="close" size={24} color="black" onPress={onClose}/> 
                <Text style={styles.title}>Item Details</Text>
                <View style={styles.subContainer}>
                     <ScrollView >
                        {/* Example static fields */}
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your listing title"
                            value={formData.title || ''}
                            onChangeText={(text) => handleChange('title', text)}
                        />

                        <Text style={styles.label}>Condition</Text>
                        {/* <TextInput
                            style={styles.input}
                            placeholder="Please describe your item condition"
                            value={formData.condition || ''}
                            onChangeText={(text) => handleChange('condition', text)}
                        /> */}
                        <TouchableOpacity
                            onPress={() => setConditionModalVisible(true)}
                            >
                            <Text style={[styles.input,{ color: formData.condition ? '#000' : '#aaa' }]}>
                                {formData.condition || 'Select condition'}
                            </Text>
                        </TouchableOpacity>


                        {/* Dynamic fields */}
                        {dynamicFields.map(field => {
                            if (field.type === 'select') {
                            return (
                                <View  key={field.key}>
                                    <Text style={styles.label}>{field.label}</Text>
                                    <TouchableOpacity
                                        // style={styles.selectInput}
                                        onPress={() => openSelectModal(field.key, field.options || [])}
                                        >
                                        <Text style={[styles.input,{ color: formData[field.key] ? '#000' : '#aaa' }]}>
                                        {formData[field.key] || `Select ${field.label}`}
                                        </Text>
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
                         <CustomTextInputWithText borderRadius={5} prefixText="$" backgroundColor="#e5e5ea" marginTop={5}  onChangeText={(text) => handleChange('price', text)} value={formData.price || ''} placeholder="Enter Item Price"/>
                        
                        <Text style={styles.label}>Description (Optional)</Text>
                        <CustomTextInput marginTop={5} borderRadius={5} backgroundColor="#e5e5ea" onChangeText={(text) => handleChange('description', text)}  value={formData.description || ''} placeholder="Enter Item Description" multiline={true} maxLength={350} height={120}/>

                        <Text style={styles.label}>Address Location</Text>
                        <TouchableOpacity
                            onPress={() => setAddressModalVisible(true)}
                            >
                            <Text style={[styles.input,{ color: formData.address ? '#000' : '#aaa' }]}>
                                {formData.address || 'Location'}
                            </Text>
                        </TouchableOpacity>

                        <CustomButton text="Next" height={40} onPress={doneFillingForm} borderRadius={5} ></CustomButton>

                        {/* Select modal */}
                        {/* <Modal visible={selectModal.visible}>
                            <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <FlatList
                                data={selectModal.options}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleOptionSelect(item)}>
                                    <Text style={styles.modalOption}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                />
                                <Button title="Cancel" onPress={() => setSelectModal({ visible: false,  options: [],   fieldKey: '',})} />
                            </View>
                            </View>
                        </Modal> */}

                        {/* Options Modal */}
                        <Modal visible={selectModal.visible} animationType="slide">
                            <SafeAreaProvider>
                                <SafeAreaView style={styles.container}>
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
                            </SafeAreaProvider>
                        </Modal>

                         {/* Condition Modal */}
                        <Modal visible={conditionModalVisible} animationType="slide">
                        <SafeAreaView style={styles.container}>
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
                                        handleChange('condition', item);
                                        setConditionModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalOption}>{item}</Text>
                                </TouchableOpacity>
                                )}
                            />
                            </View>
                        </SafeAreaView>
                        </Modal>
                        </ScrollView>
                        
                        
                        {/* Address Modal */}
                        <Modal visible={addressModalVisible} animationType="slide">
                        <SafeAreaView style={styles.container}>
                            <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            onPress={() => setAddressModalVisible(false)}
                            />
                            <View style={styles.modalContainer}>
                               <GooglePlacesAutocomplete
                                placeholder="Search your location"
                                minLength={2}
                                fetchDetails={true}
                                onPress={(data, details = null) => {
                                    console.log("data:", JSON.stringify(data, null, 2));
                                    console.log("details:", JSON.stringify(details, null, 2));

                                    if (!details || !details.geometry || !details.geometry.location) {
                                        console.warn("Missing location details from Google Places response");
                                        return;
                                    }

                                    // Save full address and coordinates
                                    const address = data.description;
                                    const location = details?.geometry.location;

                                    console.log("Selected address:", address);
                                    console.log("Coordinates:", location); // { lat: ..., lng: ... }
                           
                                    setAddress(address)
                                    setLongitude(location.lng)
                                    setLatitude(location.lat)
                                    // You can store them in your form state
                                }}
                                query={{
                                    key: 'AIzaSyDybKGH0IPGfRObdEpiyUeowj54u6CXJa4',
                                    language: 'en',
                                    components: 'country:ca' // optional to restrict to Canada
                                }}
                                styles={{
                                    container: {
                                    flex: 0,
                                    zIndex: 1000, // Make sure it's above other elements
                                    },
                                    listView: {
                                    backgroundColor: 'white',
                                    },
                                }}
                                // All other default props explicitly defined
                                autoFillOnNotFound={false}
                                currentLocation={false}
                                currentLocationLabel="Current location"
                                debounce={0}
                                disableScroll={false}
                                enableHighAccuracyLocation={true}
                                enablePoweredByContainer={true}
                            // fetchDetails={false}
                                filterReverseGeocodingByTypes={[]}
                                GooglePlacesDetailsQuery={{}}
                                GooglePlacesSearchQuery={{
                                rankby: 'distance',
                                type: 'restaurant',
                                }}
                                GoogleReverseGeocodingQuery={{}}
                                isRowScrollable={true}
                                keyboardShouldPersistTaps="always"
                                listUnderlayColor="#c8c7cc"
                                listViewDisplayed="auto"
                                keepResultsAfterBlur={false}
                                nearbyPlacesAPI="GooglePlacesSearch"
                                numberOfLines={1}
                                onFail={() => {}}
                                onNotFound={() => {}}
                                onTimeout={() =>
                                console.warn('google places autocomplete: request timeout')
                                }
                                predefinedPlaces={[]}
                                predefinedPlacesAlwaysVisible={false}
                                suppressDefaultStyles={false}
                                textInputHide={false}
                                textInputProps={{}}
                                timeout={20000}
                                />
                            </View>
                              <CustomButton 
                                    text="Confirm location" height={40}   
                                    onPress={() => {
                                        handleChange('address', address);
                                        handleChange('longitude', longitude);
                                        handleChange('latitude', latitude);
                                        setAddressModalVisible(false);
                                    }} 
                                    borderRadius={5} ></CustomButton>
                        </SafeAreaView>
                        </Modal>

                </View>
         </SafeAreaView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
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
export default itemDetailsForm;