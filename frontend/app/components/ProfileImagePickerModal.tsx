// components/ProfileImagePickerModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../styles/meStyles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPickImage: () => void;
  onTakePhoto: () => void;
}

const ProfileImagePickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onPickImage,
  onTakePhoto,
}) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose an Option</Text>

          <TouchableOpacity style={styles.modalButton} onPress={onPickImage}>
            <Text style={styles.modalButtonText}>Choose from Library</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalButton} onPress={onTakePhoto}>
            <Text style={styles.modalButtonText}>Take a Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: 'lightgrey' }]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileImagePickerModal;
