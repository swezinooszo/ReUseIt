import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/meStyles';
import { getUserExperience } from '../utils/meUtils';

type ProfileCardProps = {
  user: {
    _id: string;
    username: string;
    createdAt: string;
    profileImage?: string;
  };
  listingCount?: number;
  averageRating: number;
  reviewCount: number;
  onProfilePicChange?: () => void;
  onReviewClicked?: () => void;
  isListingCountDisable?:boolean
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  listingCount,
  averageRating,
  reviewCount,
  onProfilePicChange,
  onReviewClicked,
  isListingCountDisable = false
}) => {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.imageContainer} onPress={onProfilePicChange}>
        <Image
          source={
            user?.profileImage
              ? { uri: user.profileImage }
              : require('../../assets/images/default_profile.jpg')
          }
          style={styles.image}
        />
      </TouchableOpacity>

      <View style={styles.UserInfoContainer}>
        <View style={styles.userTitleContainer}>
          <Text style={styles.usernameTitle}>{user?.username}</Text>
        </View>

        <View style={styles.profileTextMainContainer}>
          {/* Ratings */}
          <View style={styles.profileTextContainer}>
            {averageRating === 0 ? (
              <Text style={styles.reviewsTitle}>None yet</Text>
            ) : (
              <View style={styles.ratingView}>
                <Text style={styles.reviewsTitle}>{averageRating.toFixed(1)}</Text>
                <Ionicons
                  name="star"
                  size={24}
                  color="#f1c40f"
                  style={{ marginHorizontal: 4 }}
                  onPress={onReviewClicked}
                />
              </View>
            )}

            <Text style={styles.reviewLabel}>
              {reviewCount === 0 ? '0 review' : `${reviewCount} reviews`}
            </Text>
          </View>

          {/* Join date */}
          <View style={[styles.profileTextContainer, { justifyContent: 'flex-end' }]}>
            <Text style={styles.yearsTitle}>
              {user?.createdAt ? getUserExperience(user.createdAt) : ''}
            </Text>
            <Text style={styles.yearsLabel}>on ReUseIt</Text>
          </View>
        </View>
      </View>

        {
          !isListingCountDisable && (
            <View style={{ padding: 10 }}>
            <Text style={styles.listingCountTitle}>
              {
                  listingCount !== 0 ? `${listingCount} listings` : '0 listing'
              }
            
            </Text>
          </View>

          )
        }
      
    </View>
  );
};

export default ProfileCard;
