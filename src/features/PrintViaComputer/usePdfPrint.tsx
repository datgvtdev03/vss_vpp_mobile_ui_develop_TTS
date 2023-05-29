import create from "zustand";
import { Printer } from "./printer";

type ListPrinter = {
  getListPrinter: Printer[];
  getIpPrintServer: string;
  setListPrinter: (getListPrinter: Printer[]) => void;
  setIpPrinterServer: (getIpPrintServer: string) => void;
};

const usePrinterStore = create<ListPrinter>((set) => ({
  getListPrinter: [] as Printer[],
  getIpPrintServer: "" as string,
  setListPrinter: (getListPrinter: Printer[]) => set({ getListPrinter }),
  setIpPrinterServer: (getIpPrintServer: string) => set({ getIpPrintServer }),
}));

export default usePrinterStore;
