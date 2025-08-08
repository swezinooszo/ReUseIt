import { View, Text,ScrollView,Image,TouchableOpacity,TextInput,Modal,FlatList,Button } from 'react-native'
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
import { useListingStore } from '../utils/listingStore';
import { uploadAndSaveImage,compressImages } from '../utils/itemReviewFromUtils';
import LottieView from 'lottie-react-native';

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

const editListingDetailsForm = () => {
    const { updatedListing, clearUpdatedListing } = useListingStore();

    const { listingId,subCategoryId } = useLocalSearchParams();
    const [listing, setListing] = useState<Listing | null>();
    const [images,setImages] = useState<string[]>([]);
    const [mainCategoryName,setMainCategoryName] = useState<Category | null>();
    const [subCategoryName,setSubCategoryName] = useState<Category | null>();
    const [loading, setLoading] = useState(false);
    
    // retrieve and update listing data when user done editing item details on 'editListingDetailsSubForm.tsx'
    useEffect(() => {
    if (updatedListing && listing) {
        // Do something with updated listing
        setListing((prev) => {
        if (!prev) return prev;

        return {
            ...prev,
            title: updatedListing.title ?? prev.title,
            price: updatedListing.price ?? prev.price,
            condition: updatedListing.condition ?? prev.condition,
            description: updatedListing.description ?? prev.description,
            dynamicFields: updatedListing.dynamicFields ?? prev.dynamicFields,
        };
        });
        
      clearUpdatedListing(); // clear to avoid repeat application
    }
    }, [updatedListing]);

    // ***** operations to do just one time after 1st time get listing data
    // ***** so skip it after listing is updated from 'editlistingdetailssubform.tsx'
    useEffect(() => {
        if(!listing) return

        // setImages to display and handle images
        if(images.length==0) {
            setImages(listing.image)
        }

        //get MminCategory to show as label
        //if(mainCategoryName){
        console.log(`listing.categoryId._id categoryId ${listing.categoryId} subcategoryId ${listing.subCategoryIds[0]}`)
        api.get(`/categories/${listing.categoryId}`)
        .then(res =>
            { 
                console.log(`category data ${res.data}`)
                setMainCategoryName(res.data)
            }
        )
        .catch(err => console.error(err));
       // }

        //get Sub Category to show as label
       // if(subCategoryName){
        api.get(`/categories/${listing.subCategoryIds[0]}`)
        .then(res =>
            { 
                setSubCategoryName(res.data)
            }
        )
        .catch(err => console.error(err));
       // }
    }, [listing]);

    // ***** load listing
    useEffect(() => {
        api.get(`/listings/${listingId}`)
        .then(res =>
            { 
                setListing(res.data.listing)//setListing(res.data)
            }
        )
        .catch(err => console.error(err));
        
    }, [listingId]);


    const onBack = () =>{
        router.back()
    }

    // ****** Image Handling ******** ////
    const handleTakePhoto = async () => {
        const uri = await takePhoto();
        if (uri) setImages(prev => [...prev, uri]); 
    }
    const handlePickImages = async () => {
            const uris = await pickImages(true);
            if (uris) setImages(prev => [...prev, ...uris]);
    }

    const handleDeleteImage = (uriToDelete: string) => {
        setImages(prev => prev.filter(uri => uri !== uriToDelete));
    };

    const onEditListingDetails = ()=>{
        router.push({pathname:'/(me)/editListingDetailsSubForm',params:{listing:JSON.stringify(listing)}})
    }

    const uploadImagesToFirebase = async (imageUris:string[]) => {
        const uploadPromises = imageUris.map(uri => uploadAndSaveImage(uri));
        return await Promise.all(uploadPromises); // array of URLs
    }
      // submit to server
    const onSubmit = async()  =>{
        try{
            setLoading(true); // Show loading

             // Separate images into two arrays: remote URLs & local URIs
            // const imagesToFilter = images;
            const localImages = images.filter(uri => uri.startsWith('file://') || uri.startsWith('content://'));
            const remoteImages = images.filter(uri => uri.startsWith('http://') || uri.startsWith('https://'));

            // Compress local images before upload (optional)
            const compressedUris = await compressImages(localImages);
            console.log('compress image done ');

             // Upload local images and get URLs back
            const uploadedImageUrls = await uploadImagesToFirebase(compressedUris);
            console.log(`upload images to firebase done description ${uploadedImageUrls}`);

             // Combine remote URLs + newly uploaded URLs
            const finalImageUrls = [...remoteImages, ...uploadedImageUrls];

            const res = await api.put(`/listings/${listing?._id}`,{
                title: listing?.title,
                condition: listing?.condition,
                price: listing?.price,
                description: listing?.description,
                dynamicFields: listing?.dynamicFields,
                image: finalImageUrls, //uploaded URLs here
            })
            console.log(`Listing submitted successfully: images ${images[0]}`, res.data);
            router.push({pathname: '/(addlisting)/listingResult',params: { images: encodeURIComponent(JSON.stringify(finalImageUrls)),title:listing?.title,price:listing?.price,isFromEditForm:'true'}})
        }catch(error){
            console.log(`submitting server error ${error}`)
        }finally {
            setLoading(false); // Hide loading
        }
    }

  return (
       <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
             <AntDesign name="close" size={24} color="black" onPress={onBack}/> 
            <Text style={styles.title}>Edit Details</Text>
             <View style={styles.photoMainContainer}>
                    <TouchableOpacity style={[styles.photoContainer,{marginRight:10}]} onPress={handleTakePhoto}>
                        <Camera  width={30} height={30}></Camera>
                        <Text style={styles.imageIconlabel}>Take New Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.photoContainer} onPress={handlePickImages}>
                        <Gallery  width={30} height={30}></Gallery>
                        <Text style={styles.imageIconlabel}>Select from Gallery</Text>
                    </TouchableOpacity>
            </View>
            <View>
             <ScrollView >
                 {/* show listing's images  */}
                 <ScrollView style={styles.scrollViewContainer} horizontal>
                    {
                    images && ( images.map((uri: string, idx: number) => (
                    <View key={idx} style={styles.imageWrapper}>
                        <Image key={idx} source={{ uri }} style={styles.image} />
                        <TouchableOpacity
                         style={styles.deleteIcon}
                        onPress={() => handleDeleteImage(uri)}
                        >
                            <AntDesign name="closecircle" size={20} color="red" />
                        </TouchableOpacity>
                    </View>

                    ))
                    ) 
                    }
                </ScrollView>

                <Text style={[styles.labelBold,{marginTop:30}]}>Category</Text>
                <Text style={styles.label}>{`${mainCategoryName?.name} >>> ${subCategoryName?.name}`}</Text>

                <Text style={[styles.labelBold,{marginTop:20}]}>Item Details</Text>
                <View style={styles.editDetailsContainer}>
                {
                    listing && (
                            <>
                            <Text style={styles.labelWithSmallPadding}>
                                • {listing.title}
                            </Text>
                            <Text style={styles.labelWithSmallPadding}>
                                • {listing.condition}
                            </Text>
                             <Text style={styles.labelWithSmallPadding}>
                                • {`$${listing.price}`}
                            </Text>
                            { listing?.description && (
                             <Text style={styles.labelWithSmallPadding}>
                                • {`${listing?.description}`}
                            </Text>
                            )
                            }
                            </>
                    )
                    
                }
                {listing?.dynamicFields &&
                Object.entries(listing.dynamicFields).map(([key, value]) => (
                     <Text  key={key} style={styles.labelWithSmallPadding}>
                                • {`${value}`}
                    </Text>
                    // <Text key={key}>
                    // {key}: {value}
                    // </Text>
                ))}
                    <View style={styles.EditButtonContainer}>
                        <TouchableOpacity style={styles.EditButton} onPress={onEditListingDetails}>
                            <Text style={styles.EditText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <CustomButton backgroundColor='#5FCC7D' text="Submit" height={50} fontWeight='bold' onPress={onSubmit} borderRadius={5} ></CustomButton>
            </ScrollView>

        </View>
        </SafeAreaView>

         {/* loading indicator */}
        {loading && (
        <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
             <LottieView
                source={require('../../assets/animation/marketplace.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
            />
            <Text style={styles.loadingText}>We're posting your listing onto the market place</Text>
            </View>
        </View>
        )}

        </SafeAreaProvider>
   
  )
}

export default editListingDetailsForm