import { NativeModules } from "react-native";

export enum PrinterStatus {
  UNKNOWN = "-801",
  READY = "800",
  COVER_OPEN = "-802",
  NO_PAPER = "-803",
  PAPER_NEAR_END = "-804",
  NOT_CONNECTED = "-805",
}

export enum CloseSignal {
  CLOSE_SUCCESS = "900",
  CLOSE_FAILURE = "-900",
}

export enum PrinterError {
  LOCATION_PERMISSION_NOT_GRANTED = "-100",
  IP_OR_PORT_EMPTY = "-200",
  CONNECTION_FAILED = "-300",
  INVALID_FILE_PATH = "-400",
  INVALID_FILE_EXTENSION = "-500",
  PRINT_FILE_ERROR = "-600",
  READ_FILE_ERROR = "-700",
}

const hprtTp809Printer = {
  connectViaWifi: async (
    name: string,
    ip: string,
    port: string
  ): Promise<void> => {
    return NativeModules.HprtTp809Printer.connectViaWifi(name, ip, port);
  },

  getCurrentPrinterStatus: async (): Promise<PrinterStatus> => {
    return NativeModules.HprtTp809Printer.getCurrentPrinterStatus();
  },

  print: ({ filePath }: { filePath: string }): Promise<void> => {
    return NativeModules.HprtTp809Printer.print({ filePath });
  },

  disconnect: (): Promise<CloseSignal.CLOSE_SUCCESS> => {
    return NativeModules.HprtTp809Printer.disconnect();
  },
};

export default hprtTp809Printer;
