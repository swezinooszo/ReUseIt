import { Alert } from 'react-native';
import api from '../utils/api';
  import axios from 'axios';

export const showConfirmationDialog = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: onCancel || (() => {}),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: onConfirm,
      },
    ],
    { cancelable: true }
  );
};

export const showAlertDialog = (
  //title: string,
  message: string,
  onConfirm: () => void,
) => {
  Alert.alert(
    'ReUseIt',
    message,
    [
      {
        text: 'OK',
        onPress: onConfirm,
      },
    ],
    { cancelable: true }
  );
};

//  export const soldListing = async (listingId:string) =>{
//      try{
//        console.log(`soldListing  listingId ${listingId}`)
//         const res = await api.put(`/offers/sold/${listingId}`)
//         console.log(`soldListing res ${res.data}`)
//         if(res.status == 200){
//           console.log(`soldListing success res ${res.data}`)
//         }else{
//           console.log(`soldListing not success res ${res.data}`)
//         }
//     }catch(error){
//       console.log(`soldListing error ${error}`)
//     }
//   }

  export const soldListing = async (listingId: string): Promise<boolean> => {
  try {
    console.log(`soldListing - listingId: ${listingId}`);
    const res = await api.put(`/offers/sold/${listingId}`);
    console.log(`soldListing response:`, res.data);

    return true;
    // if (res.status === 200) {
    //   console.log(`soldListing success`);
    //   return true;
    // } 
    // else {
    //   console.warn(`soldListing failed with status: ${res.status}`);
    //   return false;
    // }
  } catch (error) {
    //console.error(`soldListing error:`, error);
    handleApiError(error, 'soldListing failed');
    return false;
  }
};

  export const unReserveListing = async (listingId:string,buyerId:string): Promise<boolean> =>{
     try{
       console.log(`unReserveListing  listingId ${listingId}`)
     
         const res = await api.put(`/offers/reserve`,{
          isReserved: false,
          listingId: listingId,
          buyerId : buyerId// buyerId needed when unreserve to delete the accepted offer (from buyer) from offer table
        });
        return true;
        // if(res.status == 200){
        //   console.log(`unReserveListing respone ${res.data.listing.isReserved}`)
        //   return true
        // }else{
        //   console.log(`unReserveListing not success res ${res.data}`)
        //   return false
        // }
      }catch(error){
       // console.log(`unReserveListing error ${error}`)
        handleApiError(error, 'unReserveListing failed');
        return false
      }
  }

  export const markAsRead = async (chatId:string,currentUserId:string) => {
    try {
     // console.log(`Chat markAsRead method: chatId ${chatId} currentUserId ${currentUserId}`)
      // await api.put(`/chats/read/${chatIdParam}`, { userId: currentUserId });
      await api.put(`/chats/read/${chatId}`, { userId: currentUserId });
      return true;
    } catch (error) {
      console.log("Failed to mark chat as read", error);
      return false;
    }
  };

export function handleApiError(error: unknown, defaultMessage = 'Something went wrong') {
  if (axios.isAxiosError(error) && error.response) {
    const message = error.response.data?.message || defaultMessage;
    //console.error('API Error:', message);
    alert(message); // or return it instead, depending on your design
  } else {
    //console.error('Unexpected Error:', error);
    alert(defaultMessage);
  }
}

export const checkIfReviewExists = async(listingId: string,revieweeId:string ) => {
   try {
        const res = await api.get(`/reviews/exists?listingId=${listingId}&revieweeId=${revieweeId}`)
        console.log(`checkIfReviewExists response ${res.data.exists}`)
        return res.data.exists;
    } catch (error) {
      handleApiError(error, 'checkIfReviewExists failed');
    }
}