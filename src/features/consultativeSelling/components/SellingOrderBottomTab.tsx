import React, { useCallback, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "src/components/base/Typography";
import DialogAlert from "src/components/common/DialogAlert";
import Svgs from "src/constants/Svgs";
import usePreOrderStore from "src/features/orderOnline/store/usePreOrderStore";
import { useTailwind } from "src/lib/tailwind/tailwind";
import navigationService from "src/navigation/navigationService";
import { navigationRoutes } from "src/navigation/StackNavigator";
import { CategoryApi } from "src/services/api/consultativeSelling/preOrder/CategoryApi";
import { SelectedBottomTab } from "../constants";
import useCheckCustomerInfo from "../controller/useCheckCustomerInfo";
import { useInstallmentStore } from "../store/useInstallmentStore";
import useOrderStore from "../store/useOrderStore";
import useSellingStore, { SellMode } from "../store/useSellingStore";
import useSubsidySellStore from "../store/useSubsidySellStore";

type TabItem = {
  name: string;
  action: () => void;
  image: JSX.Element;
  tabType: SelectedBottomTab;
};

const SellingBottomTab = ({
  selectedTab,
}: {
  selectedTab: SelectedBottomTab;
}) => {
  const { tw } = useTailwind();
  const saleOrderDTO = useOrderStore((state) => state.saleOrderDTO);
  const isConsulting = useSellingStore((state) => state.setConsulting);
  const validate = useInstallmentStore((state) => state.validate);
  const isCheckSubsidySuccess = useSubsidySellStore(
    (state) => state.isCheckSubsidySuccess
  );
  const sellingMode = useSellingStore((state) => state.sellingMode);
  const checkForCustomerInfo = useCheckCustomerInfo();
  const { setPreSaleOrderDTOInfo } = usePreOrderStore((state) => ({
    setPreSaleOrderDTOInfo: state.setPreSaleOrderDTOInfo,
  }));
  const orderTabOnPress = useCallback(() => {
    isConsulting(false);

    CategoryApi.getPreOrderInfor(preOrderCode.preSaleOrderId, false)
      .loading(true)
      .run()
      .then((value) => {
        if (value) {
          setPreSaleOrderDTOInfo(value);
          navigationService.navigate(navigationRoutes.INFO_ORDER_CUSTOMER, {
            preSaleOrderId: value?.preSaleOrderId,
            isView: false,
          });
        }
      })
      .catch((error) => {
        if (error.data.errorCode == "0101077") {
          DialogAlert.showError(
            "Thất bại",
            "Không lấy được thông tin đặt trước",
            [
              {
                text: "Đóng",
                onPress: () => {
                  navigationService.navigate(
                    navigationRoutes.SELLING_Pre_Order
                  );
                },
              },
            ]
          );
        }
      });
  }, []);

  const customerTabOnPress = useCallback(() => {
    checkForCustomerInfo({
      onExisted: () => {
        isConsulting(false);
        navigationService.navigate(navigationRoutes.INFO_CUSTOMER_ORDER);
      },
    });
  }, [checkForCustomerInfo, isConsulting]);

  const productTabOnPress = useCallback(() => {
    if (saleOrderDTO.saleOrderDetails) {
      navigationService.navigate(navigationRoutes.SELLING_ORDER_DETAIL);
    } else {
      navigationService.navigate(navigationRoutes.SEARCH_PRODUCT);
    }
  }, [saleOrderDTO]);

  const deliveryTabOnPress = useCallback(() => {
    navigationService.navigate(navigationRoutes.DELIVERY);
  }, []);

  const subsidyTabOnPress = useCallback(() => {
    navigationService.navigate(
      navigationRoutes.INFO_SUBSIDY_SELLING_PRE_ORDER,
      undefined
      //     {
      //   salesForm: salesForm,
      //   codeOrder: codeOrderOnline,
      //   phoneNumber: phoneNumber,
      //   saleOrderCode: saleOrderCode,
      //   saleOrderTypeId: saleOrderTypeSellected.saleOrderTypeId,
      // }
    );
  }, []);

  const installmentTabOnPress = useCallback(() => {
    navigationService.navigate(
      navigationRoutes.INSTALLMENT_INFO
      //     {
      //   salesForm: salesForm,
      //   codeOrder: codeOrderOnline,
      //   phoneNumber: phoneNumber,
      //   saleOrderCode: saleOrderCode,
      //   saleOrderTypeId: saleOrderTypeSellected.saleOrderTypeId,
      // }
    );
  }, []);

  const listTabItem: TabItem[] = useMemo(() => {
    const tabItems = [
      {
        name: "Đặt trước",
        action: () => {
          if (selectedTab === SelectedBottomTab.PreOrderTab) return;
          if (sellingMode === SellMode.SubsidyInstallmentSell && validate)
            return;
          orderTabOnPress();
        },
        image:
          selectedTab === SelectedBottomTab.PreOrderTab ? (
            <Svgs.PreOrderSelling
              fill={"#EE0033"}
              width={23}
              height={23}
              style={{ marginRight: 5 }}
            />
          ) : (
            <Svgs.PreOrderSellingDisable
              fill={"#EE0033AAAAAA"}
              width={23}
              height={23}
              style={{ marginRight: 5 }}
            />
          ),
        tabType: SelectedBottomTab.PreOrderTab,
      },
      {
        name: "Khách hàng",
        action: () => {
          if (selectedTab === SelectedBottomTab.CustomerTab) return;
          if (sellingMode === SellMode.SubsidyInstallmentSell && validate)
            return;
          customerTabOnPress();
        },
        image: (
          <Svgs.Customer
            fill={
              selectedTab === SelectedBottomTab.CustomerTab
                ? "#EE0033"
                : "#AAAAAA"
            }
            width={23}
            height={23}
            style={{ marginRight: 5 }}
          />
        ),
        tabType: SelectedBottomTab.CustomerTab,
      },
      {
        name: "Sản phẩm",
        action: () => {
          if (selectedTab === SelectedBottomTab.ProductTab) return;
          if (
            sellingMode === SellMode.SubsidyInstallmentSell &&
            !isCheckSubsidySuccess
          )
            return;
          if (sellingMode === SellMode.InstallmentSell && validate) return;
          productTabOnPress();
        },
        image: (
          <Svgs.Products
            fill={
              selectedTab === SelectedBottomTab.ProductTab
                ? "#EE0033"
                : "#AAAAAA"
            }
            width={23}
            height={23}
            style={{ marginRight: 5 }}
          />
        ),
        tabType: SelectedBottomTab.ProductTab,
      },
      {
        name: "Cài đặt & GH",
        action: () => {
          if (selectedTab === SelectedBottomTab.DeliveryTab) return;
          deliveryTabOnPress();
        },
        image: (
          <Svgs.Ic_Setting
            fill={
              selectedTab === SelectedBottomTab.DeliveryTab
                ? "#EE0033"
                : "#AAAAAA"
            }
            width={23}
            height={23}
            style={{ marginRight: 5 }}
          />
        ),
        tabType: SelectedBottomTab.DeliveryTab,
      },
    ];
    if (
      sellingMode === SellMode.SubsidySell ||
      sellingMode === SellMode.SubsidyInstallmentSell
    ) {
      tabItems.splice(1, 0, {
        name: "Subsidy",
        action: () => {
          if (selectedTab === SelectedBottomTab.SubsidyTab) return;
          subsidyTabOnPress();
        },
        image:
          selectedTab === SelectedBottomTab.SubsidyTab ? (
            <Svgs.SubsidySelling
              width={23}
              height={23}
              style={{ marginRight: 5 }}
            />
          ) : (
            <Svgs.IcSubsidySellingDisable
              width={23}
              height={23}
              style={{ marginRight: 5 }}
            />
          ),
        tabType: SelectedBottomTab.SubsidyTab,
      });
    }
    if (
      sellingMode === SellMode.SubsidyInstallmentSell ||
      sellingMode === SellMode.InstallmentSell
    ) {
      tabItems.splice(1, 0, {
        name: "Trả góp",
        action: () => {
          if (selectedTab === SelectedBottomTab.SubsidyInstallmentTab) return;
          if (
            sellingMode === SellMode.SubsidyInstallmentSell &&
            !isCheckSubsidySuccess
          )
            return;
          installmentTabOnPress();
        },
        image: (
          <Svgs.InstallmentSellingInactive
            fill={
              selectedTab === SelectedBottomTab.SubsidyInstallmentTab
                ? "#EE0033"
                : "#AAAAAA"
            }
            width={23}
            height={23}
            style={{ marginRight: 5 }}
          />
        ),
        tabType: SelectedBottomTab.SubsidyInstallmentTab,
      });
    }
    if (sellingMode === SellMode.SubsidyInstallmentSell) {
      tabItems[0].name = "Khác";
      tabItems[0].image = (
        <Svgs.ListDashes
          fill={
            selectedTab === SelectedBottomTab.SubsidyInstallmentTab
              ? "#EE0033"
              : "#AAAAAA"
          }
          width={23}
          height={23}
          style={{ marginRight: 5 }}
        />
      );
      tabItems[0].action = () => {
        navigationService.navigate(navigationRoutes.LIST_DASHES);
      };
      const itemInside: TabItem[] = [];
      itemInside.push(tabItems[tabItems.length - 1]);
      tabItems.splice(tabItems.length - 1, 1);
      let itemMiddle: any = {};
      itemMiddle = tabItems[0];
      tabItems.splice(0, 1);
      tabItems.splice(tabItems.length, 0, itemMiddle);
      itemMiddle = tabItems[0];
      tabItems[0] = tabItems[1];
      tabItems[1] = itemMiddle;
    }
    // if (tabItems.length >4 && sellingMode != SellMode.SubsidyInstallmentSell) {
    //   tabItems[tabItems.length-1].name = "Cài đặt & Giao hàng"
    // }
    return tabItems;
  }, [
    customerTabOnPress,
    deliveryTabOnPress,
    installmentTabOnPress,
    isCheckSubsidySuccess,
    orderTabOnPress,
    productTabOnPress,
    selectedTab,
    sellingMode,
    subsidyTabOnPress,
    validate,
  ]);
  return (
    <View style={tw("flex-row", "bg-white", "py-18", "shadow-3")}>
      {listTabItem.map((item, index) => {
        return (
          <TouchableOpacity
            key={`${index}`}
            onPress={() => {
              item.action();
            }}
            style={tw("flex-1", "items-center")}
          >
            {item.image}
            <Text
              style={tw(
                selectedTab === item.tabType ? "text-#EE0033" : "text-#AAAAAA",
                "mt-8",
                "mr-5"
              )}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SellingBottomTab;
