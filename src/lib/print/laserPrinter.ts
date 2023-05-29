import { NativeModules, Platform } from "react-native";

type PrintOptionsType = {
  printerURL?: string;
  isLandscape?: boolean;
  jobName?: string;
} & ({ html: string } | { filePath: string });

type SelectPrinterOptionsType = {
  x: string;
  y: string;
};

const laserPrinter = {
  print: async (options: PrintOptionsType): Promise<void> => {
    return NativeModules.LaserPrinter.print(options);
  },

  selectPrinter: async (options: SelectPrinterOptionsType): Promise<void> => {
    return Platform.select({
      ios: NativeModules.LaserPrinter.selectPrinter(options),
      default: Promise.reject(new Error("Not implemented")),
    });
  },
};

export default laserPrinter;
