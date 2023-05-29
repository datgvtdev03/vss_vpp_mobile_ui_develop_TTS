import React, { useCallback, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "src/components/base/Typography";
import DialogAlert from "src/components/common/DialogAlert";
import Svgs from "src/constants/Svgs";
import usePreOrderStore from "src/features/orderOnline/store/usePreOrderStore";
import useAppliedPromotionProduct from "src/features/preSaleOrder/preManageRequest/promotion/useAppliedPromotionProduct";
import useManageValuation from "src/features/tradein/managevalue/useManageValuation";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { SaleOrderDTO } from "src/models/consultativeSelling/order/promotion";
import navigationService from "src/navigation/navigationService";
import { navigationRoutes } from "src/navigation/StackNavigator";
import { CategoryApi } from "src/services/api/consultativeSelling/preOrder/CategoryApi";
import { isNotEmptyObj } from "src/utils/helpers";
import { SelectedBottomTab } from "../constants";
import useCheckCustomerInfo from "../controller/useCheckCustomerInfo";
import useCreateTransaction from "../selling/SellingType/components/useCreateTransaction";
import useFetchVtErpInfo from "../selling/SellingType/components/useFetchVtErpInfo";
import useCustomerStore from "../store/useCustomerStore";
import { useInstallmentStore } from "../store/useInstallmentStore";
import useOrderStore from "../store/useOrderStore";
import useSellingStore, { SellMode } from "../store/useSellingStore";
import useSubsidySellStore from "../store/useSubsidySellStore";

type TabItem = {
  name: string;
  action: () => void;
  image: JSX.Element;
  tabType: SelectedBottomTab;
  disabled: boolean;
  isShow: boolean;
  sellingMode: number[];
};

const SellingBottomTab = ({
  selectedTab,
}: {
  selectedTab: SelectedBottomTab;
}) => {
  const { tw } = useTailwind();
  const {
    saleOrderDTO,
    customerHasOrderOnline,
    installmentRequest,
    appliedProduct,
    isPreSaleOrder,
    imeiList,
    saleOrderTypeIdInfo,
    saleOrderTypeInfo,
    setImeiInfoCurrent,
    selectedSaleOrderType,
    isInsurranceSelling,
  } = useOrderStore((state) => state);
  const validate = useInstallmentStore((state) => state.validate);
  const setPreSaleOrderDTOInfo = usePreOrderStore(
    (state) => state.setPreSaleOrderDTOInfo
  );
  const { connectVTP } = useCreateTransaction();
  const { fetchVtErpInfo } = useFetchVtErpInfo();

  const preOrderCode = usePreOrderStore((state) => state.preOrderCode);

  const { sellingMode, setConsulting, isOrderInsurrance } = useSellingStore(
    (state) => state
  );
  const [checkBccsInfo] = useSubsidySellStore((state) => [state.checkBccsInfo]);
  const [customerInfo, infoByCode, unProvideOpt] = useCustomerStore((state) => [
    state.customerInfo,
    state.infoByCode,
    state.unProvideOpt,
  ]);
  const checkForCustomerInfo = useCheckCustomerInfo();
  const { onSetDetailInputPrice } = useManageValuation();
  const { onSearchPromotionProductByImei } = useAppliedPromotionProduct();
  const isInstallmentOrder = (saleOrder: SaleOrderDTO) => {
    return (
      (saleOrder.saleOrderDetails
        ? saleOrder.saleOrderDetails.findIndex((value) => {
            return value.isInstalment;
          }) !== -1
        : false) && selectedSaleOrderType?.isInstalment
    );
  };

  const orderTabOnPress = useCallback(() => {
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
        if (error?.data?.errorCode === "0101077") {
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
  }, [preOrderCode.preSaleOrderId, setPreSaleOrderDTOInfo]);
  const customerTabOnPress = useCallback(async () => {
    if (
      preOrderCode.preSaleOrderId &&
      !saleOrderDTO.isIncome
      // (!saleOrderDTO.isIncome || !saleOrderDTO.isDeleted)
    ) {
      if (!unProvideOpt) {
        await fetchVtErpInfo(customerInfo.customerPhone);
        await connectVTP(customerInfo.customerPhone);
        return;
      }
    }

    checkForCustomerInfo({
      onExisted: () => {
        setConsulting(false);
        navigationService.navigate(navigationRoutes.INFO_CUSTOMER);
      },
    });
  }, [
    checkForCustomerInfo,
    connectVTP,
    customerInfo.customerPhone,
    fetchVtErpInfo,
    preOrderCode.preSaleOrderId,
    saleOrderDTO.isIncome,
    setConsulting,
    unProvideOpt,
  ]);
  const productTabOnPress = useCallback(() => {
    if (sellingMode === SellMode.DetailCard) {
      navigationService.navigate(navigationRoutes.SELLING_CARD_ORDER_DETAIL);
      return;
    }
    if (appliedProduct && imeiList.length > 0 && isPreSaleOrder) {
      const imeiInfo = imeiList.shift();
      imeiInfo && setImeiInfoCurrent(imeiInfo);
      imeiInfo && onSearchPromotionProductByImei(imeiInfo);
    } else if (saleOrderDTO.saleOrderDetails) {
      if (isInsurranceSelling || isOrderInsurrance) {
        if (
          saleOrderTypeInfo?.saleOrderTypeId === 275 ||
          saleOrderTypeIdInfo.saleOrderTypeId === 275
        ) {
          navigationService.navigate(navigationRoutes.SELLING_ORDER_DETAIL);
        } else {
          navigationService.navigate(
            navigationRoutes.INSURRANCE_SELLING_DETAIID
          );
        }
      } else {
        navigationService.navigate(navigationRoutes.SELLING_ORDER_DETAIL);
      }
    } else if (sellingMode === SellMode.MultipleCard) {
      navigationService.navigate(navigationRoutes.SELLING_CARD_TYPE);
    } else {
      navigationService.navigate(navigationRoutes.SEARCH_PRODUCT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appliedProduct,
    imeiList,
    isInsurranceSelling,
    isOrderInsurrance,
    isPreSaleOrder,
    onSearchPromotionProductByImei,
    saleOrderDTO.saleOrderDetails,
    sellingMode,
    setImeiInfoCurrent,
  ]);
  const deliveryTabOnPress = useCallback(() => {
    navigationService.navigate(navigationRoutes.DELIVERY);
  }, []);
  const subsidyTabOnPress = useCallback(() => {
    navigationService.navigate(navigationRoutes.INFO_SUBSIDY_COMMON_SELL);
  }, []);
  const installmentTabOnPress = useCallback(() => {
    navigationService.navigate(navigationRoutes.INSTALLMENT_INFO);
  }, []);
  const tradeInTabOnPress = useCallback(() => {
    if (saleOrderDTO && saleOrderDTO.retailInputPriceId !== null) {
      onSetDetailInputPrice(saleOrderDTO.retailInputPriceId);
    } else {
      if (saleOrderDTO.isIncome === false) {
        DialogAlert.showWarning(
          "Thông báo",
          " Bạn chưa thanh toán đơn hàng. ",
          [
            {
              text: "Đóng",
            },
          ]
        );
        return;
      }
      DialogAlert.showInfo(
        "Thông báo",
        "Định giá không tồn tại! \n Nhấn Tiếp tục để định giá máy cũ",
        [
          {
            text: "Đóng",
          },
          {
            text: "Tiếp tục",
            onPress: () =>
              navigationService.navigate(
                navigationRoutes.TRADEIN_INFO_VALUATION
              ),
          },
        ]
      );
    }
  }, [onSetDetailInputPrice, saleOrderDTO]);

  const isDisabledCustomer = useMemo(() => {
    if (
      (!customerInfo.customerPhone && SellMode.SubsidySell === sellingMode) ||
      (!customerInfo.customerPhone &&
        SellMode.SubsidyInstallmentSell === sellingMode) ||
      (!customerInfo.customerPhone &&
        SellMode.SubsidyOnlineOrder === sellingMode)
    ) {
      return true;
    } else {
      return false;
    }
  }, [customerInfo.customerPhone, sellingMode]);

  const isDisabledProduct = useMemo(() => {
    if (
      (SellMode.InstallmentSell === sellingMode &&
        Boolean(!installmentRequest.installmentProgram)) ||
      (SellMode.SubsidySell === sellingMode && !isNotEmptyObj(checkBccsInfo)) ||
      (SellMode.SubsidyOnlineOrder === sellingMode &&
        !checkBccsInfo.packageCode)
    ) {
      return true;
    } else if (
      (SellMode.SubsidyInstallmentSell === sellingMode &&
        Boolean(!installmentRequest.installmentProgram)) ||
      (SellMode.SubsidyOnlineOrderInstallment === sellingMode &&
        Boolean(!installmentRequest.installmentProgram))
    ) {
      return true;
    } else if (isPreSaleOrder && !infoByCode?.customerId) {
      return true;
    } else {
      return false;
    }
  }, [
    checkBccsInfo,
    installmentRequest.installmentProgram,
    isPreSaleOrder,
    sellingMode,
    infoByCode?.customerId,
  ]);

  const isDisabledInstallment = useMemo(() => {
    if (
      SellMode.SubsidyInstallmentSell === sellingMode &&
      !isNotEmptyObj(checkBccsInfo)
    ) {
      return true;
    } else {
      return false;
    }
  }, [checkBccsInfo, sellingMode]);

  const isDisabledDelivery = useMemo(() => {
    if (
      ((SellMode.SubsidySell === sellingMode ||
        SellMode.SubsidyInstallmentSell === sellingMode) &&
        !isNotEmptyObj(checkBccsInfo)) ||
      (SellMode.SubsidyOnlineOrder === sellingMode &&
        !checkBccsInfo.packageCode)
    ) {
      return true;
    } else if (isPreSaleOrder && !infoByCode?.customerId) {
      return true;
    } else {
      return false;
    }
  }, [checkBccsInfo, infoByCode?.customerId, isPreSaleOrder, sellingMode]);

  const tabs: TabItem[] = [
    {
      name: "Đặt trước",
      action: () => {
        if (selectedTab === SelectedBottomTab.PreOrderTab) return;
        orderTabOnPress();
      },
      image:
        selectedTab === SelectedBottomTab.PreOrderTab ? (
          <Svgs.PreOrderSelling width={18} height={18} />
        ) : (
          <Svgs.PreOrderSellingDisable width={18} height={18} />
        ),
      tabType: SelectedBottomTab.PreOrderTab,
      disabled: customerHasOrderOnline || false,
      isShow: isPreSaleOrder,
      sellingMode: [-1],
    },
    {
      name: "Thu mua",
      action: () => {
        if (selectedTab === SelectedBottomTab.TradeInTab) return;
        if (sellingMode === SellMode.TradeIn && validate) return;
        tradeInTabOnPress();
      },
      image: (
        <Svgs.Purchase
          fill={
            selectedTab === SelectedBottomTab.TradeInTab ? "#EE0033" : "#AAAAAA"
          }
          width={18}
          height={18}
        />
      ),
      tabType: SelectedBottomTab.TradeInTab,
      disabled: customerHasOrderOnline || false,
      isShow: sellingMode === SellMode.TradeIn && saleOrderDTO.isIncome,
      sellingMode: [-1],
    },
    {
      name: "Subsidy",
      action: () => {
        if (selectedTab === SelectedBottomTab.SubsidyTab) return;
        subsidyTabOnPress();
      },
      image:
        selectedTab === SelectedBottomTab.SubsidyTab ? (
          <Svgs.SubsidySelling width={18} height={18} />
        ) : (
          <Svgs.IcSubsidySellingDisable width={18} height={18} />
        ),
      tabType: SelectedBottomTab.SubsidyTab,
      disabled: customerHasOrderOnline || false,
      isShow: false,
      sellingMode: [
        SellMode.SubsidySell,
        SellMode.SubsidyInstallmentSell,
        SellMode.SubsidyOnlineOrder,
        SellMode.SubsidyOnlineOrderInstallment,
      ],
    },
    {
      name: "Trả góp",
      action: () => {
        if (selectedTab === SelectedBottomTab.SubsidyInstallmentTab) return;
        installmentTabOnPress();
      },
      image:
        selectedTab === SelectedBottomTab.InstallmentTab ? (
          <Svgs.InstallmentSelling width={18} height={18} />
        ) : (
          <Svgs.InstallmentSellingInactive width={18} height={18} />
        ),
      tabType: SelectedBottomTab.InstallmentTab,
      disabled: isDisabledInstallment || customerHasOrderOnline,
      isShow:
        isInstallmentOrder(saleOrderDTO) || saleOrderTypeIdInfo?.isInstalment,
      sellingMode: [
        SellMode.InstallmentSell,
        SellMode.SubsidyInstallmentSell,
        SellMode.SubsidyOnlineOrderInstallment,
      ],
    },
    {
      name: "Khách hàng",
      action: () => {
        if (selectedTab === SelectedBottomTab.CustomerTab) return;
        customerTabOnPress();
      },
      image: (
        <Svgs.Customer
          fill={
            selectedTab === SelectedBottomTab.CustomerTab
              ? "#EE0033"
              : "#AAAAAA"
          }
          width={18}
          height={18}
        />
      ),
      tabType: SelectedBottomTab.CustomerTab,
      disabled: isDisabledCustomer || customerHasOrderOnline,
      isShow: true,
      sellingMode: [-1],
    },
    {
      name: "Sản phẩm",
      action: () => {
        if (selectedTab === SelectedBottomTab.ProductTab) return;
        if (sellingMode === SellMode.CommonSell && customerHasOrderOnline)
          return;
        productTabOnPress();
      },
      image: (
        <Svgs.Products
          fill={
            selectedTab === SelectedBottomTab.ProductTab ? "#EE0033" : "#AAAAAA"
          }
          width={18}
          height={18}
        />
      ),
      tabType: SelectedBottomTab.ProductTab,
      disabled: isDisabledProduct || customerHasOrderOnline,
      isShow: true,
      sellingMode: [-1],
    },
    {
      name: "Cài đặt & GH",
      action: () => {
        if (selectedTab === SelectedBottomTab.DeliveryTab) return;
        if (sellingMode === SellMode.CommonSell && customerHasOrderOnline)
          return;
        deliveryTabOnPress();
      },
      image: (
        <Svgs.Ic_Setting
          fill={
            selectedTab === SelectedBottomTab.DeliveryTab
              ? "#EE0033"
              : "#AAAAAA"
          }
          width={18}
          height={18}
        />
      ),
      tabType: SelectedBottomTab.DeliveryTab,
      disabled: isDisabledDelivery || customerHasOrderOnline,
      isShow: true,
      sellingMode: [-1],
    },
  ];
  const _tabs = useMemo(() => {
    return tabs.map((item) => {
      if (item.sellingMode.includes(sellingMode)) {
        return {
          ...item,
          isShow: true,
        };
      } else {
        return { ...item };
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sellingMode,
    isDisabledInstallment,
    isDisabledProduct,
    isDisabledCustomer,
    customerTabOnPress,
  ]);

  return (
    <View
      style={tw(
        "flex-row",
        "bg-white",
        "px-16",
        "py-20",
        "shadow-3",
        "justify-between"
      )}
    >
      {_tabs.map((item, index) => {
        return (
          item.isShow && (
            <TouchableOpacity
              key={`${index}`}
              onPress={() => {
                item.action();
              }}
              style={[
                tw("flex-1", "items-center"),
                item.disabled && tw("opacity-50"),
              ]}
              disabled={item.disabled}
            >
              {item.image}
              <Text
                style={tw(
                  selectedTab === item.tabType
                    ? "text-#EE0033"
                    : "text-#707070",
                  "mt-8",
                  "text-12"
                )}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )
        );
      })}
    </View>
  );
};

export default SellingBottomTab;
