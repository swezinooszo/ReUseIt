import { io } from 'socket.io-client';
import { Platform } from 'react-native';
import { IP_ADDRESS } from '../../config/config';

const LOCAL_IP = IP_ADDRESS//process.env.IP_ADDRESS;//'192.168.0.10'//'142.3.66.244';//
const URL = `http://${LOCAL_IP}:8000`;//Platform.OS === 'android'? `http://${LOCAL_IP}:8000` : 'http://localhost:8000';


//This creates and returns a Socket.IO client instance.
//It connects to your backend server at http://localhost:8000.
export const createSocket = (token) =>
  io(URL, {
      transports: ['websocket'], // optional but can help on mobile
      auth: { 
        token 
      }
  });

// export  const createSocket = () =>
//   io(URL, {
//         transports: ['websocket'], // optional but can help on mobile
//          auth: {
//             userId: '683baea3c5b53f9905bd28fa'//Platform.OS === 'android'  ? '683baea3c5b53f9905bd28fa' : '683baa594ff5279bf1aaebc2' 
//          }
//       }
// );


