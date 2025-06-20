import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';

  // Function to upload an image
   export const uploadImageToFirebase = async (imageUri: string) => {
        try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
    
        // Generate a unique filename
        const fileName = `images/${Date.now()}.jpg`;
    
        // Reference to Firebase Storage
        const storageRef = ref(storage, fileName);
    
        // Upload the file
        await uploadBytes(storageRef, blob);
    
        // Get the image's download URL
        const downloadURL = await getDownloadURL(storageRef);
    
        console.log("Image uploaded successfully. URL:", downloadURL);
        return downloadURL; // Return the download URL
        } catch (error) {
        console.error("Error uploading image:", error);
         throw new Error('Error uploading image');
        }
    };

   export const uploadAndSaveImage = async (imageuri:string) => {
        const imageurl = await uploadImageToFirebase(imageuri);
        console.log(" uploadAndSaveImage ",imageurl)
       // setImageURL(imageurl)
        return imageurl;
    }

    const getImageSize = (uri: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        Image.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        (error) => reject(error)
        );
    });
    };

    export const compressImages = async (imageUris: string[]): Promise<string[]> => {
    const compressedUris: string[] = [];

    for (const uri of imageUris) {
        try {
        // Get original size
        const { width, height } = await getImageSize(uri);

        // Define desired aspect ratio (e.g., 1:1 square)
        const aspectRatio = 1; // for square crop

        let cropWidth = width;
        let cropHeight = cropWidth / aspectRatio;

        if (cropHeight > height) {
            cropHeight = height;
            cropWidth = cropHeight * aspectRatio;
        }

        const originX = (width - cropWidth) / 2;
        const originY = (height - cropHeight) / 2;

        const result = await ImageManipulator.manipulateAsync(
            uri,
            [
            {
                crop: {
                originX,
                originY,
                width: cropWidth,
                height: cropHeight,
                },
            },
            {
                resize: {
                width: 800, // final output size (you can change this)
                },
            },
            ],
            {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
            }
        );

        compressedUris.push(result.uri);
        } catch (error) {
        console.error('Failed to compress image:', uri, error);
        }
    }

    return compressedUris;
    };


    // export const compressImages = async (imageUris: string[]): Promise<string[]> => {
    // const compressedUris: string[] = [];

    // for (const uri of imageUris) {
    //     try {
    //     const result = await ImageManipulator.manipulateAsync(
    //         uri,
    //         [{ resize: { width: 800, height: 800 } }],
    //         { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    //     );

    //     compressedUris.push(result.uri);
    //     } catch (error) {
    //     console.error('Failed to compress image:', uri, error);
    //     }
    // }

    // return compressedUris;
    // };

    // export const compressImages = async (imageUris: string[]): Promise<string[]> => {
    // const compressedUris: string[] = [];

    // for (const uri of imageUris) {
    //     try {
    //     const compressedImage = await ImageResizer.createResizedImage(
    //         uri,
    //         800, // max width
    //         800, // max height
    //         'JPEG',
    //         80,  // quality
    //         0    // rotation
    //     );

    //     compressedUris.push(compressedImage.uri);
    //     } catch (error) {
    //       throw new Error(`Failed to compress image: ${error}`);
    //     }
    // }

    // return compressedUris; // ✅ Add this line
    // };

    // export const compressImage = async (imageuri:string) =>{
    //     const compressedImage = await ImageResizer.createResizedImage(
    //         imageuri, // Image URI
    //         800, // Max width (adjust as needed)
    //         800, // Max height (adjust as needed)
    //         "JPEG", // Image format (JPEG or PNG)
    //         80, // Quality (0-100)
    //         0 // Rotation angle (0 for no rotation)
    //       );
    //  return compressedImage.uri;
    // }