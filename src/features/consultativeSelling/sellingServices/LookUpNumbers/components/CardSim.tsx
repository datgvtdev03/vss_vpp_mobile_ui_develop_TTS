import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Divider from "src/components/base/Divider";
import { BottomModal } from "src/components/common/Modal";
import Svgs from "src/constants/Svgs";
import usePrepaidSubcriberStore from "src/features/consultativeSelling/store/usePrepaidSubcriberStore";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { SimLookUpDTO } from "src/models/consultativeSelling/prepaidSubcriber/LookUpNumbers";
import navigationService from "src/navigation/navigationService";
import { formatVND } from "src/utils/helpers";
import ModalComfirm from "src/features/consultativeSelling/sellingServices/LookUpNumbers/components/ModalComfirm";
import DialogAlert from "src/components/common/DialogAlert";
import { navigationRoutes } from "src/navigation/StackNavigator";
const numberWithCommas = (x: string) => {
  if (x.toString().length > 9) {
    return (
      x.toString().slice(0, x.length - 9) +
      x
        .toString()
        .slice(-9)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    );
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
type Props = {
  item: SimLookUpDTO;
  isPrepaidSubscriber?: boolean;
};
const statusSimData = [
  {
    id: -1,
    name: "Tất cả",
  },
  {
    id: 1,
    name: "Sim mới",
  },
  {
    id: 2,
    name: "Sim đang giữ",
  },
  {
    id: 3,
    name: "Sim đã đấu nối",
  },
];
const CardSim = ({ item, isPrepaidSubscriber }: Props) => {
  const [modals, setModals] = useState<boolean>(false);
  const { tw } = useTailwind();
  const setPhoneNumber = usePrepaidSubcriberStore(
    (state) => state.setPhoneNumber
  );
  return (
    <>
      <TouchableOpacity
        style={styles.cardSearch}
        onPress={() => {
          if (item.status !== 3) {
            setModals(true);
          }
        }}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.textNumber}>
            {item.imei ? numberWithCommas(item.imei) : ""}
          </Text>
          <View style={styles.viewPay}>
            <Svgs.IconPaySim width={12} height={12} />
            <Text style={styles.textPay}>{formatVND(item.price)}</Text>
          </View>
          <View style={styles.viewSim}>
            <Svgs.IconSimType width={12} height={12} />
            <Text style={styles.textSim}>{item.simTypeName}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Svgs.SimNew width={36} height={36} />
          <Text style={styles.iconSimMoi}>
            {statusSimData[item.status].name}
          </Text>
        </View>
      </TouchableOpacity>
      <BottomModal
        swipeThreshold={100}
        width={1}
        visible={modals}
        onSwipeOut={() => setModals(false)}
        onTouchOutside={() => setModals(false)}
        modalStyle={styles.bottomModal}
        modalTitle={
          <Divider
            lineSize={5}
            size={56}
            paddingMainAxis={[12, 16]}
            color={"#AAAAAA"}
          />
        }
      >
        <View>
          <TouchableOpacity
            // disabled={item.Status === 1}
            onPress={() => {
              if (item.status === 1) {
                if (!isPrepaidSubscriber) {
                  setModals(false);
                  DialogAlert.showCustomView(<ModalComfirm sim={item} />);
                  // navigationService.goBack();
                } else {
                  navigationService.goBack();
                }
                setModals(false);
              }
            }}
            style={[
              tw("px-16", "py-11", "flex-row", "mx-22", "mb-16"),
              styles.border,
              tw(item.status === 1 ? "opacity-100" : "opacity-50"),
            ]}
          >
            <View style={tw("flex-row", "flex-1", "items-center")}>
              <Svgs.SimRed />
              <Text style={tw("ml-16")}>
                {!isPrepaidSubscriber ? "Giữ số" : "Huỷ"}
              </Text>
            </View>
            <Svgs.ArrowRed style={tw("self-center")} />
          </TouchableOpacity>
          <TouchableOpacity
            // disabled={item.Status === 1 || item.Status === 2}
            onPress={() => {
              if (item.status === 1 || item.status === 2) {
                setModals(false);
                setPhoneNumber(item.imei);
                if (isPrepaidSubscriber) {
                  navigationService.goBack();
                  return;
                } else {
                  navigationService.navigate(
                    navigationRoutes.PREPAID_SUBCRIBER,
                    {
                      screen: "InfoPrepaidCustomer",
                      isLookUpNumber: true,
                    }
                  );
                }
              }
            }}
            style={[
              tw(
                "px-16",
                "py-11",
                "flex-row",
                "mx-22",
                "mb-16",
                item.status === 1 || item.status === 2
                  ? "opacity-100"
                  : "opacity-50"
              ),
              styles.border,
            ]}
          >
            <View style={tw("flex-row", "flex-1", "items-center")}>
              <Svgs.SimGreen />
              <Text style={tw("ml-16")}>
                {!isPrepaidSubscriber ? "Tạo yêu cầu Đấu nối TBTT" : "Đồng ý"}
              </Text>
            </View>
            <Svgs.ArrowRed style={tw("self-center")} />
          </TouchableOpacity>
        </View>
      </BottomModal>
    </>
  );
};

export default CardSim;

const styles = StyleSheet.create({
  cardSearch: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardLeft: {},
  textNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  viewPay: {
    paddingVertical: 8,
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textPay: {
    fontSize: 12,
    color: "#FF684B",
    paddingLeft: 12,
  },
  viewSim: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textSim: {
    fontSize: 12,
    color: "#707070",
    paddingLeft: 12,
  },
  cardRight: {
    paddingTop: 5,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  iconSimMoi: {
    fontSize: 12,
    color: "#707070",
    paddingTop: 10,
  },
  bottomModal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 34,
  },
  border: {
    borderRadius: 22,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    backgroundColor: "#FFFFFF",
    elevation: 4,
  },
});
