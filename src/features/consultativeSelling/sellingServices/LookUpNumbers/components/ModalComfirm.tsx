import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInputWithLabel } from "src/components/base/Input";
import DialogAlert from "src/components/common/DialogAlert";
import { ModalPortal } from "src/components/common/Modal";
import { globalData } from "src/constants/common";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { SimLookUpDTO } from "src/models/consultativeSelling/prepaidSubcriber/LookUpNumbers";
import { prepaidSubcriberApi } from "src/services/api/consultativeSelling/prepaidSubcriber/prepaidSubcriberApi";
import { formatDateSim } from "src/utils/helpers";
type Props = {
  sim: SimLookUpDTO;
};
const ModalComfirm = ({ sim }: Props) => {
  const { tw } = useTailwind();
  console.log({ globalData });
  const [note, setNote] = useState<string>("");
  const ConfirmHandler = useCallback(() => {
    ModalPortal.dismissAll();
    setTimeout(() => {
      prepaidSubcriberApi
        .getLockSim({
          IMEI: sim.imei,
          OrderType: 1,
          OrderDate: formatDateSim() + ".123Z",
          StoreID: globalData.defaultStore.storeId,
          Description: note ? note : "",
          OrderUser: globalData.userName,
        })
        .loading(true)
        .run()
        .then((e) => {
          if (e && e.errorCode === 0) {
            DialogAlert.showSuccess("Thành công", "Giữ Sim thành công");
          } else {
            DialogAlert.showError("Thất bại", e.description);
          }
        })
        .catch(() => {
          DialogAlert.showError("Thất bại", "Đã xảy ra lỗi");
        });
    }, 200);
  }, [note, sim]);
  return (
    <View style={tw("p-26")}>
      <Text style={tw("mb-25", "text-14")}>
        Bạn có chắc chắn muốn giữ số {sim.imei}?
      </Text>
      <TextInputWithLabel
        label="Nội dung"
        name=""
        value={note}
        onChangeText={(e) => setNote(e)}
        placeholder="Nhập"
      />
      <View style={tw("flex-row", "mt-25", "mx-6", "justify-between")}>
        <TouchableOpacity
          onPress={() => {
            ModalPortal.dismissAll();
          }}
          style={styles.cancel}
        >
          <Text style={[tw("text-18", "pt-12", "pb-8"), styles.cancelText]}>
            Huỷ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            ConfirmHandler();
          }}
          style={[styles.cancel, styles.yes]}
        >
          <Text
            style={[
              tw("text-18", "pt-12", "pb-8"),
              styles.cancelText,
              styles.text,
            ]}
          >
            Đồng ý
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalComfirm;

const styles = StyleSheet.create({
  cancel: {
    borderRadius: 22,
    width: 120,
    borderColor: "#EB002D",
    borderWidth: 1,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    backgroundColor: "#FFFFFF",
    elevation: 4,
  },
  cancelText: {
    textAlign: "center",
    color: "#EB002D",
    fontWeight: "400",
  },
  yes: {
    backgroundColor: "#EB002D",
  },
  text: {
    color: "#FFFFFF",
  },
});
