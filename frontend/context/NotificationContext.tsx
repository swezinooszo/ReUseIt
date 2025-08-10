import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { EventSubscription } from 'expo-notifications';
import { registerForPushNotificationsAsync } from "@/app/utils/registerForPushNotificationsAsync";
import { Alert } from "react-native";
import { showConfirmationDialog } from '../app/utils/chatUtils';
import { router } from 'expo-router';
import { soldListing,unReserveListing } from "../app/utils/chatUtils";
import { getTokenAndUserId } from "@/app/utils/listingDetailsUtils";
import { fetchUnreadCount } from '@/app/utils/notificationUtils';

interface User {
  _id: string;
  username: string;
  email: string;
   profileImage:string;
}

interface Listing {
  _id: string;
  title: string;
  price: string;
  condition: string;
  location: string;
}

interface Chat {
  _id: string;
  listingId: Listing;
  buyerId: User;
  sellerId: User;
  lastMessage: string;
  lastMessageReadBy: string[],
  updatedAt: string;
}

// 🧾 Define the notification tap callback type with optional action
type NotificationTapCallback = (data: any, action?: "ok" | "cancel") => void;

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  unreadCount: number;
  loadUnreadNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [unreadCount, setUnreadCount] =  useState<number>(0);//useState<number | undefined>(undefined);//

  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

    const loadUnreadNotification = async () => {
          const count = await fetchUnreadCount();
          console.log("Unread count:", count); 
          setUnreadCount(count > 0 ? count : 0);
    };
    
  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received while the app is running: ", notification);
        setNotification(notification);
        console.log(`🔔 Notification Received while the app is running: type ${notification.request.content.body}`);
        console.log(`🔔 Notification Received while the app is running: type ${notification.request.content.data?.type}`);
       
        if (notification.request.content.data?.type === "review") {
           console.log("🔔 Coming Notification type is recive");
          loadUnreadNotification();
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Tap: ",
          JSON.stringify(response.notification.request.content.data, null, 2)
        );

        // Handle the notification response here
        //handleNotificationResponse(response);
        //(async () => { ... })(); = lets you await inside places that can't be async (like event handlers)
        //// waits for userId to be retrieved..which means userId, token, etc., are available before navigating or accessing data.
         (async () => {
          console.log("🔔 Notification Tap: ", response);
          await handleNotificationResponse(response);
        })();

      });

      // 🟢 Check if app was killed and launched, trigger the data from notification (for chat and listing status change notification)
      const checkInitialNotification = async () => {
        const lastResponse = await Notifications.getLastNotificationResponseAsync();
        if (lastResponse) {
            console.log("🛑 App Launched from Killed State with Notification: ", lastResponse);
            handleNotificationResponse(lastResponse);
          }
        };
      checkInitialNotification();

    // retrieve userId to pass for chat noti
    const loadToken = async () => {
      const { token, userId } = await getTokenAndUserId();
      console.log(` loadToken userId${userId}`)
      if (userId) setUserId(userId);
    };

    loadToken();

    // fetch unread notification count
    loadUnreadNotification();

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
      //unsubscribe?.();
    };
  }, []);


    const handleNotificationResponse = async (response: Notifications.NotificationResponse) => {
        const data = response.notification.request.content.data;

        if (data.type === 'reservationEnded') {
          showConfirmationDialog(
            'Confirmation',
            'Is Transaction Complete?',
            () => soldListing(data.listingId as string),//subscribers.current.forEach((cb) => cb(data, 'ok')),
            () =>  unReserveListing(data.listingId as string, data.buyerId as string)//subscribers.current.forEach((cb) => cb(data, 'cancel'))
          );
        } else if (data.type === 'chat') {
          //get current user token and id
          const { token, userId } = await getTokenAndUserId();

          const chat = JSON.parse(data.chat as string) as Chat;
          const currentUserName = chat.buyerId._id === userId ? chat.buyerId.username : chat.sellerId.username;
          const otherUser = chat.buyerId._id === userId ? chat.sellerId : chat.buyerId;
          const otherUserIdentify = chat.buyerId._id === userId ? 'seller' : 'buyer';
          const listing = chat.listingId;
          console.log(`Notification Context go to chat page userId ${userId}`)
          router.navigate({
            pathname: '/(me)/chat',
            params: {
              listingId: listing._id,
              listingTitle: listing.title,
              receiverId: otherUser._id,
              receiverIdentify:otherUserIdentify,
              receiverName: otherUser.username,
              receiverEmail: otherUser.email,
              receiverprofileImage:encodeURIComponent(otherUser.profileImage),
              currentUserId: userId,
              currentUserName: currentUserName,
              token: token,
              price: listing.price,
              sellerId: chat.sellerId._id,
              chat: JSON.stringify(chat)
            }
          });
        }else if (data.type === 'listing-status'){
            router.push({
                  pathname: '/(explore)/listingDetails',
                  params: { listingId: data.listingId as string },
                  })
        }else if (data.type === 'review'){
         // await loadUnreadNotification();
          router.push({pathname:'/(me)/reviewList',params:{userIdParam:data.revieweeId as string,notificationId:data.notificationId as string}})
        }
  };

  return (
    <NotificationContext.Provider
     value={{ expoPushToken, notification, error, unreadCount, loadUnreadNotification  }}// value={{ expoPushToken, notification,onNotificationTap, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};