import { NativeModules } from "react-native";

const callVideo = {
  ios: {
    videocall: (sdt: string) => {
      return NativeModules.CallvideoNative.videocall(sdt);
    },
    call: (sdt: string) => {
      return NativeModules.CallvideoNative.call(sdt);
    },
    chat: (sdt: string) => {
      return NativeModules.CallvideoNative.chat(sdt);
    },
  },
  android: {
    videocall: (sdt: string) => {
      return NativeModules.CallvideoModule.callvideo(sdt);
    },
    call: (sdt: string) => {
      return NativeModules.CallvideoModule.call(sdt);
    },
    chat: (sdt: string) => {
      return NativeModules.CallvideoModule.chat(sdt);
    },
  },
};
export default callVideo;
