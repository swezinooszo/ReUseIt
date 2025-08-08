import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react'
import { useState,useEffect,useRef } from "react";
import ListingCard from "../components/ListingCard";
import { saveListing } from "../utils/homeUtils";
import { showAlertDialog } from "../utils/chatUtils";
import api from '../utils/api';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { getFavoriteListings } from '../utils/meUtils';
import { getTokenAndUserId } from '../utils/listingDetailsUtils';

interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  isReserved:boolean;
  isSold:boolean;
}

const FavoriteList = () => {
        const [favorites, setFavorites] = useState<Listing[]>([]);
        const [userFavoriteIds, setUserFavoriteIds] = useState<string[]>([]);
        const [loading, setLoading] = useState(true);

      useEffect(()=>{
          const fetchUserFavorites = async () => {
            try {
                const { token, userId }  = await getTokenAndUserId();
                const listings = await getFavoriteListings(userId as string);
                console.log('fetchUserFavorites ', listings);
                setFavorites(listings);
                setUserFavoriteIds(listings.map((l: any) => l._id));
                } catch (error: any) {
                    const errMsg = error?.response?.data?.message || 'Something went wrong.';
                    //showAlertDialog( errMsg,() => { },);
                }
                finally {
                    setLoading(false);
                }
        };

            fetchUserFavorites();
      },[])

    const handleFavoritePress = async (listingId: string) => {
        try {
        await saveListing(listingId); // toggles on backend
        //const result = await api.post('/users/favorite', { listingId });

        
        // Toggle locally
        setUserFavoriteIds((prev) => {
            const already = prev.includes(listingId);
            return already
            ? prev.filter((id) => id !== listingId)
            : [...prev, listingId];
        });

        } catch (error) {
        console.error('Error toggling favorite:', error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#5FCC7D" />;
    }


  return (
    <View style={styles.container}>
        {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
             isFavorited={userFavoriteIds.includes(item._id)}
              onPress={() =>
                router.push({
                  pathname: '/(explore)/listingDetails',
                  params: { listingId: item._id },
                })
              }
              onFavoritePress={() => handleFavoritePress(item._id)}
            />
          )}
        />
      )}
    </View>
  )
}

export default FavoriteList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#999',
  },
});