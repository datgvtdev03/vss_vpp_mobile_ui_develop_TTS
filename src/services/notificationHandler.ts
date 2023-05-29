import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, {
  ReceivedNotification,
} from "react-native-push-notification";
type Notification = Omit<ReceivedNotification, "userInfo"> & {
  title?: string;
  channelId?: string;
};

class NotificationHandler {
  _onNotification: ((notification: Notification) => void) | null = null;
  _onRegister: ((token: string) => void) | null = null;

  onNotification(notification: Notification) {
    if (typeof this._onNotification === "function") {
      this._onNotification(notification);
    }
  }

  onRegister(token: { os: string; token: string }) {
    if (typeof this._onRegister === "function") {
      this._onRegister(token.token);
    }
  }

  attachRegister(handler: (token: string) => void) {
    this._onRegister = handler;
  }

  attachNotification(handler: (notification: Notification) => void) {
    this._onNotification = handler;
  }
}

const notificationHandler = new NotificationHandler();

PushNotification.configure({
  onRegister: notificationHandler.onRegister.bind(notificationHandler),
  onNotification: function (notification: Notification) {
    if (notification.userInteraction) {
      notificationHandler.onNotification.call(
        notificationHandler,
        notification
      );
    } else if (notification.foreground) {
      PushNotification.localNotification({
        channelId: notification.channelId,
        title: notification.title,
        message: String(notification.message),
        smallIcon: "",
        largeIcon: "",
        color: "#EE0033",
        bigLargeIcon: "",
        soundName: "default",
        // @ts-ignore
        data: notification.data,
      });
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: true,
});

export default notificationHandler;
