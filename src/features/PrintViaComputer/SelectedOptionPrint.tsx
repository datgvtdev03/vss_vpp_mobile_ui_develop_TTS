import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "src/components/base/Button";
// import ModalPortal from "src/components/common/Modal/ModalPortal";
import { useTailwind } from "src/lib/tailwind/tailwind";
import Checkbox from "src/components/base/Checkbox";
import colors from "src/constants/colors";
import { TextInput } from "src/components/base/Input";
import LoadingPortal from "src/components/base/LoadingPortal";
import usePrinterStore from "./usePdfPrint";
import { ModalPortal } from "src/components/common/Modal";
import Svgs from "src/constants/Svgs";
import Pix from "src/components/base/Pix";
import {
  addComputerPrint,
  ComputerPrint,
  deleteComputerPrint,
  getListComputerPrint,
} from "src/utils/persist";
import navigationService from "src/navigation/navigationService";
import { navigationRoutes } from "src/navigation/StackNavigator";
import { height } from "src/constants/device";

interface props {
  onViaComputer: (ip: string) => void;
  onDirectly?: (ip: string) => void;
  reqFromPrintOrder?: string;
  setModal?: (modal: boolean) => void;
}

const SelectedOptionPrint = ({
  onViaComputer,
  onDirectly,
  reqFromPrintOrder = "PrintOrderScreen",
  setModal,
}: props) => {
  const setListPrinter = usePrinterStore((state) => state.setListPrinter);
  const { setIpPrinterServer, getIpPrintServer } = usePrinterStore(
    (state) => state
  );

  const { tw } = useTailwind();
  const [checkedPrintDirectly, setCheckedPrintDirectly] =
    useState<boolean>(false);
  const [checkedPrintViaComputer, setCheckedPrintViaComputer] =
    useState<boolean>(true);
  const [errIp, setErrIp] = useState("");
  const [textIp, setTextIp] = useState(getIpPrintServer);
  const [addPrinter, setAddPrinter] = useState(false);
  const [errorAdd, setErrorAdd] = useState("");
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [listComputerPrint, setListComputerPrint] = useState<ComputerPrint[]>(
    []
  );
  const [nameComputerSelected, setNameComputerSelected] = useState("");

  useEffect(() => {
    getListComputerPrint().then((data) => {
      setListComputerPrint(data);
      setNameComputerSelected(data[0].name);
      setTextIp(data[0].ip);
    });
  }, []);

  // const handlerCheckboxPrintDirectly = () => {
  //   setCheckedPrintDirectly(true);
  //   setCheckedPrintViaComputer(false);
  // };

  const handlerCheckboxPrintViaComputer = () => {
    setCheckedPrintViaComputer(true);
    setCheckedPrintDirectly(false);
  };

  const fetchWithTimeout = async (
    resource: RequestInfo,
    options = { timeout: 8000 }
  ) => {
    // const { timeout = 8000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  };

  const loadServerPrint = async () => {
    LoadingPortal.show();
    try {
      const response = await fetchWithTimeout(
        `http://${textIp.trim()}:6868/printers`,
        {
          timeout: 5000,
        }
      );
      const res = await response.json();
      LoadingPortal.hide();
      return res;
    } catch (error) {
      LoadingPortal.hide();
    }
  };

  const onConFirmSelected = async () => {
    if (checkedPrintDirectly) {
      typeof onDirectly === "function" && onDirectly("");
      ModalPortal.dismissAll();
      return;
    }
    const data = await loadServerPrint();
    if (textIp === "") {
      setErrIp("Bạn chưa chọn máy tính.");
      return;
    }
    if (data === undefined) {
      setErrIp("Máy tính không khả dụng");
      return;
    }
    setErrIp("");
    setListPrinter(data.body);
    setIpPrinterServer(textIp);
    typeof onViaComputer === "function" && onViaComputer(textIp);
    ModalPortal.dismissAll();
    typeof setModal === "function" && setModal(false);
  };

  return (
    <View style={styles.component}>
      <View style={styles.titleBox}>
        <Text style={styles.textTitle}>Lựa chọn hình thức in</Text>
      </View>
      <View style={styles.boxSelected}>
        <Checkbox
          checked={checkedPrintViaComputer}
          text="In thông qua máy tính"
          color={colors.color_4353FA}
          onPress={() => handlerCheckboxPrintViaComputer()}
        />
        {/* <Checkbox
          checked={checkedPrintDirectly}
          text="In trực tiếp đến máy in"
          color={colors.color_4353FA}
          onPress={() => handlerCheckboxPrintDirectly()}
        /> */}
        {checkedPrintViaComputer && (
          <>
            <View style={styles.boxSelectedComputer}>
              <View style={tw("flex-row", "mt-10", "mb-10")}>
                <Text style={tw("text-16", "p-8", "flex-1")}>
                  Danh sách máy tính
                </Text>
                <TouchableOpacity
                  onPressIn={() => {
                    setAddPrinter((prev) => !prev);
                    setErrIp("");
                  }}
                  style={tw("p-8")}
                >
                  <Svgs.Add fill="#AAAAAA" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPressIn={async () => {
                    await deleteComputerPrint({
                      name: nameComputerSelected,
                      ip: textIp,
                    });
                    listComputerPrint &&
                      setListComputerPrint(
                        listComputerPrint.filter((printIP) => {
                          return printIP.ip !== textIp;
                        })
                      );
                    setTextIp("");
                    setErrIp("");
                    setAddPrinter(false);
                  }}
                  style={tw("p-8", "pt-14", "pl-4")}
                >
                  <Svgs.Ic_Delete_Printer />
                </TouchableOpacity>
              </View>
              <FlatList
                style={styles.h100}
                data={listComputerPrint}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <Checkbox
                    checked={
                      nameComputerSelected.trim().toLocaleLowerCase() ===
                      item.name.trim().toLocaleLowerCase()
                        ? true
                        : false
                    }
                    text={`${item.name}  -  ${item.ip}`}
                    color={colors.color_4353FA}
                    onPress={() => {
                      setNameComputerSelected(item.name);
                      setTextIp(item.ip);
                      setErrIp("");
                    }}
                  />
                )}
              />
              {/* <View style={{ padding: 5 }}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Nhập địa chỉ ip máy tính"
                  error={errIp}
                  name={""}
                  value={textIp}
                  onChangeText={(text) => {
                    setTextIp(text);
                    setErrIp("");
                  }}
                />
              </View> */}
            </View>
            {Boolean(addPrinter) && (
              <>
                <Pix size={16} />
                <View style={tw("flex-row", "items-center", "self-stretch")}>
                  <View style={tw("flex-1")}>
                    <TextInput
                      onChangeText={setName}
                      name="name"
                      placeholder="Tên máy tính"
                    />
                    <Pix size={6} />
                    <View style={tw("flex-row")}>
                      <TextInput
                        onChangeText={setIp}
                        style={tw("flex-1")}
                        name="ip"
                        placeholder="Địa chỉ ip"
                      />
                      <Pix size={6} />
                      <Button
                        onPressIn={async () => {
                          if (
                            name.trim().length === 0 ||
                            ip.trim().length === 0
                          ) {
                            setErrorAdd("Các trường không được để trống");
                          } else if (
                            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                              ip.trim()
                            )
                          ) {
                            setErrorAdd("Địa chỉ ip không hợp lệ");
                          } else {
                            setErrorAdd("");
                            setAddPrinter(false);
                            const newListComputePrint = await addComputerPrint({
                              name,
                              ip,
                            });
                            setTextIp(ip);
                            setNameComputerSelected(name);
                            setListComputerPrint(newListComputePrint);
                          }
                        }}
                        children="Thêm"
                      />
                    </View>
                  </View>
                </View>
                {Boolean(errorAdd) && (
                  <>
                    <Pix size={6} />
                    <Text style={tw("text-#EE0033")}>{errorAdd}</Text>
                  </>
                )}
              </>
            )}
          </>
        )}
      </View>
      <Text style={styles.errText}>{errIp}</Text>
      <View style={styles.boxBtn}>
        <Button
          style={[tw("w-1/3"), styles.btnOut]}
          onPress={() => {
            ModalPortal.dismissAll();
            typeof setModal === "function" && setModal(false);
            reqFromPrintOrder === "PrintOrderScreen" &&
              navigationService.navigate(navigationRoutes.MAIN);
          }}
          rounded
          color={colors.color_EE0033}
          children="Thoát"
        />
        <Button
          style={[tw("w-1/3", "self-center")]}
          onPress={onConFirmSelected}
          rounded
          color={colors.color_00A357}
          children="Chọn"
        />
      </View>
    </View>
  );
};

export default SelectedOptionPrint;

const styles = StyleSheet.create({
  component: {
    marginHorizontal: 30,
    marginVertical: 30,
  },
  boxSelected: {
    marginVertical: 20,
  },
  titleBox: {
    alignItems: "center",
  },
  textTitle: {
    fontSize: 18,
  },
  inputBox: {
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 10,
    borderColor: colors.color_C8C8CA,
  },
  boxBtn: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btnOut: {
    backgroundColor: colors.undoneOutTimeColor,
  },
  boxSelectedComputer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: colors.color_C1C1C3,
  },
  h100: {
    height: height * 0.18,
  },
  errText: {
    textAlign: "center",
    color: colors.color_error,
    marginBottom: 15,
  },
});
