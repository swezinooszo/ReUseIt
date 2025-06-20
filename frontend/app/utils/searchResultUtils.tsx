  import api from '../utils/api';
  import MapView, { Marker,Region } from 'react-native-maps';
  
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
