import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, Dimensions, View, Platform, Text } from "react-native";
// import Pdf from "react-native-pdf";
// import PDFView from "react-native-view-pdf";
import {
  navigationRoutes,
  RootStackParamList,
} from "src/navigation/StackNavigator";
import usePrinterStore from "./usePdfPrint";
import { PickerInputWithLabel } from "src/components/base/Input";
import { useTailwind } from "src/lib/tailwind/tailwind";
import Button from "src/components/base/Button";
import { Printer } from "./printer";
import DialogAlert from "src/components/common/DialogAlert";
import LoadingPortal from "src/components/base/LoadingPortal";
import navigationService from "src/navigation/navigationService";
import FileViewer from "react-native-file-viewer";
import useOrderStore from "../consultativeSelling/store/useOrderStore";
import useSellingTradeInValuation from "../consultativeSelling/sellingTradeIn/useSellingTradeInValuation";
import Pix from "src/components/base/Pix";

const { width, height } = Dimensions.get("window");

type Props = StackScreenProps<RootStackParamList, "Selling/PDFBase">;
const PDFBase = ({ route }: Props) => {
  const path = route.params.path || "";
  const saleOrderId = route.params.saleOrderId || "";
  const arrayPathFilePdf = route.params.arrayPathFilePdf || [];
  const typeBill = route.params.typeBill;
  const routerWhenPrintSuccess = route.params.routerWhenPrintSuccess || "";
  const subOrderPath = route.params.subOrderPath;
  const listPrinter = usePrinterStore((state) => state.getListPrinter);
  const ipServer = usePrinterStore((state) => state.getIpPrintServer);
  const [printerSelected, setPrinterSelected] = useState<Printer>(
    listPrinter[0] as Printer
  );
  const isSellingTradeIn = useOrderStore((state) => state.isSellingTradeIn);
  const setIsSellingTradeIn = useOrderStore(
    (state) => state.setIsSellingTradeIn
  );
  const { goToOrderDetailAndCreateSaleOrderCode } =
    useSellingTradeInValuation();

  const { tw } = useTailwind();

  const showPopupErr = () => {
    LoadingPortal.hide();

    return DialogAlert.showError(
      "In thất bại",
      "Có lỗi xảy ra trong quá trình in"
    );
  };

  const createNewFormData = (
    namePrinterSelected: string,
    pathFile: string
  ): FormData => {
    const formData = new FormData();
    formData.append("namePrinter", namePrinterSelected);
    formData.append(
      "pdfFile",
      JSON.parse(
        JSON.stringify({
          uri: Platform.OS === "ios" ? pathFile : `file://${pathFile}`,
          name: pathFile.split("/").slice(-1)[0],
          type: "application/pdf",
        })
      )
    );
    return formData;
  };

  const fetchApiPrint = async (formData: FormData) => {
    return await fetch(`http://${ipServer}:6868/print`, {
      method: "POST",
      body: formData,
    });
  };

  // tiến hành in http://${ipServerInComputer}:6868/print
  const goToPrint = async () => {
    LoadingPortal.show();
    let checkPrintSuccess = true;
    if (arrayPathFilePdf.length > 0) {
      const goToPrintInvoice = async () => {
        for (let index = 0; index < arrayPathFilePdf.length; index++) {
          const pathInLoop = arrayPathFilePdf[index];
          if (!checkPrintSuccess) {
            return;
          }
          const formDataLoop = createNewFormData(
            printerSelected.name,
            pathInLoop
          );
          try {
            const resCall = await fetchApiPrint(formDataLoop);
            if (resCall && resCall.status !== 200) {
              showPopupErr();
              checkPrintSuccess = false;
            }
          } catch {
            showPopupErr();
            checkPrintSuccess = false;
          }
        }
      };
      await goToPrintInvoice();
    }
    try {
      if (arrayPathFilePdf.length === 0) {
        const formData = createNewFormData(printerSelected.name, path);
        let subOrderFormData;
        if (subOrderPath) {
          subOrderFormData = createNewFormData(
            printerSelected.name,
            subOrderPath
          );
        }
        const response = await fetchApiPrint(formData);
        //in sub
        const resPrintSubOrder =
          subOrderPath && (await fetchApiPrint(subOrderFormData));
        if (
          subOrderPath &&
          resPrintSubOrder &&
          resPrintSubOrder.status !== 200
        ) {
          showPopupErr();
          return;
        }
        if (response && response.status !== 200) {
          showPopupErr();
          return;
        }
      }
      // response.json();
      if (arrayPathFilePdf.length > 0 && !checkPrintSuccess) {
        return;
      }
      const messPrintSuccess =
        typeBill === "laserPrint"
          ? "In hóa đơn chuyển đổi thành công"
          : "In hóa đơn nhiệt thành công";

      LoadingPortal.hide();
      DialogAlert.showSuccess("Thành công", messPrintSuccess, [
        {
          text: "Xong",
          onPress: () => {
            if (isSellingTradeIn) {
              setTimeout(() => {
                DialogAlert.showInfo(
                  "Thông báo",
                  "Bạn có muốn định giá máy cũ ngay không?",
                  [
                    {
                      text: "Không",
                      onPress: () => {
                        setIsSellingTradeIn(false);
                        navigationService.reset(navigationRoutes.MAIN);
                      },
                    },
                    {
                      text: "Có",
                      onPress: () => {
                        setIsSellingTradeIn(false);
                        if (saleOrderId) {
                          goToOrderDetailAndCreateSaleOrderCode(saleOrderId);
                        }
                      },
                    },
                  ]
                );
              }, 500);
              return;
            }

            //custom redirect screen when print success
            routerWhenPrintSuccess !== ""
              ? navigationService.navigate(routerWhenPrintSuccess)
              : navigationService.reset(navigationRoutes.MAIN);
          },
        },
      ]);
    } catch (error) {
      // DialogAlert.showError("Thông báo", "Lỗi hệ thống");
      LoadingPortal.hide();
    }
  };

  const goToPreviewFIle = (path) => {
    FileViewer.open(path)
      .then(() => {
        // success
      })
      .catch((_) => {
        DialogAlert.showError(
          "Thông báo",
          "Thiết bị của bạn không được hỗ trợ xem trước \n tệp tin này!"
        );
      });
  };

  const renderBtnPreviewPdf = () => {
    if (arrayPathFilePdf.length > 0) {
      return arrayPathFilePdf.map((pathLoop, index) => {
        return (
          <View key={index}>
            <Button
              style={tw("self-center")}
              children={`Xem trước hóa đơn ${index + 1}`}
              onPress={() => goToPreviewFIle(pathLoop)}
            />
            <Pix size={5} />
          </View>
        );
      });
    } else {
      return (
        <Button
          style={tw("self-center")}
          children="Xem trước hóa đơn in"
          onPress={() => goToPreviewFIle(path)}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabSelected}>
        <PickerInputWithLabel
          style={{ width: width / 1.5 }}
          // error={wardStatus}
          label="Chọn máy in"
          name="printer"
          required
          data={listPrinter}
          value={printerSelected.name ? printerSelected : listPrinter[0]}
          onFinish={(printer) => {
            setPrinterSelected(printer);
          }}
          itemValue="name"
          itemText="name"
          title="Chọn máy in"
          searchable
          searchPlaceholder="Tìm kiếm máy in"
          numberOfLines={1}
        />
        <Button
          style={[tw("self-center"), styles.btnPrint]}
          children="In"
          onPress={async () => {
            await goToPrint();
          }}
        />
      </View>
      <View style={styles.note}>
        <Text style={{ fontWeight: "bold" }}>Lưu ý: </Text>
        <Text> - Chọn máy in phù hợp với loại hoá đơn trước khi in</Text>
        <Text> - Đảm bảo chọn máy in đang hoạt động</Text>
      </View>
      <View style={styles.btnBox}>{renderBtnPreviewPdf()}</View>
    </View>
  );
};

export default PDFBase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
    paddingHorizontal: 24,
  },
  pdf: {
    flex: 1,
    width: width - 48,
    height: height,
    marginTop: 50,
  },
  tabSelected: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 30,
  },
  btnPrint: {
    width: 70,
    marginBottom: -4,
  },
  note: {
    alignItems: "flex-start",
    width: "100%",
    flexDirection: "row",
    marginTop: 15,
    flexWrap: "wrap",
  },
  btnBox: { flex: 1, justifyContent: "center", alignItems: "center" },
});
