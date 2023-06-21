import { StackScreenProps } from "@react-navigation/stack";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import Button from "src/components/base/Button";
import {
  PickerInputWithLabel,
  TextInputWithLabel,
} from "src/components/base/Input";
import Pix from "src/components/base/Pix";
import CardContainer from "src/components/common/CardContainer";
import { DatePickerButtonWithLabel } from "src/components/common/DatePickerButton";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import DialogAlert from "src/components/common/DialogAlert";
import InputWrapper from "src/components/utilities/InputWrapper";
import Svgs from "src/constants/Svgs";
import { globalData } from "src/constants/common";
import { useTailwind } from "src/lib/tailwind/tailwind";
import {
  RootStackParamList,
  navigationRoutes,
} from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { isEmptyObj, isHasLength } from "src/utils/helpers";
import { StatisticApi } from "../api/StatisticApi";
import { Device, Shift } from "../models/statistic";
import { useDispatch } from "react-redux";
import { reset_ProStatus } from "src/redux/ProSatusSlice";
import ProStatusList from "src/features/ProductionStatus/AddnewScreen/ProStatusList";
import { ProductionSituation } from "../models/productionSituation";
import { useSelector } from "react-redux";
interface RootState {
  proStatus: {
    proStatusList: ProductionSituation[];
  };
}
const Statistic_Demo = () => {
  const { tw } = useTailwind();

  const [dateInput, setDateInput] = useState(new Date());
  const [deviceSelected, setDeviceSelected] = useState({} as Device);
  const [shiftSelected, setShiftSelected] = useState({} as Shift);
  const [note, setNote] = useState("");

  const [devices, setDevices] = useState<Device[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [minDate, setMinDate] = useState<Date>();

  //redux
  const taking_ProStatus = useSelector(
    (state: RootState) => state.proStatus.proStatusList
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reset_ProStatus());
  }, []);
  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar
        title={"Thêm phiếu thống kê"}
        onPressLeft={() => {
          DialogAlert.showWarning(
            "Cảnh báo",
            "Quay lại sẽ làm mới toàn bộ dữ liệu thống kê!",
            [
              { text: "Hủy" },
              {
                text: "Đồng ý",
                onPress: () => {
                  navigationService.goBack();
                },
              },
            ]
          );
        }}
      />
      <InputWrapper>
        <ScrollView style={tw("flex-1")}>
          <View style={tw("py-16")}>
            <CardContainer
              titleCard="Thông tin nhập liệu"
              icon={<Svgs.InformationInput />}
              isOpen
              required
            >
              <DatePickerButtonWithLabel
                label="Ngày nhập liệu"
                maxDate={new Date()}
                minDate={minDate}
                value={dateInput}
                onChange={(date) => setDateInput(date)}
              />

              <Pix size={16} />
              <PickerInputWithLabel
                label="Tên thiết bị"
                name="deviceName"
                data={devices}
                itemText={"tenThietBi"}
                itemValue={"maThietBi"}
                title="Chọn thiết bị"
                required
                value={deviceSelected}
                onFinish={(device) => setDeviceSelected(device)}
                searchable
                searchPlaceholder="Tìm thiết bị"
              />

              <Pix size={16} />
              <PickerInputWithLabel
                label="Ca sản xuất"
                name="shift"
                data={shifts}
                itemText={"tenCa"}
                itemValue={"maCa"}
                title="Chọn ca"
                required
                value={shiftSelected}
                onFinish={(device) => setShiftSelected(device)}
                searchable
                searchPlaceholder="Tìm ca"
              />

              <Pix size={16} />
              <TextInputWithLabel
                label="Ghi chú"
                name="note"
                defaultValue={note}
                onChangeText={(note) => setNote(note)}
                maxLength={250}
                isClearText
                onClearText={() => setNote("")}
              />
            </CardContainer>

            <Pix size={16} />

            <CardContainer
              titleCard={`Danh sách hoạt động sản xuất (${taking_ProStatus.length})`}
              icon={<Svgs.Switch style={tw("mr-8")} />}
              titleAction="+ thêm"
              action={() => {
                navigationService.navigate(navigationRoutes.ADDPROSTATUSSCREEN);
              }}
              isOpen={isHasLength(taking_ProStatus)}
              isExpand
              // isDisableAction  vo hieu hóa actions
            >
              {isHasLength(taking_ProStatus) ? (
                <ProStatusList _item={taking_ProStatus} />
              ) : null}
            </CardContainer>
          </View>
        </ScrollView>
      </InputWrapper>

      <View
        style={tw("p-16", "bg-white", "shadow-7", "flex-row", "justify-around")}
      >
        <Button
          children={"Bỏ qua"}
          rounded
          minWidth
          outlined
          color="#EE0033"
          onPress={() => {
            DialogAlert.showWarning(
              "Cảnh báo",
              "Bỏ qua sẽ làm mới toàn bộ dữ liệu thống kê!",
              [
                { text: "Hủy" },
                {
                  text: "Đồng ý",
                  onPress: () => {
                    dispatch(reset_ProStatus());
                    navigationService.goBack();
                  },
                },
              ]
            );
          }}
        />
      </View>
    </View>
  );
};

export default Statistic_Demo;
