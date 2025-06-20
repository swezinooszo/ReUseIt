//   import api from '../utils/api';
//   import MapView, { Marker,Region } from 'react-native-maps';

//   export const buildQueryUrl = (page:number, searchQuery:string, region:Region) => {
//   let url = `/listings/query?page=${page}&limit=10&search=${searchQuery}`;

//   if (region) {
//     const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
//     const minLat = latitude - latitudeDelta / 2;
//     const maxLat = latitude + latitudeDelta / 2;
//     const minLng = longitude - longitudeDelta / 2;
//     const maxLng = longitude + longitudeDelta / 2;

//     url += `&minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`;
//   }

//   return url;
// };
