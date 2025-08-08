// utils/imageHelper.tsx
import * as ImagePicker from 'expo-image-picker';

export const takePhoto = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
        alert('Camera permission is required to take photos.');
        return null;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && result.assets.length > 0) {
        return result.assets[0].uri;
    }

    return null;
};


export const pickImages = async (allowsMultipleSelection:boolean): Promise<string[] | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: allowsMultipleSelection,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets.length > 0) {
        return result.assets.map(a => a.uri);
    }

    return null;
};
