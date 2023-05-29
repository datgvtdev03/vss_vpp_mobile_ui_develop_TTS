import React from "react";
import create from "zustand";
import createContext from "zustand/context";
import {
  QuantityInfo,
  StaffList,
  Staff,
  ProductTicket,
  Stage,
  StatisticManagementResponse,
} from "../models/statistic";

const { Provider, useStore: useStatisticStore } =
  createContext<StatisticStore>();

type StatisticStore = {
  resetStatisticData: () => void;
  statisticType: number;
  setStatisticType: (isStatisticType: number) => void;

  staffsGroup: StaffList[];
  setStaffsGroup: (staffsGroup: StaffList[]) => void;

  quantityGroup: QuantityInfo[];
  setQuantityGroup: (quantityGroup: QuantityInfo[]) => void;

  actionType: number;
  setActionType: (actionType: number) => void;

  dataManagementStatistic: StatisticManagementResponse[];
  setDataManagementStatistic: (
    dataManagementStatistic: StatisticManagementResponse[]
  ) => void;

  searchKeyword: string;
  setSearchKeyword: (searchKeyword: string) => void;

  fromDate: Date;
  setFromDate: (fromDate: Date) => void;

  toDate: Date;
  setToDate: (toDate: Date) => void;

  searchStaff: Staff;
  setSearchStaff: (searchStaff: Staff) => void;

  searchProductTicket: ProductTicket;
  setSearchProductTicket: (searchProductTicket: ProductTicket) => void;

  searchStage: Stage;
  setSearchStage: (searchStage: Stage) => void;
};

const getResetState = () => {
  return {
    statisticType: 2,
    staffsGroup: [],
    quantityGroup: [],
    actionType: 1,
    searchKeyword: "",
    fromDate: new Date(),
    toDate: new Date(),
    searchStaff: {} as Staff,
    searchProductTicket: {} as ProductTicket,
    searchStage: {} as Stage,
    // dataManagementStatistic: [],
  };
};

const createStatisticStore = () =>
  create<StatisticStore>((set, get) => ({
    resetStatisticData: () => set(getResetState()),

    statisticType: 2,
    setStatisticType: (statisticType: number) => set({ statisticType }),

    staffsGroup: [],
    setStaffsGroup: (staffsGroup: StaffList[]) => {
      set({ staffsGroup });
    },

    quantityGroup: [],
    setQuantityGroup: (quantityGroup: QuantityInfo[]) => {
      set({ quantityGroup });
    },

    actionType: 1,
    setActionType: (actionType: number) => {
      set({ actionType });
    },

    dataManagementStatistic: [],
    setDataManagementStatistic: (
      dataManagementStatistic: StatisticManagementResponse[]
    ) => {
      set({ dataManagementStatistic });
    },

    searchKeyword: "",
    setSearchKeyword: (searchKeyword: string) => {
      set({ searchKeyword });
    },

    fromDate: new Date(),
    setFromDate: (fromDate: Date) => {
      set({ fromDate });
    },

    toDate: new Date(),
    setToDate: (toDate: Date) => {
      set({ toDate });
    },

    searchStaff: {} as Staff,
    setSearchStaff: (searchStaff: Staff) => {
      set({ searchStaff });
    },

    searchProductTicket: {} as ProductTicket,
    setSearchProductTicket: (searchProductTicket: ProductTicket) => {
      set({ searchProductTicket });
    },

    searchStage: {} as Stage,
    setSearchStage: (searchStage: Stage) => {
      set({ searchStage });
    },
  }));

export default useStatisticStore;
export const StatisticProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Provider createStore={createStatisticStore} children={children} />;
};
