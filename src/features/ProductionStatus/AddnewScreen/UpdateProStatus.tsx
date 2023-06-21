import {
  View,
  ScrollView,
  Alert,
  Text,
  FlatList,
  addons,
  TouchableOpacity,
} from "react-native";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import React, { useEffect, useMemo, useState } from "react";
import Pix from "src/components/base/Pix";
import CardContainer from "src/components/common/CardContainer";
import Svgs from "src/constants/Svgs";
import {
  PickerInputWithLabel,
  TextInputWithLabel,
} from "src/components/base/Input";
import { DatePickerButtonWithLabel } from "src/components/common/DatePickerButton";
import InputWrapper from "src/components/utilities/InputWrapper";
import { StatisticApi } from "src/features/statistic/api/StatisticApi";
import Button from "src/components/base/Button";
import {
  HoatDongThongKeList,
  Shift,
  Stage,
} from "../../statistic/models/statistic";
import { Reason } from "../../statistic/models/consumableMaterials";
import { isHasLength, randomId } from "src/utils/helpers";
import dayjs from "dayjs";
import Vi from "src/locales/vi";
import MultipleChoiceAction from "src/components/common/MultipleChoiceAction";
import {
  ActionId,
  BottomSheetActionProps,
} from "src/features/statistic/constants";
import DialogAlert from "src/components/common/DialogAlert";
import { ProductionSituation } from "src/features/statistic/models/productionSituation";
import { ModalPortal } from "src/components/common/Modal";
import { height } from "src/constants/device";
import { proStatusRoutes } from "../ProductionStatusRouter";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "src/redux/store";
import {
  add_ProSatus,
  setProStatus,
  del_ProStatus,
  Update_ProStatus,
} from "src/redux/ProSatusSlice";
import { number } from "yup";
type Props = StackScreenProps<
  RootStackParamList,
  "ProductionStatus/UpdateProStatus"
>;
const UpdateProStatus = ({ route }: Props) => {
  const item = route?.params?.item;
  const actionType = route?.params?.action;
  const idNhapThongKe = route?.params?.action;
  const dispatch = useDispatch();
  const [startHour, setStartHour] = useState<Date>();
  const [endHour, setEndHour] = useState<Date>();
  const [totalHour, setTotalHour] = useState<string>("");
  const [error1, setIt] = useState(true);
  const { tw } = useTailwind();
  //
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [Stages, setStages] = useState<Stage[]>([]);
  const [slectedReason, setSelectedReason] = useState<Reason>({} as Reason);
  const [selectedStage, setSelectedStage] = useState<Stage>({} as Stage);
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");
  const [ProStatusObject, setProStatusObject] = useState<ProductionSituation>(
    {} as ProductionSituation
  );
  const getReasons = async () => {
    const res = await StatisticApi.getReasons().run();
    // Alert.alert(JSON.stringify(res))
    isHasLength(res) && setReasons(res);
  };
  const getStages = async () => {
    const res = await StatisticApi.getStages().run();
    isHasLength(res) && setStages(res);
  };
  useEffect(() => {
    getReasons();
    getStages();
  }, []);
  useEffect(() => {
    if (actionType === ActionId.Edit) {
      const selectedReason = reasons.find(
        (reason) => reason.id === item.idLyDo
      );
      const _selectedStage = Stages.find(
        (stage) => stage.id === item.idCongDoan
      );
      if (typeof item.tuGio === "string" && typeof item.denGio === "string") {
        const tamp_statHour = item.tuGio ? item.tuGio.split(":") : [];
        const tamp_EndHour = item.denGio ? item.denGio.split(":") : [];
        const _startHour = dayjs()
          .hour(tamp_statHour[0])
          .minute(tamp_statHour[1])
          .toDate();
        const _endHour = dayjs()
          .hour(tamp_EndHour[0])
          .minute(tamp_EndHour[1])
          .toDate();
        setStartHour(_startHour);
        setEndHour(_endHour);
      } else {
        setStartHour(item.tuGio);
        setEndHour(item.denGio);
      }

      setSelectedReason(selectedReason ? selectedReason : ({} as Reason));
      setSelectedStage(_selectedStage ? _selectedStage : ({} as Stage));
      setNote(item.ghiChu);
      setContent(item.noiDung);
    }
  }, [actionType, reasons, Stages]);
  useEffect(() => {
    if (startHour && endHour) {
      const _diff = dayjs(dayjs(startHour).format("YYYY-MM-DD HH:mm")).diff(
        dayjs(dayjs(endHour).format("YYYY-MM-DD HH:mm"))
      );
    }
  }, [startHour, endHour]);
  useEffect(() => {}, [reasons, Stages]);
  useEffect(() => {
    if (startHour && endHour) {
      const _diff = dayjs(dayjs(endHour).format("YYYY-MM-DD HH:mm")).diff(
        dayjs(dayjs(startHour)).format("YYYY-MM-DD HH:mm")
      );
      const tottal_hour = dayjs(_diff).subtract(7, "hour").format("HH:mm");

      setTotalHour(tottal_hour);
    }
  }, [startHour, endHour]);
  const isErrorDate = useMemo(() => {
    const s1 = dayjs(startHour).format("HH:mm");
    const s2 = dayjs(endHour).format("HH:mm");
    if (endHour && startHour && (s1 === s2 || s1 > s2)) {
      return true;
    }
    return false;
  }, [startHour, endHour]);
  const check_date = () => {
    const s1 = dayjs(startHour).format("HH:mm");
    const s2 = dayjs(endHour).format("HH:mm");
    console.log(s1 >= s2);
    return s1 >= s2;
  };
  const update_ProStatus = () => {
    const updated_ProStatus: ProductionSituation = {
      id: item.id,
      idNhapThongKe: item.idNhapThongKe,
      ngayNhap: new Date().valueOf(),
      tuGio: dayjs(startHour).format("HH:mm"),
      denGio: dayjs(endHour).format("HH:mm"),
      soGio: totalHour || null,
      noiDung: content,
      ghiChu: note,
      idLyDo: slectedReason?.id,
      idCongDoan: selectedStage?.id,
      lyDo: slectedReason?.lyDo,
      tenCongDoan: selectedStage?.id,
      status: "",
    };
    //  console.log(newProStatus);
    dispatch(Update_ProStatus(updated_ProStatus));
    DialogAlert.showSuccess("Thông báo", "Cập nhật thành công", [
      {
        text: "OK",
        onPress: () => navigationService.goBack(),
      },
    ]);
  };

  const AddProStatus = async () => {
    if (!check_date()) {
      const newProStatus = {
        id: randomId(),
        idNhapThongKe: idNhapThongKe || "",
        ngayNhap: new Date().valueOf(),
        tuGio: dayjs(startHour).format("HH:mm"),
        denGio: dayjs(endHour).format("HH:mm"),
        soGio: totalHour || null,
        noiDung: content,
        ghiChu: note,
        idLyDo: slectedReason?.id,
        idCongDoan: selectedStage?.id,
        lyDo: slectedReason?.lyDo,
        tenCongDoan: selectedStage?.id,
        status: "",
      };

      dispatch(add_ProSatus(newProStatus));
      DialogAlert.showSuccess("Thông báo", "Thêm thành công", [
        {
          text: "OK",
          onPress: () => navigationService.goBack(),
        },
      ]);
    }
  };
  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar
        title="Câp nhật trạng hoạt động sản xuất"
        onPressLeft={() => {
          navigationService.goBack();
        }}
      />
      <InputWrapper>
        <ScrollView style={tw("flex-1")}>
          <View style={tw("py-16")}>
            <View
              style={tw(
                "bg-white",
                "mx-16",
                "rounded-10",
                "flex-1",
                "px-8",
                "py-12"
              )}
            >
              <View style={tw("flex-row")}>
                <View style={tw("flex-1", "pr-8")}>
                  <DatePickerButtonWithLabel
                    label="Từ giờ"
                    required
                    mode="time"
                    format="HH:mm"
                    value={startHour}
                    onChange={(hour) => setStartHour(hour)}
                    onlyTime
                    titlePlaceholder="-chọn giờ-"
                    error={isErrorDate ? "bạn đã nhập sai giá trị" : ""}
                  />
                </View>
                <View style={tw("flex-1", "pl-8")}>
                  <DatePickerButtonWithLabel
                    label="Đến giờ"
                    required
                    mode="time"
                    format="HH:mm"
                    value={endHour}
                    onChange={(hour) => setEndHour(hour)}
                    onlyTime
                    error={isErrorDate ? "bạn đã nhập sai giá trị" : ""}
                  />
                </View>
              </View>
              <Pix size={16} />
              <TextInputWithLabel
                name="totalHours"
                label="Số giờ"
                value={totalHour}
                disabled
              />
              <Pix size={16} />
              <PickerInputWithLabel
                label="Lý do"
                name={"reasons"}
                data={reasons}
                itemText={"lyDo"}
                itemValue={"id"}
                title="Chọn lý do"
                value={slectedReason}
                onFinish={(reason) => setSelectedReason(reason)}
                searchable
                required
              />
              <Pix size={16} />
              <PickerInputWithLabel
                label="Công đoạn sản xuất"
                name={"proStages"}
                data={Stages}
                itemText={"tenCongDoan"}
                itemValue={"id"}
                title="Chọn công đoạn"
                titlePlaceholder="Chọn công đoạn"
                value={selectedStage}
                onFinish={(stage) => setSelectedStage(stage)}
                searchable
                required
              />
              <Pix size={16} />
              <TextInputWithLabel
                label="Nội dung thực hiện"
                name="exContent"
                style={tw("h-80")}
                multiline
                maxLength={250}
                value={content}
                onChangeText={(content) => setContent(content)}
                //clear
                //  isClearText
                onClearText={() => setContent("")}
                //
              />
              <Pix size={16} />
              <TextInputWithLabel
                name="note"
                label="Ghi chú"
                value={note}
                onChangeText={(note) => setNote(note)}
                //  isClearText
                onClearText={() => setNote("")}
                style={tw("h-80")}
                multiline
                maxLength={250}
              />
            </View>
          </View>
        </ScrollView>
      </InputWrapper>

      <View style={tw("p-16", "bg-white", "flex-row", "justify-around")}>
        <Button
          children={"Hủy"}
          minWidth
          rounded
          outlined
          color="#EE0033"
          onPress={() => navigationService.goBack()}
        />
        <Button
          children={
            actionType && actionType === ActionId.Edit ? "Cập nhật" : "thêm"
          }
          minWidth
          rounded
          outlined
          color="#EE0033"
          onPress={() =>
            actionType === ActionId.Edit ? update_ProStatus() : AddProStatus()
          }
        />
      </View>
    </View>
  );
};
export default UpdateProStatus;
