import SInfo from "react-native-sensitive-info";
import { ColorSchemeName } from "react-native";
import StorageKeys from "src/constants/storage";
import { LoginInfo } from "src/models/login";
import Config from "react-native-config";

const secureConfig = {
  sharedPreferencesName: Config.SHARED_PREFERENCES_NAME,
  keychainService: Config.KEYCHAIN_SERVICE,
};

// language
export async function setLanguage(language: string): Promise<null> {
  return SInfo.setItem(StorageKeys.language, language, secureConfig);
}
export async function getLanguage(): Promise<string | null> {
  return SInfo.getItem(StorageKeys.language, secureConfig);
}

// theme
export async function getTheme(): Promise<ColorSchemeName | null> {
  return SInfo.getItem(
    StorageKeys.theme,
    secureConfig
  ) as Promise<ColorSchemeName | null>;
}
export async function setTheme(theme: ColorSchemeName): Promise<null> {
  return SInfo.setItem(StorageKeys.theme, theme || "", secureConfig);
}

// login info
export async function getLoginInfo(): Promise<LoginInfo | null> {
  const userInfo = await SInfo.getItem(StorageKeys.userInfo, secureConfig);
  return userInfo ? JSON.parse(userInfo) : null;
}
export async function setLoginInfo(userInfo: LoginInfo): Promise<null> {
  return SInfo.setItem(
    StorageKeys.userInfo,
    JSON.stringify(userInfo),
    secureConfig
  );
}
export async function clearLoginInfo(): Promise<null> {
  return SInfo.deleteItem(StorageKeys.userInfo, secureConfig);
}

// save mini app
export async function getLastAccessApp(): Promise<string | null> {
  return SInfo.getItem(StorageKeys.lastAccessApp, secureConfig);
}
export async function setLastAccessApp(lastAccessApp: string): Promise<null> {
  return SInfo.setItem(StorageKeys.lastAccessApp, lastAccessApp, secureConfig);
}

// list thermal printer
export type ThermalPrinter = {
  name: string;
  ip: string;
  port: string;
};
export type ComputerPrint = {
  name: string;
  ip: string;
};
export async function getListThermalPrinters(): Promise<ThermalPrinter[]> {
  const printers = await SInfo.getItem(
    StorageKeys.thermalPrinter,
    secureConfig
  );
  return printers ? JSON.parse(printers) : [];
}
export async function addThermalPrinter(
  printerInfo: ThermalPrinter
): Promise<ThermalPrinter[]> {
  const _printers = await SInfo.getItem(
    StorageKeys.thermalPrinter,
    secureConfig
  );
  const printers: ThermalPrinter[] = _printers ? JSON.parse(_printers) : [];
  const existedIndx = printers.findIndex(
    (p) => p.name.trim().toLowerCase() === printerInfo.name.trim().toLowerCase()
  );
  if (existedIndx > -1) {
    printers[existedIndx] = printerInfo;
  } else {
    printers.unshift(printerInfo);
  }
  if (printers.length > 5) {
    printers.splice(5, 1);
  }
  await SInfo.setItem(
    StorageKeys.thermalPrinter,
    JSON.stringify(printers),
    secureConfig
  );
  return printers;
}
export async function removeThermalPrinter(
  printerInfo: ThermalPrinter
): Promise<ThermalPrinter[]> {
  const _printers = await SInfo.getItem(
    StorageKeys.thermalPrinter,
    secureConfig
  );
  const printers: ThermalPrinter[] = _printers ? JSON.parse(_printers) : [];
  const existedIndx = printers.findIndex(
    (p) => p.name.trim().toLowerCase() === printerInfo.name.trim().toLowerCase()
  );
  if (existedIndx > -1) {
    printers.splice(existedIndx, 1);
  }
  await SInfo.setItem(
    StorageKeys.thermalPrinter,
    JSON.stringify(printers),
    secureConfig
  );
  return printers;
}
export async function getListComputerPrint(): Promise<ComputerPrint[]> {
  const computer = await SInfo.getItem(StorageKeys.computerPrint, secureConfig);
  return computer ? JSON.parse(computer) : [];
}

export async function addComputerPrint(
  computerPrintInfo: ComputerPrint
): Promise<ComputerPrint[]> {
  const _computerPrint = await SInfo.getItem(
    StorageKeys.computerPrint,
    secureConfig
  );
  const computerPrint: ComputerPrint[] = _computerPrint
    ? JSON.parse(_computerPrint)
    : [];
  const existedIndx = computerPrint.findIndex(
    (p) =>
      p.name.trim().toLocaleLowerCase() ===
      computerPrintInfo.name.trim().toLocaleLowerCase()
  );
  if (existedIndx > -1) {
    computerPrint[existedIndx] = computerPrintInfo;
  } else {
    computerPrint.unshift(computerPrintInfo);
  }
  if (computerPrint.length > 5) {
    computerPrint.splice(5, 1);
  }
  await SInfo.setItem(
    StorageKeys.computerPrint,
    JSON.stringify(computerPrint),
    secureConfig
  );
  return computerPrint;
}

export async function deleteComputerPrint(
  computerPrintInfo: ComputerPrint
): Promise<ComputerPrint[]> {
  const _computerPrint = await SInfo.getItem(
    StorageKeys.computerPrint,
    secureConfig
  );
  const computerPrint: ComputerPrint[] = _computerPrint
    ? JSON.parse(_computerPrint)
    : [];
  const existedIndx = computerPrint.findIndex(
    (p) =>
      p.name.trim().toLocaleLowerCase() ===
      computerPrintInfo.name.trim().toLocaleLowerCase()
  );
  if (existedIndx === 0) {
    computerPrint.shift();
  } else {
    computerPrint.splice(existedIndx, 1);
  }
  await SInfo.setItem(
    StorageKeys.computerPrint,
    JSON.stringify(computerPrint),
    secureConfig
  );
  return computerPrint;
}
