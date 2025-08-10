import { View,Text,StyleSheet,TouchableOpacity,ScrollView,Image} from "react-native";
import { useState } from "react";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { AntDesign } from "@expo/vector-icons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from 'expo-image-picker';
import CustomButton from "../components/CustomButton";
import {router} from "expo-router";
import styles from "../styles/addListingStyles";
import Camera from '../../assets/icons/camera.svg';
import Gallery from '../../assets/icons/gallery.svg';
import { takePhoto, pickImages } from '../utils/imageHelper';

const addListing = () => {

    const [images,setImages] = useState<string[]>([]);


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

    const next = () =>{
        setImages([]);
        router.push({pathname:'/(addlisting)/chooseCategory',params: { images: JSON.stringify(images) }})
    }
    return(
         <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    <Text style={styles.title}>Select photos for your listing</Text>
                    <View style={styles.photoMainContainer}>
                        <TouchableOpacity style={[styles.photoContainer,{marginRight:10}]} onPress={handleTakePhoto}>
                            <Camera  width={50} height={50}></Camera>
                            <Text style={styles.label}>Take New Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoContainer} onPress={handlePickImages}>
                            <Gallery  width={50} height={50}></Gallery>
                            <Text style={styles.label}>Select from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                    <ScrollView style={styles.scrollViewContainer} horizontal>
                         {images.map((uri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image key={index} source={{ uri }} style={styles.image} />
                              <TouchableOpacity
                            style={styles.deleteIcon}
                            onPress={() => handleDeleteImage(uri)}
                        >
                            <AntDesign name="closecircle" size={20} color="red" />
                        </TouchableOpacity>
                        </View>

                        ))}
                    </ScrollView>
                    </View>
                    <CustomButton text="Next" fontWeight="bold" height={50} backgroundColor='#5FCC7D' onPress={next} borderRadius={5} isVisible={images.length> 0 ? true : false}></CustomButton>
                </View>
        </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default addListing;



// import { StyleSheet, Text, View,Button,Platform, TouchableOpacity } from 'react-native'
// import React,{useState,useEffect} from 'react'
// import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import {router} from "expo-router";
// import CustomText from '../components/CustomText';
// import CustomTextInput from '../components/CustomTextInput';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import CustomButtonInput from '../components/CustomButtonInput';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import * as Notifications from 'expo-notifications';
// import api from '../utils/api';
// import { useLocalSearchParams } from "expo-router";

// // Notification Handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//     shouldShowBanner: true, // ✅ NEW (iOS)
//     shouldShowList: true,   // ✅ NEW (iOS)
//   }),
// });

// // For cross-platform compatibility
// type Mode = 'date' | 'time' | 'datetime'; // iOS and Android-compatible

// const addListing = () => {
//     const [notificationPermission, setNotificationPermission] = useState(false);

//     const [date, setDate] = useState(new Date());

//     const [showEndPicker, setShowEndPicker] = useState(false);
//     const [selectedEndDate, setSelectedEndDate] = useState('');
//     const [selectedEndTime, setSelectedEndTime] = useState('');
//     const [modeEnd, setEndMode] = useState<Mode>('date');
   
//     const [showDate, setShowDate] = useState('');
//     const [showTime, setShowTime] = useState('');

//     const {listingId='',buyerId=''} = useLocalSearchParams();

//     useEffect(() => {
//     // Request permission when component mounts
//     const requestPermission = async () => {
//       const { status } = await Notifications.requestPermissionsAsync();
//       console.log(`requestPermission ${status}`)
//       setNotificationPermission(status === 'granted');
//     };
//     requestPermission();
//     // set current as default date
//     setShowDate(new Date().toDateString())
//     setSelectedEndDate(new Date().toLocaleDateString())
//     setShowTime(new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }))
//     setSelectedEndTime(new Date().toLocaleTimeString('en-GB', { hour12: false }))
//   }, []);

//     const toggleTimePicker = () => {
//         showEndMode('time');
//         setShowEndPicker(!showEndPicker)
//     }

//     const toggleDatePicker = () => {
//         showEndMode('date');
//         setShowEndPicker(!showEndPicker)
//     }

//     const confirmIOSDate = () => {
//         console.log(`confirmIOSDate ${selectedEndDate}`)
//          if(modeEnd === 'date'){
//             setShowDate(date.toDateString())

//             setSelectedEndDate(date.toLocaleDateString());//setSelectedEndDate(date.toLocaleDateString());
//             toggleDatePicker()
//             console.log(`selectedEndDate ${date.toLocaleDateString()}`)
//          }else{
//             setShowTime(date.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }))

//             setSelectedEndTime(date.toLocaleTimeString('en-GB', { hour12: false }));
//             toggleDatePicker()
//             console.log(`selectedEndTime ${date.toLocaleTimeString()}`)
//          }
//     }

//     //end date and time
//     const onChangeEndPicker = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
//         const currentDate = selectedDate;
//         console.log(`onChangeEndPicker currentDate${currentDate}`)
//         //setShowEndPicker(false);
//          if (event.type === 'set' && currentDate) {
//             setDate(currentDate);
//              if(Platform.OS === 'android'){
//                  if(modeEnd === 'date'){
//                     setShowDate(date.toDateString())
                    
//                     toggleDatePicker()
//                     setSelectedEndDate(currentDate.toLocaleDateString()); // ✅ Only call when it's a valid Date
//                     console.log(`selectedEndDate ${currentDate.toLocaleDateString()}`)
//                 }else{
//                     setShowTime(date.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }))

//                     toggleDatePicker()
//                     setSelectedEndTime(currentDate.toLocaleTimeString('en-GB', { hour12: false }));
//                     console.log(`selectedEndTime ${currentDate.toLocaleTimeString()}`)
//                 }
//              }
           
//         }else{
//             toggleDatePicker()
//         }
//     };

//     const showEndMode = (currentMode: Mode) => {
//         setShowEndPicker(true);
//         setEndMode(currentMode);
//     };

//     const onClose = () =>{
//           router.back();
//     }


//     const scheduleReservationEndNotification = async (endDate: Date) => {
//      if (!notificationPermission) {
//       console.warn('Notification permission not granted');
//       return;
//      }

//     if (isNaN(endDate.getTime())) {
//       console.error('Invalid reservation end date. Aborting notification scheduling.');
//       return;
//     }

//     try {
//       const now = new Date();
//       const secondsUntilEnd = Math.max(1, Math.floor((endDate.getTime() - now.getTime()) / 1000));

//       let trigger;

//       if (Platform.OS === 'ios') {
//         trigger = {
//           type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
//           year: endDate.getFullYear(),
//           month: endDate.getMonth() + 1,
//           day: endDate.getDate(),
//           hour: endDate.getHours(),
//           minute: endDate.getMinutes(),
//           second: 0,
//           repeats: false,
//         } as Notifications.CalendarTriggerInput;  // <-- cast here
//       } else {
//         trigger = {
//           type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//           seconds: secondsUntilEnd,
//           repeats: false,
//         } as Notifications.TimeIntervalTriggerInput;  // <-- cast here
//       }

//       //2.reserve the listing
//       const result = await reserveListing(true,endDate)

//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: 'Reservation Period Ended',
//           body: 'Your reserved item time has expired.',
//           sound: 'default',
//           data: { type: 'reservationEnded', reservationId: '123',listingId:listingId,buyerId:buyerId },
//         },
//         trigger,
//       });

//       console.log('Notification successfully scheduled for:', endDate.toString());
//       //after that should alert about schedule successfully and click 'ok' and go to explore page
//       router.push('/(me)/reservationTimingResult');
//     } catch (error) {
//       console.error('Error scheduling notification:', error);
//     }
// };

// const onConfirmReservation = () => {
//     if (!selectedEndDate || !selectedEndTime) {
//       console.warn('Please select both end date and time.');
//       return;
//     }

//     const reservationEndDateTime = buildISODateTime(selectedEndDate, selectedEndTime);//new Date(`${selectedEndDate} ${selectedEndTime}`);
//     console.log(`reservationEndDateTime after buildISODateTime ${reservationEndDateTime}`)
//     if (reservationEndDateTime <= new Date()) {
//       console.warn('End time must be in the future.');
//       return;
//     }
//     //1.schedule the reserved time
//     scheduleReservationEndNotification(reservationEndDateTime);
//   };

//   const buildISODateTime = (dateStr: string, timeStr: string) => {
//       console.log(`buildISODateTime dateStr ${dateStr} timeStr ${timeStr}`)
//         if (Platform.OS === 'android') {
//           // Convert '12:27:00 p.m.' → '12:27:00 PM'
//           const cleanedTime = timeStr.replace(' ', '').replace('p.m.', 'PM').replace('a.m.', 'AM');
//           console.log(`buildISODateTime cleanedTime ${cleanedTime}`)
//           return new Date(`${dateStr}T${cleanedTime}`);
//         } else {
//           const [day, month, year] = dateStr.split('/').map((part) => parseInt(part, 10));
//           const [hours, minutes, seconds = 0] = timeStr.split(':').map((part) => parseInt(part, 10));

//           if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
//             console.error('Invalid date or time components:', { day, month, year, hours, minutes, seconds });
//             return new Date(NaN);
//           }

//           return new Date(year, month - 1, day, hours, minutes, seconds);
//       }
// };

// // ** reserve listing
//   const reserveListing = async (isNotificationDisabled:boolean,reservationPeriod:Date) =>{
//      try{
//        console.log(`reserveListing  listingId ${listingId} reservationPeriod${reservationPeriod}`)
//         // const res = await api.put(`/offers/reserve/${listingId}`,{
//         //   isReserved: true
//         // })
//         const res = await api.put(`/offers/reserve`,{
//           isReserved: true,
//           listingId: listingId,
//           //buyerId : buyerId,//
//           isNotificationDisabled : isNotificationDisabled,
//           reservationPeriod: reservationPeriod
//         });
//         if(res.status == 200){
//           console.log(`reserveListing respone ${res.data.listing.isReserved}`)
//         }else{
//           console.log(`reserveListing not success res ${res.data}`)
//         }
//       }catch(error){
//         console.log(`reserveListing error ${error}`)
//       }
//   }

//   return (
//     <SafeAreaProvider>
//         <SafeAreaView style={styles.container}>
//             <View style={styles.headerContainer}>
//                   <View  style={styles.subContainer}>
//                     <AntDesign name="close" size={24} color="black" onPress={onClose}/>
//                   </View>
//                   <View  style={styles.titleContainer}>
//                   </View>
//                   <View  style={styles.subContainer}>
//                   </View>
//             </View>
//             <View style={styles.mainContainer}>
            
//             <CustomText name='This item will be reserved for a limited time.' marginTop={50} flex={0}></CustomText>
          
//             <CustomText name='Select Reservation End date and Time'fontSize={16}  marginTop={20}  flex={0}></CustomText>
//             <View style={{flexDirection:'row',marginTop:30}}>
//                 {
//                 //    !showEndPicker && (
//                         <CustomButtonInput label='date' onPress={toggleDatePicker} value={showDate}  width={200}>
//                         </CustomButtonInput>
//                     // )
//                 }
             
//                 {
//                     // !showEndPicker && (
//                         <CustomButtonInput label='time' onPress={toggleTimePicker} value={showTime}  width={120}>
//                         </CustomButtonInput>
//                     // )
//                 }
              
//             </View>

        

//                   {showEndPicker && Platform.OS === 'android' && (
//                     <DateTimePicker
//                     testID="dateTimePicker1"
//                     mode={modeEnd}
//                     display='spinner'
//                     value={date}
//                     is24Hour={true}
//                     onChange={onChangeEndPicker}
//                     style = {styles.datepicker}
//                     />
//                   )} 

//                   {
//                     showEndPicker && Platform.OS === "ios" && (
//                          <View style={styles.iosPickerModal}>
//                             <DateTimePicker
//                             testID="dateTimePicker1"
//                             mode={modeEnd}
//                             display='spinner'
//                             value={date}
//                             is24Hour={true}
//                             onChange={onChangeEndPicker}
//                             style = {styles.iosDatePicker}
//                             />

//                             <View
//                                 style={{flexDirection:'row', justifyContent:'space-around'}}>
//                                 <TouchableOpacity style={[styles.button,
//                                                         styles.pickerbutton,
//                                                         {backgroundColor:"#11182711"}]}
//                                                         onPress={toggleDatePicker}>
//                                     <Text style={[styles.buttonText,{color:'#075985'}]}>Cancel</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity style={[styles.button,
//                                                         styles.pickerbutton,]}
//                                                         onPress={confirmIOSDate}>
//                                     <Text style={[styles.buttonText]}>Confirm</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     )
//                   }
//             </View>

//               {/* <Button title="Confirm Reservation" onPress={onConfirmReservation} /> */}
//             <TouchableOpacity style={styles.ReserveButton} onPress={onConfirmReservation}>
//               <Text style={styles.ReserveText}>Confirm Reservation</Text>
//             </TouchableOpacity>

//         </SafeAreaView>
//     </SafeAreaProvider>

//   )
// }

// export default addListing

// const styles = StyleSheet.create({
//      container:{
//         flex: 1,
//         padding: 20,
//     },
//     headerContainer:{
//         flex:0.5,
//         flexDirection:'row',
//     },
//     mainContainer:{
//         flex:9.5,
//         //backgroundColor:'pink',
//     },
//      subContainer :{
//         flex:1
//     },
//      titleContainer:{
//         flex:4,
//     },
//      title: {
//         fontSize:18,
//         fontWeight:'bold',
//         textAlign:'center',
//     },
//     datepicker:{
//         height:120,
//         marginTop:-10,
//     },
//     button:{
//         height:50,
//         justifyContent:"center",
//         alignItems:'center',
//         borderRadius:50,
//         marginTop:10,
//         marginBottom:15,
//         backgroundColor:'#075985'
//     },
//     buttonText:{
//         fontSize:14,
//         fontWeight:"500",
//         color:"#fff"
//     },
//     pickerbutton:{
//         paddingHorizontal:20,
//     },
//     iosPickerModal: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingTop: 10,
//         paddingBottom: 20,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: -2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 10,
//     },
//     iosDatePicker: {
//     height: 180,
//     },
// ReserveButton: {
//     //flex:1,
//     height:50,
//     backgroundColor:'#5FCC7D',
//     alignItems:'center',
//     justifyContent:'center',
//     borderRadius:5
//   },
//   ReserveText: {
//       fontSize:16,
//       fontWeight:'bold',
//       color:'#fff'
//     },
// })







// import { StyleSheet, Text, View,Button,Platform } from 'react-native'
// import React,{useState,useEffect} from 'react'
// import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
// import {router} from "expo-router";
// import CustomText from '../components/CustomText';
// import CustomTextInput from '../components/CustomTextInput';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import CustomButtonInput from '../components/CustomButtonInput';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import * as Notifications from 'expo-notifications';
// import api from '../utils/api';
// import { useLocalSearchParams } from "expo-router";

// // Notification Handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//     shouldShowBanner: true, // ✅ NEW (iOS)
//     shouldShowList: true,   // ✅ NEW (iOS)
//   }),
// });

// // For cross-platform compatibility
// type Mode = 'date' | 'time' | 'datetime'; // iOS and Android-compatible

// const addListing = () => {
//     const [notificationPermission, setNotificationPermission] = useState(false);

//     const [date, setDate] = useState(new Date(1598051730000));
//     const [selectedStartDate, setSelectedStartDate] = useState('2025-07-18');
//     const [selectedStartTime, setSelectedStartTime] = useState('12:26:00 p.m.');
//     const [modeStart, setStartMode] = useState<Mode>('date');
//     const [showStartPicker, setShowStartPicker] = useState(false);

//     const [selectedEndDate, setSelectedEndDate] = useState('2025-07-18');
//     const [selectedEndTime, setSelectedEndTime] = useState('12:27:00 p.m.');
//     const [modeEnd, setEndMode] = useState<Mode>('date');
//     const [showEndPicker, setShowEndPicker] = useState(false);

//     const {listingId='',buyerId=''} = useLocalSearchParams();

//     useEffect(() => {
//     // Request permission when component mounts
//     const requestPermission = async () => {
//       const { status } = await Notifications.requestPermissionsAsync();
//       console.log(`requestPermission ${status}`)
//       setNotificationPermission(status === 'granted');
//     };
//     requestPermission();
//   }, []);

//     //start date and time
//     const onChangeStartPicker = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
//         const currentDate = selectedDate;
//         setShowStartPicker(false);
//          if (event.type === 'set' && currentDate) {
//             if(modeStart === 'date'){
//              setSelectedStartDate(currentDate.toLocaleDateString()); // ✅ Only call when it's a valid Date
//              console.log(`selectedStartDate ${currentDate.toLocaleDateString()}`)
//             }else{
//              setSelectedStartTime(currentDate.toLocaleTimeString()); 
//             console.log(`selectedStartTime ${currentDate.toLocaleTimeString()}`)
//             }
//         }
//         //setDate(currentDate);
//     };

//     const showStartMode = (currentMode: Mode) => {
//         setShowStartPicker(true);
//         setStartMode(currentMode);
//     };

//     const showStartDatepicker = () => {
//         showStartMode('date');
//     };

//     const showStartTimepicker = () => {
//         showStartMode('time');
//     };

//     //end date and time
//     const onChangeEndPicker = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
//         const currentDate = selectedDate;
//         setShowEndPicker(false);
//          if (event.type === 'set' && currentDate) {
//             if(modeEnd === 'date'){
//              setSelectedEndDate(currentDate.toLocaleDateString()); // ✅ Only call when it's a valid Date
//              console.log(`selectedEndDate ${currentDate.toLocaleDateString()}`)
//             }else{
//             // setSelectedEndTime(currentDate.toLocaleTimeString()); 
//             setSelectedEndTime(currentDate.toLocaleTimeString('en-GB', { hour12: false }));
//             console.log(`selectedEndTime ${currentDate.toLocaleTimeString()}`)
//             }
//         }
//     };

//     const showEndMode = (currentMode: Mode) => {
//         setShowEndPicker(true);
//         setEndMode(currentMode);
//     };

//     const showEndDatepicker = () => {
//         showEndMode('date');
//     };

//     const showEndTimepicker = () => {
//         showEndMode('time');
//     };

//     const onClose = () =>{
//           router.back();
//     }


//     const scheduleReservationEndNotification = async (endDate: Date) => {
//      if (!notificationPermission) {
//       console.warn('Notification permission not granted');
//       return;
//      }

//     if (isNaN(endDate.getTime())) {
//       console.error('Invalid reservation end date. Aborting notification scheduling.');
//       return;
//     }

//     try {
//       const now = new Date();
//       const secondsUntilEnd = Math.max(1, Math.floor((endDate.getTime() - now.getTime()) / 1000));

//       let trigger;

//       if (Platform.OS === 'ios') {
//         trigger = {
//           type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
//           year: endDate.getFullYear(),
//           month: endDate.getMonth() + 1,
//           day: endDate.getDate(),
//           hour: endDate.getHours(),
//           minute: endDate.getMinutes(),
//           second: 0,
//           repeats: false,
//         } as Notifications.CalendarTriggerInput;  // <-- cast here
//       } else {
//         trigger = {
//           type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//           seconds: secondsUntilEnd,
//           repeats: false,
//         } as Notifications.TimeIntervalTriggerInput;  // <-- cast here
//       }

//       //2.reserve the listing
//       const result = await reserveListing(true,endDate)

//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: 'Reservation Period Ended',
//           body: 'Your reserved item time has expired.',
//           sound: 'default',
//           data: { type: 'reservationEnded', reservationId: '123',listingId:listingId,buyerId:buyerId },
//         },
//         trigger,
//       });

//       console.log('Notification successfully scheduled for:', endDate.toString());
//       //after that should alert about schedule successfully and click 'ok' and go to explore page
//       router.push('/(me)/reservationTimingResult');
//     } catch (error) {
//       console.error('Error scheduling notification:', error);
//     }
// };

// const onConfirmReservation = () => {
//     if (!selectedEndDate || !selectedEndTime) {
//       console.warn('Please select both end date and time.');
//       return;
//     }

//     const reservationEndDateTime = buildISODateTime(selectedEndDate, selectedEndTime);//new Date(`${selectedEndDate} ${selectedEndTime}`);
//     console.log(`reservationEndDateTime after buildISODateTime ${reservationEndDateTime}`)
//     if (reservationEndDateTime <= new Date()) {
//       console.warn('End time must be in the future.');
//       return;
//     }
//     //1.schedule the reserved time
//     scheduleReservationEndNotification(reservationEndDateTime);
//   };

//   const buildISODateTime = (dateStr: string, timeStr: string) => {
//       console.log(`buildISODateTime dateStr ${dateStr} timeStr ${timeStr}`)
//         if (Platform.OS === 'android') {
//           // Convert '12:27:00 p.m.' → '12:27:00 PM'
//           const cleanedTime = timeStr.replace(' ', '').replace('p.m.', 'PM').replace('a.m.', 'AM');
//           console.log(`buildISODateTime cleanedTime ${cleanedTime}`)
//           return new Date(`${dateStr}T${cleanedTime}`);
//         } else {
//           const [day, month, year] = dateStr.split('/').map((part) => parseInt(part, 10));
//           const [hours, minutes, seconds = 0] = timeStr.split(':').map((part) => parseInt(part, 10));

//           if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
//             console.error('Invalid date or time components:', { day, month, year, hours, minutes, seconds });
//             return new Date(NaN);
//           }

//           return new Date(year, month - 1, day, hours, minutes, seconds);
//       }
// };

// // ** reserve listing
//   const reserveListing = async (isNotificationDisabled:boolean,reservationPeriod:Date) =>{
//      try{
//        console.log(`reserveListing  listingId ${listingId} reservationPeriod${reservationPeriod}`)
//         // const res = await api.put(`/offers/reserve/${listingId}`,{
//         //   isReserved: true
//         // })
//         const res = await api.put(`/offers/reserve`,{
//           isReserved: true,
//           listingId: listingId,
//           //buyerId : buyerId,//
//           isNotificationDisabled : isNotificationDisabled,
//           reservationPeriod: reservationPeriod
//         });
//         if(res.status == 200){
//           console.log(`reserveListing respone ${res.data.listing.isReserved}`)
//         }else{
//           console.log(`reserveListing not success res ${res.data}`)
//         }
//       }catch(error){
//         console.log(`reserveListing error ${error}`)
//       }
//   }

//   return (
//     <SafeAreaProvider>
//         <SafeAreaView style={styles.container}>
//             <View style={styles.headerContainer}>
//                   <View  style={styles.subContainer}>
//                     <AntDesign name="close" size={24} color="black" onPress={onClose}/>
//                   </View>
//                   <View  style={styles.titleContainer}>
//                   </View>
//                   <View  style={styles.subContainer}>
//                   </View>
//             </View>
//             <View style={styles.mainContainer}>
            
//             <CustomText name='This item will be reserved for a limited time.' marginTop={50} flex={0}></CustomText>
//             <CustomText name='Select start date and time'fontSize={16}  marginTop={30}  flex={0}></CustomText>
//             <View style={{flexDirection:'row'}}>
//                 <CustomButtonInput label='date' onPress={showStartDatepicker}  value={selectedStartDate} width={200}>
//                 </CustomButtonInput>
//                 <CustomButtonInput label='time' onPress={showStartTimepicker} value={selectedStartTime}  width={120}>
//                 </CustomButtonInput>
//             </View>
//             <CustomText name='Select end date and time'fontSize={16}  marginTop={20}  flex={0}></CustomText>
//             <View style={{flexDirection:'row'}}>
//                 <CustomButtonInput label='date' onPress={showEndDatepicker} value={selectedEndDate}  width={200}>
//                 </CustomButtonInput>
//                 <CustomButtonInput label='time' onPress={showEndTimepicker} value={selectedEndTime}  width={120}>
//                 </CustomButtonInput>
//             </View>

//                 {showStartPicker && (
//                     <DateTimePicker
//                     testID="dateTimePicker"
//                     value={date}
//                     mode={modeStart}
//                     is24Hour={true}
//                     onChange={onChangeStartPicker}
//                     />
//                 )}

//                   {showEndPicker && (
//                     <DateTimePicker
//                     testID="dateTimePicker1"
//                     value={date}
//                     mode={modeEnd}
//                     is24Hour={true}
//                     onChange={onChangeEndPicker}
//                     />
//                 )}
//             </View>

//               <Button title="Confirm Reservation" onPress={onConfirmReservation} />
//         </SafeAreaView>
//     </SafeAreaProvider>

//   )
// }

// export default addListing

// const styles = StyleSheet.create({
//      container:{
//         flex: 1,
//         padding: 20,
//     },
//     headerContainer:{
//         flex:0.5,
//         flexDirection:'row',
//     },
//     mainContainer:{
//         flex:9.5,
//         //backgroundColor:'pink',
//     },
//      subContainer :{
//         flex:1
//     },
//      titleContainer:{
//         flex:4,
//     },
//      title: {
//         fontSize:18,
//         fontWeight:'bold',
//         textAlign:'center',
//     },
// })