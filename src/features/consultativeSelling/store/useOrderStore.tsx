import React from "react";
import create from "zustand";
import createContext from "zustand/context";

type OrderStore = {
  isGetPromotionsProduct: boolean;
  setIsGetPromotionsProduct: (isGetPromotionsProduct: boolean) => void;
};
const { Provider, useStore: useOrderStore } = createContext<OrderStore>();

const getResetState = () => {
  return {
    isGetPromotionsProduct: false,
  };
};

const createOrderStore = () =>
  create<OrderStore>((set, get) => ({
    isGetPromotionsProduct: false,
    setIsGetPromotionsProduct: (isGetPromotionsProduct: boolean) =>
      set({ isGetPromotionsProduct }),
  }));

export default useOrderStore;

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider createStore={createOrderStore} children={children} />;
};
