// components/ListingCard.tsx

import React from 'react';
import styles from '../styles/meStyles';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface Listing {
  _id: string;
  image: string[];
  title: string;
  price: number;
  condition: string;
  isReserved: boolean;
  isSold: boolean;
}

interface ListingCardProps {
  listing: Listing;
  onPress?: (event: GestureResponderEvent) => void;
  onFavoritePress?: () => void;
  isFavorited?: boolean;
  isUserListing?: boolean; // ← New
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onPress,
  onFavoritePress,
  isFavorited,
  isUserListing// ← New
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity 
      onPress={onPress}
      >
        <View>
          <View style={{ position: 'relative' }}>
            <Image
              source={
                listing.image[0]
                  ? { uri: listing.image[0] }
                  : require('../../assets/images/default_image.png')
              }
              style={styles.imageCard}
            />
            {listing.isReserved && !listing.isSold && (
              <Text style={styles.reservedItem}>RESERVED</Text>
            )}
            {listing.isSold && <Text style={styles.soldItem}>SOLD</Text>}
          </View>

          <View style={styles.textContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={2}>
                {listing.title}
              </Text>
              <Text style={styles.price}>${listing.price}</Text>
              <Text style={styles.condition}>{listing.condition}</Text>
            </View>

            {isUserListing ? (
              <View style={{ opacity: 0.4 }}>
                <MaterialIcons name="favorite" size={24} color="gray" />
              </View>
            ) : (
              <TouchableOpacity onPress={onFavoritePress}>
                <MaterialIcons
                  name={isFavorited ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={isFavorited ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            )}

            {/* <TouchableOpacity onPress={onFavoritePress}>
              <MaterialIcons name={
                //isFavorited ? "favorite" : "favorite-border"
                 isUserListing
                ? 'favorite' // Solid icon, grey color
                : isFavorited
                ? 'favorite'
                : 'favorite-border'
                } size={24} color={
                  //isFavorited ? "red" : "gray"
                    isUserListing
                    ? 'gray'
                    : isFavorited
                    ? 'red'
                    : 'gray'
                  } />
            </TouchableOpacity> */}

          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ListingCard;
