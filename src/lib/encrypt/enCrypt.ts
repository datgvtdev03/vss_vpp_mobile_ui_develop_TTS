import { NativeModules } from "react-native";
const enCrypt = {
  ios: {
    encrypt: (input: string) => {
      return NativeModules.SecurityUtil.encrypt(input);
    },
    decrypt: (input: string) => {
      return NativeModules.SecurityUtil.decrypt(input);
    },
  },
  android: {
    encrypt: (input: string) => {
      return NativeModules.EncryptionUtilsModule.encrypt(input);
    },
    decrypt: (input: string) => {
      return NativeModules.EncryptionUtilsModule.decrypt(input);
    },
  },
};

export default enCrypt;
