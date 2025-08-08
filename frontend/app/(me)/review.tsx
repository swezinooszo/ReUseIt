import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from '../styles/reviewStyles'
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import CustomTextInput from '../components/CustomTextInput'
import api from '../utils/api'
import axios from 'axios';
import { handleApiError } from '../utils/chatUtils'
import { router,useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'

const review = () => {

  const [comment,SetComment] = useState('')
  const [rating, setRating] = useState(0); // 0 to 5
    const { listingId='',revieweeId='',revieweeIdentify='',revieweeName='',revieweeprofileImage='' } = useLocalSearchParams();

  const onClose = () =>{
    router.back()
  }
  const onSubmit = async () =>{
    console.log(`onSubmit rating ${rating}`)
     try {
        const res = await api.post('/reviews',{
            listingId:listingId,//'688a9ec0d1fe39718361a276', 
            revieweeId:revieweeId,//'6858e2ae49a0a299e214e5fa', 
            rating:rating, 
            comment :comment
        })
        if(res.status == 200){
             console.log(`Success submitting review: ${res.data}`);
             router.push('/(tabs)/me')
        }
    } catch (error:unknown) {
        console.log('Error submitting review:', );
        handleApiError(error, 'Review submission failed');
    }
  }
  return (
     <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreacontainer}>
            <AntDesign name="close" size={24} color="black" onPress={onClose}/>
            <Text style={styles.reviewTitle}>How was your experience?</Text>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:30}}>
                <View style={styles.imageContainer}>
                    <Image
                        source={
                            revieweeprofileImage
                            ? { uri: revieweeprofileImage }
                            : 
                            require('../../assets/images/default_profile.jpg')
                        }
                        style={styles.image}
                    />
                </View>
                <Text style={{fontSize:16}}>{revieweeName}</Text>
            </View>
            <Text style={{marginTop:15,fontSize:16}}>Rate the {revieweeIdentify}</Text>
            {/* stars */}
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={32}
                        color="#f1c40f"
                        style={{ marginHorizontal: 4 }}
                    />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={{marginTop:10,fontSize:16}}>Write a review</Text>
             <CustomTextInput marginTop={5} borderRadius={5} backgroundColor="#e5e5ea" onChangeText={(text) => SetComment(text)}  value={comment} 
             placeholder="Share details about how it was like interacting with this buyer" multiline={true} maxLength={350} height={150}/>

            <TouchableOpacity style={styles.SubmitButton} onPress={onSubmit}>
              <Text style={styles.SubmitText}>Submit</Text>
            </TouchableOpacity>

        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default review