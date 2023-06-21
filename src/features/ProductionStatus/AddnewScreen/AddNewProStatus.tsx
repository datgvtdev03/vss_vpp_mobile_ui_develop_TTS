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
import {
  RootStackParamList,
  navigationRoutes,
} from "src/navigation/StackNavigator";
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
} from "src/redux/ProSatusSlice";
import { StackScreenProps } from "@react-navigation/stack";
//import ProductionSituationItem from "src/features/statistic/productionLog/productionSituation/ProductionSituationItem";
interface RootState {
  proStatus: {
    proStatusList: ProductionSituation[];
  };
}
type Props = StackScreenProps<
  RootStackParamList,
  "ProductionStatus/AddProStatus"
>;
const AddProStatusScreen = ({ route }: Props) => {
  const idNhapThongKe = route?.params?.idNhapThongKe;

  //redux -toolkit
  const dispatch = useDispatch();

  const [isView, setIsView] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().subtract(7));
  const [toDate, setToDate] = useState(new Date());

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
  const [proStatusList, setProStatusList] = useState<ProductionSituation[]>([]);
  const [ProStatusObject, setProStatusObject] = useState<ProductionSituation>(
    {} as ProductionSituation
  );
  //const [isView, setView] = useState(true)
  //axios get post del
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
    if (startHour && endHour) {
      const _diff = dayjs(dayjs(endHour).format("YYYY-MM-DD HH:mm")).diff(
        dayjs(dayjs(startHour).format("YYYY-MM-DD HH:mm"))
      );
      const worked_hour = dayjs(_diff).subtract(7, "hour").format("HH:mm");
      setTotalHour(worked_hour);
    }
  }, [startHour, endHour]);

  // const getProStatusList = async () => {
  //   const res = await StatisticApi.getSearchProductionSituationById(
  //     idNhapThongKe
  //   ).run();

  //   isHasLength(res) && dispatch(setProStatus(res));
  // };
  // useEffect(() => {
  //   getProStatusList();
  // }, []);
  const taking_ProStatus = useSelector(
    (state: RootState) => state.proStatus.proStatusList
  );

  useEffect(() => {
    getReasons();
    getStages();
  }, []);

  const AddProStatus = async () => {
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
  };
  const delete_ProStatus = (_id) => {
    dispatch(del_ProStatus(_id));
  };
  const handleActon = (item, action) => {
    switch (action.actionId) {
      case ActionId.Copy: {
        ModalPortal.dismissAll();
        break;
      }
      case ActionId.Edit: {
        navigationService.push(navigationRoutes.UPDATE_PROSTATUS, {
          action: ActionId.Edit,
          item: item,
        });
        ModalPortal.dismissAll();
        break;
      }
      case ActionId.Delete: {
        DialogAlert.showInfo("Thông báo", "bạn muốn xóa không", [
          { text: "Hủy" },
          {
            text: "Đồng ý",
            onPress: () => {
              delete_ProStatus(item.id);
            },
          },
        ]);
        ModalPortal.dismissAll();
        break;
      }
    }
  };
  //popub

  //error

  const isErrorDate = useMemo(() => {
    const s1 = dayjs(startHour).format("HH:mm");
    const s2 = dayjs(endHour).format("HH:mm");
    if (endHour && startHour && (s1 === s2 || s1 > s2)) {
      return true;
    }
    return false;
  }, [startHour, endHour]);
  const renderProStatus = (item) => {
    return (
      <View style={tw("bg-white", "rounded-10", "shadow-2", "p-16", "my-8")}>
        <View style={tw("flex-1")}>
          <MultipleChoiceAction
            actionList={[ActionId.Edit, ActionId.Copy, ActionId.Delete]}
            action={(action) => handleActon(item, action)}
          >
            <TouchableOpacity style={tw("absolute", "right-8", "top-8", "p-8")}>
              <Svgs.ThreeDot fill={"#000000"} />
            </TouchableOpacity>
          </MultipleChoiceAction>
        </View>
        <View style={tw("flex-row", "flex-1", "pb-16")}>
          <View style={tw("flex-1")}>
            <Text style={tw("text-#707070", "pb-8")}>{`Từ giờ`}</Text>
            <View style={tw("flex-row", "items-center")}>
              <Svgs.Calendar width={15} />
              <Text style={tw("pt-4", "items-center", "pl-8")}>
                {item.tuGio}
              </Text>
            </View>
          </View>

          <View style={tw("flex-1")}>
            <Text style={tw("text-#707070", "pb-8")}>{`Đến giờ`}</Text>
            <View style={tw("flex-row", "items-center")}>
              <Svgs.Calendar width={15} />
              <Text style={tw("pt-4", "items-center", "pl-8")}>
                {item.denGio}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-row", "flex-1", "pb-16")}>
          <View style={tw("flex-1")}>
            <Text style={tw("text-#707070", "pb-8")}>{`Lý do`}</Text>
            <View style={tw("flex-row", "items-center")}>
              <Svgs.Ic_Reason width={15} />
              <Text style={tw("pt-4", "items-center", "pl-8")}>
                {item.lyDo}
              </Text>
            </View>
          </View>

          <View style={tw("flex-1")}>
            <Text style={tw("text-#707070", "pb-8")}>{`Số giờ`}</Text>
            <View style={tw("flex-row", "items-center")}>
              <Svgs.Ic_Alarm width={15} />
              <Text
                style={tw(
                  "pt-4",
                  "items-center",
                  "pl-8",
                  "text-red-500",
                  "font-bold"
                )}
              >
                {item.soGio}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-row", "flex-1")}>
          <View style={tw("flex-1")}>
            <Text
              style={tw("text-#707070", "pb-8")}
            >{`Nội dung thực hiện`}</Text>
            <View style={tw("flex-row", "items-center")}>
              <Svgs.Ic_Content width={15} />
              <Text style={tw("pt-4", "items-center", "pl-8")}>
                {item.noiDung}
              </Text>
            </View>
          </View>
          <View style={tw("flex-1")}>
            <Text
              style={tw("text-#707070", "pb-8")}
            >{`Công đoạn sản xuất`}</Text>
            <View style={tw("flex-row", "items-center")}>
              <Svgs.Step width={15} />
              <Text style={tw("pt-4", "items-center", "pl-8")}>
                {item.tenCongDoan}
              </Text>
            </View>
          </View>
        </View>
      </View>
      //</TouchableOpacity>
    );
  };
  return (
    <Provider store={store}>
      <View style={tw("flex-1")}>
        <DefaultActionBar
          title="Thêm tình trạng hoạt động sản xuất"
          onPressLeft={() => {
            navigationService.goBack();
          }}
        />
        <InputWrapper>
          <ScrollView style={tw("flex-1")}>
            <View style={tw("py-16")}>
              {/*  */}
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
                      error={isErrorDate ? `bạn đã nhập sai giá trị ` : ""}
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
                  itemValue={"maLyDo"}
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
              {/*  */}
              {/* <Pix size={16} /> */}

              <CardContainer
                titleCard={`Danh sách hoạt động sản xuất (${taking_ProStatus.length})`}
                icon={<Svgs.Switch style={tw("mr-8")} />}
                titleAction="+ Thêm"
                action={() => {
                  navigationService.push(navigationRoutes.UPDATE_PROSTATUS, {
                    idNhapThongKe: idNhapThongKe,
                  });
                }}
                isOpen={false}
                isExpand
                isDisableAction={false}
              >
                <FlatList
                  style={tw("flex-1")}
                  data={taking_ProStatus}
                  renderItem={({ item }) => renderProStatus(item)}
                  //keyExtractor={(item, index) => item.id.toString() + '-' + index.toString()}
                />
              </CardContainer>
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
            children={"Thêm"}
            minWidth
            rounded
            outlined
            color="#EE0033"
            onPress={() =>
              !isErrorDate && startHour < endHour ? AddProStatus() : null
            }
          />
        </View>
      </View>
    </Provider>
  );
};
export default AddProStatusScreen;
