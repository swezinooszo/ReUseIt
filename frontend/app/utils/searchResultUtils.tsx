  import api from '../utils/api';
  import MapView, { Marker,Region } from 'react-native-maps';

import sha256 from 'crypto-js/sha256';

// utils/debounce.ts
export type DebouncedFunction<T extends (...args: any[]) => void> = ((...args: Parameters<T>) => void) & {
  cancel: () => void;
};

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout>;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced as DebouncedFunction<T>;
}

export const buildQueryUrl = (page:number, searchQuery:string, region:Region,categoryId:string,categoryType:string) => {
  let url = `/listings/query?page=${page}&limit=10&search=${searchQuery}`;

  console.log(`buildQueryUrl categoryId ${categoryId}`)
  if(categoryId){
    url += `&categoryId=${categoryId}`
    if(categoryType){
    url += `&type=${categoryType}`
  }
  }

  if (region) {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const minLat = latitude - latitudeDelta / 2;
    const maxLat = latitude + latitudeDelta / 2;
    const minLng = longitude - longitudeDelta / 2;
    const maxLng = longitude + longitudeDelta / 2;

    url += `&minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`;
  }

  return url;
};

// export const getObfuscatedCoordinates = (longitude: number, latitude: number) => {
//   const offset = () => (Math.random() - 0.5) * 0.01; // ~500–700 meters max
//   return {
//     latitude: latitude + offset(),
//     longitude: longitude + offset(),
//   };
// };


//You can make the offset stable per listing by using a hash of the listing ID to generate a "random" but consistent offset.
//This will generate a consistent obfuscated offset per listing, up to ~500 meters away, but never move on re-renders.
export const getObfuscatedCoordinates = (
  listingId: string,
  longitude: number,
  latitude: number
) => {
  // Create a hash and derive two values from it
  const hash = sha256(listingId).toString();
  const latOffsetSeed = parseInt(hash.substring(0, 8), 16);
  const lngOffsetSeed = parseInt(hash.substring(8, 16), 16);

  // Convert seed to offset in range [-0.005, +0.005]
  const latOffset = ((latOffsetSeed % 10000) / 10000 - 0.5) * 0.01;
  const lngOffset = ((lngOffsetSeed % 10000) / 10000 - 0.5) * 0.01;

  return {
    latitude: latitude + latOffset,
    longitude: longitude + lngOffset,
  };
};


