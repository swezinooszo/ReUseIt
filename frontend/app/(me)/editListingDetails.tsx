import React,{useEffect,useRef,useState,} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import styles from '../styles/listingDetailsStyles';
import { Ionicons } from '@expo/vector-icons';
import { getTimeSincePosted } from '../utils/listingDetailsUtils';
import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import ActionSheet, { SheetManager }  from "react-native-actions-sheet";
import { Button } from '@react-navigation/elements';
import ListingDetailsComponent from '../components/ListingDetailsComponent';
import { showConfirmationDialog,showAlertDialog } from '../utils/chatUtils';

const screenWidth = Dimensions.get('window').width;


interface Category {
    _id: string;
    name: string;
  parentId:string;
}

interface User {
  _id: string;
  username: string;
  email: string;
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
  subCategoryIds:Category[],
  dynamicFields?: { [key: string]: string }; // add this
  createdAt:string;
  isReserved: Boolean;
  isSold: Boolean;
}

const editListingDetails = () => {

    const { listingId } = useLocalSearchParams();
    const [listing, setListing] = useState<Listing | null>();
    const [isReserved,setIsReserved] = useState<Boolean>(false)

    //retrieve listing details based on id
    useEffect(()=>{
        console.log(`listing reserve ${listing?.isReserved}`)
        if(listing){
         setIsReserved(listing?.isReserved)
        }
    },[listing])

    useEffect(() => {
        api.get(`/listings/${listingId}`)
        .then(res => setListing(res.data))
        .catch(err => console.error(err));
        
    }, [listingId]);

  const onClose = () =>{
    console.log('onClose')
    router.back();
  }

  //***** Bottom Sheet Actions *****//
  const onEdit = () =>{
    console.log('onEditDetails')
     SheetManager.show("edit_listing_details");
  }
   // *** Edit Details ** //
  const onEditListingDetails = () => {
    console.log('onEditListingDetails')
    onCancel()
    router.push({pathname:'/(me)/editListingDetailsForm',params:{listingId: listingId,subCategoryId:listing?.subCategoryIds[0]._id}})// pass subCategoryId to easily retrieve dynamic field in constant dynamicFields variable
  }
  // *** Mark as Reserve ** //
  const onMarkAsReserve = () => {
    console.log(`onReserveListing isReserved ${isReserved}`)
    const title = isReserved ? 'Mark your item as unreserved' : 'Mark your item as reserved'
    const message = isReserved ? 'When unreserved, your item will be visible in the marketplace.' :
    'When reserved, this item will not be visible in the marketplace and you will not receive any offers.'

    showConfirmationDialog(
        title,
        message,
        () => {
        reserveListing();
        },
        () => {}
    );
  }
  // *** Mark as sold ** //
  const onMarkAsSold = () => {
     showConfirmationDialog(
        'Mark listing as Sold?',
        'You can not undo this action. This item will not be visible in the marketplace and buyers can no longer make offers for this listing',
        () => {
           soldListing();
        },
        () => {
        }
      );
  }
  // *** Delete ** //
  const onDeleteListing = () => {
    console.log('onDeleteListing')
       showConfirmationDialog(
        'Delete this listing?',
        'You can not undo this action.',
        () => {
           deleteListing();
        },
        () => {
        }
      );
  }
  // *** Cancel ** //
  const onCancel = async() => {
      console.log('onCancel')
    await SheetManager.hide("edit_listing_details");
  }


  // ** API call ***** //
  // **** reserve listing ***** //
  const reserveListing = async () =>{
     try{
        const res = await api.put(`/offers/reserve/${listingId}`,{
          isReserved: !isReserved
        })
        if(res.status == 200){
          const isReserved = res.data.listing.isReserved;
          setIsReserved(isReserved)
          if(isReserved){
             onCancel()
             router.back();
          }else{
             onCancel()
             router.back();
          }
        
        }else{
          console.log(`reserveListing not success res ${res.data}`)
        }
    }catch(error){
      console.log(`reserveListing error ${error}`)
    }
  }
  // **** sold listing ***** //
    const soldListing = async () =>{
     try{
       console.log(`soldListing  listingId ${listingId}`)
        const res = await api.put(`/offers/sold/${listingId}`)
        console.log(`soldListing res ${res.data}`)
        if(res.status == 200){
            onCancel()
            router.back();
        }else{
          console.log(`onAcceptOffer not success res ${res.data}`)
        }
    }catch(error){
      console.log(`onAcceptOffer error ${error}`)
    }
  }
 // **** Delete listing ***** //
  const deleteListing = async () => {
    try{
        const res = await api.delete(`/listings/${listingId}`)
        if(res.status == 200){
            onCancel()
            router.back();
        }else{
          console.log(`onAcceptOffer not success res ${res.data}`)
        }
    }catch(error){
      console.log(`onAcceptOffer error ${error}`)
    }
  }

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
    
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={26} color="white"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Entypo name="dots-three-vertical" size={24} color="white" />
          </TouchableOpacity>

        <ActionSheet id="edit_listing_details">
        <View>
            {
                listing?.isSold ? (
                <>
                <TouchableOpacity style={styles.actionSheetButton} onPress={onDeleteListing} >
                <Text style={[styles.actionSheetLabel,{color:'red'}]}>Delete Listing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionSheetButton} onPress={onCancel} >
                    <Text style={styles.actionSheetLabel}>Cancel</Text>
                </TouchableOpacity>
                </>
                ) :
                (
                <>
                <TouchableOpacity style={styles.actionSheetButton} onPress={onEditListingDetails} >
                    <Text style={styles.actionSheetLabel}>Edit Listing Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionSheetButton} onPress={onMarkAsReserve} >
                    <Text style={styles.actionSheetLabel}>{isReserved ? 'Mark as Unreserved' :'Mark your item as Reserved'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionSheetButton} onPress={onMarkAsSold} >
                    <Text style={styles.actionSheetLabel}>Mark as Sold</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionSheetButton} onPress={onDeleteListing} >
                    <Text style={[styles.actionSheetLabel,{color:'red'}]}>Delete Listing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionSheetButton} onPress={onCancel} >
                    <Text style={styles.actionSheetLabel}>Cancel</Text>
                </TouchableOpacity>
                </>
                )
            }
          
        </View>
        </ActionSheet>

        {/* Scrollable Listing Details content */}
        { listing && (
            <ListingDetailsComponent listing={listing}></ListingDetailsComponent>
        )
        }
      </View>
    </View>
  );
};

export default editListingDetails;
