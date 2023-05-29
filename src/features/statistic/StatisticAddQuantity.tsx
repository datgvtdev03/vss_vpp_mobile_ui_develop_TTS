import { StackScreenProps } from "@react-navigation/stack";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Button from "src/components/base/Button";
import {
  PickerInputWithLabel,
  TextInputWithLabel,
} from "src/components/base/Input";
import Pix from "src/components/base/Pix";
import { RadioButtonGroup } from "src/components/base/RadioButton";
import RadioButton from "src/components/base/RadioButton/RadioButton";
import CardContainer from "src/components/common/CardContainer";
import { DatePickerButtonWithLabel } from "src/components/common/DatePickerButton";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import DialogAlert from "src/components/common/DialogAlert";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import {
  RootStackParamList,
  navigationRoutes,
} from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { isEmptyObj, isHasLength, randomId } from "src/utils/helpers";
import { StatisticApi } from "./api/StatisticApi";
import { ActionId, PostType } from "./constants";
import { ProductTicket, Stage, Unit } from "./models/statistic";
import useStatisticStore from "./store/useStatisticStore";

type Props = StackScreenProps<
  RootStackParamList,
  "Statistic/StatisticAddQuantity"
>;
const StatisticAddQuantity = ({ route }: Props) => {
  const actionType = route.params?.action;
  const actionItem = route.params?.item;
  const fromManagement = route.params?.fromManagement;

  const { tw } = useTailwind();

  const [idQuantity, setIdQuantity] = useState<number>(1);
  const [fromHour, setFromHour] = useState<Date>();
  const [toHour, setToHour] = useState<Date>();
  const [ticketSelected, setTicketSelected] = useState({} as any);
  const [stageSelected, setStageSelected] = useState({} as any);
  const [unitSelected, setUnitSelected] = useState({} as any);
  const [postType, setPostType] = useState(1);
  const [note, setNote] = useState("");
  const [sumQuantity, setSumQuantity] = useState<number>(0);
  const [failQuantity, setFailQuantity] = useState<number>(0);

  const [quantityGroup, setQuantityGroup] = useStatisticStore((state) => [
    state.quantityGroup,
    state.setQuantityGroup,
  ]);

  const [products, setProduct] = useState<ProductTicket[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const getProductTicketByDate = async () => {
    const resProduct = await StatisticApi.getProductTicketByDate(
      dayjs("2021-11-16").format("YYYY-MM-DD"),
      dayjs("2021-11-17").format("YYYY-MM-DD")
    ).run();
    isHasLength(resProduct) && setProduct(resProduct);
  };

  const getStages = async () => {
    const resStages = await StatisticApi.getStages().run();
    isHasLength(resStages) && setStages(resStages);
  };

  const getUnits = async () => {
    const resUnits = await StatisticApi.getUnits().run();
    isHasLength(resUnits) && setUnits(resUnits);
  };

  useEffect(() => {
    getProductTicketByDate();
    getStages();
    getUnits();
  }, []);

  // Sửa và sao chép thông tin sản lượng
  useEffect(() => {
    if (actionType && actionType === ActionId.Edit) {
      setIdQuantity(actionItem.id);
      setFromHour(new Date(actionItem.fromHour));
      setToHour(new Date(actionItem.toHour));
      setTicketSelected(actionItem.ticketSelected);
      setStageSelected(actionItem.stageSelected);
      setUnitSelected(actionItem.unitSelected);
      setPostType(actionItem.postType);
      setNote(actionItem.note);
      setSumQuantity(actionItem.sumQuantity);
      setFailQuantity(actionItem.failQuantity);
    } else if (actionType && actionType === ActionId.Copy) {
      setFromHour(new Date(actionItem.fromHour));
      setToHour(new Date(actionItem.toHour));
      setTicketSelected(actionItem.ticketSelected);
      setStageSelected(actionItem.stageSelected);
      setUnitSelected(actionItem.unitSelected);
      setPostType(actionItem.postType);
      setNote(actionItem.note);
      setSumQuantity(0);
      setFailQuantity(0);
    } else {
      return;
    }
  }, [route]);

  const isValidQuantityData = useMemo(() => {
    if (
      fromHour &&
      toHour &&
      !isEmptyObj(ticketSelected) &&
      !isEmptyObj(stageSelected) &&
      !isEmptyObj(unitSelected) &&
      Number(sumQuantity) &&
      Number(sumQuantity) >= Number(failQuantity)
    ) {
      return true;
    } else return false;
  }, [
    fromHour,
    toHour,
    ticketSelected,
    stageSelected,
    unitSelected,
    sumQuantity,
    failQuantity,
  ]);

  const onAddQuantity = async () => {
    if (actionType && actionType === ActionId.Edit) {
      const _itemEditQuantity = {
        id: idQuantity,
        idNhapThongKe: actionItem.idNhapThongKe,
        ngayNhap: actionItem.ngayNhap,
        fromHour,
        toHour,
        ticketSelected,
        stageSelected,
        unitSelected,
        postType,
        note,
        sumQuantity: Number(sumQuantity),
        failQuantity: Number(failQuantity),
        status: ActionId.Edit,
      };

      const filterItem = quantityGroup.map((item) =>
        item.id === idQuantity ? _itemEditQuantity : item
      );
      setQuantityGroup(filterItem);
      navigationService.goBack();
    } else if (actionType && actionType === ActionId.Add && fromManagement) {
      const _itemQuantity = [
        {
          id: null,
          idNhapThongKe: null,
          ngayNhap: null,
          tuGio: dayjs(fromHour).format("HH"),
          denGio: dayjs(toHour).format("HH"),
          idPhieuSp: ticketSelected.id,
          soPhieuSp: ticketSelected.soPhieuSp,
          idThanhPham: ticketSelected.idThanhPham,
          tenThanhPham: ticketSelected.tenThanhPham,
          idDonViTinh: unitSelected.maDonViTinh,
          tenDonViTinh: unitSelected.tenDonViTinh,
          noiDungCongViec: note,
          tongSanLuong: sumQuantity,
          sanLuongHong: failQuantity,
          idCongDoan: stageSelected.id,
          tenCongDoan: stageSelected.tenCongDoan,
          bitLenBai: postType === 1 ? false : true,
          status: ActionId.Add,
        },
      ];

      const _body = {
        ...actionItem,
        sanLuongThongKeList: [
          ...actionItem.sanLuongThongKeList,
          ..._itemQuantity,
        ],
      };

      const resAddQuantity = await StatisticApi.postUpdateStatistic(
        _body
      ).run();
      if (resAddQuantity) {
        DialogAlert.showSuccess("Thành công", "Thêm sản lượng thành công!", [
          {
            text: "Quay lại",
            onPress: () =>
              navigationService.navigate(navigationRoutes.STATISTIC_MANAGEMENT),
          },
        ]);
      }
    } else {
      const _itemAddQuantity = [
        {
          id: randomId(),
          idNhapThongKe: null,
          ngayNhap: null,
          fromHour,
          toHour,
          ticketSelected,
          stageSelected,
          unitSelected,
          postType,
          note,
          sumQuantity: Number(sumQuantity),
          failQuantity: Number(failQuantity),
          status: ActionId.Add,
        },
      ];
      setQuantityGroup([...quantityGroup, ..._itemAddQuantity]);
      navigationService.goBack();
    }
  };

  const diffHour = useMemo(() => {
    if (toHour && fromHour) {
      return dayjs(dayjs(toHour).format("YYYY-MM-DD HH:mm")).diff(
        dayjs(dayjs(fromHour).format("YYYY-MM-DD HH:mm"))
      );
    } else return 0;
  }, [toHour, fromHour]);

  useEffect(() => {
    if (diffHour < 0) {
      DialogAlert.showWarning(
        "Cảnh báo",
        "Giờ bắt đầu không được lớn hơn giờ kết thúc!",
        [{ text: "Đóng", onPress: () => setToHour(fromHour) }]
      );
    }
  }, [diffHour]);

  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar title="Thêm sản lượng" />
      <KeyboardAvoidingView
        style={tw("flex-1")}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={tw("flex-1")}>
          <View style={tw("py-16")}>
            <CardContainer
              titleCard="Thông tin sản lượng"
              isOpen
              isExpand={false}
              icon={<Svgs.Switch />}
            >
              <View style={tw("flex-row")}>
                <View style={tw("flex-1", "pr-8")}>
                  <DatePickerButtonWithLabel
                    label="Từ giờ"
                    required
                    mode="time"
                    value={fromHour}
                    onChange={(fromHour) => setFromHour(fromHour)}
                    format="HH:mm"
                    onlyTime
                    titlePlaceholder="-Chọn giờ-"
                  />
                </View>
                <View style={tw("flex-1", "pl-8")}>
                  <DatePickerButtonWithLabel
                    label="Đến giờ"
                    required
                    mode="time"
                    value={toHour}
                    onChange={(toHour) => setToHour(toHour)}
                    format="HH:mm"
                    onlyTime
                    titlePlaceholder="-Chọn giờ-"
                  />
                </View>
              </View>

              <Pix size={16} />
              <PickerInputWithLabel
                label="Phiếu thành phẩm"
                name={"psp"}
                required
                data={products}
                itemText={"soPhieuSp"}
                itemValue={"id"}
                title="Chọn phiếu thành phẩm"
                titlePlaceholder="-Chọn phiếu thành phẩm-"
                value={ticketSelected}
                onFinish={(ticket) => setTicketSelected(ticket)}
                searchable
                searchPlaceholder="Tìm thành phẩm"
              />

              <Pix size={16} />
              <TextInputWithLabel
                name="ticketName"
                label="Tên thành phẩm"
                disabled
                value={
                  ticketSelected?.tenThanhPham
                    ? ticketSelected?.tenThanhPham
                    : ""
                }
              />

              <Pix size={16} />
              <PickerInputWithLabel
                label="Công đoạn sản xuất"
                name={"productStep"}
                required
                data={stages}
                itemText={"tenCongDoan"}
                itemValue={"id"}
                title="Chọn công đoạn"
                titlePlaceholder="-Chọn công đoạn-"
                value={stageSelected}
                onFinish={(stage) => setStageSelected(stage)}
                searchable
                searchPlaceholder="Tìm công đoạn"
              />

              <Pix size={16} />
              <TextInputWithLabel
                name="note"
                label="Nội dung công việc"
                value={note}
                onChangeText={(text) => setNote(text)}
              />

              <Pix size={16} />
              <PickerInputWithLabel
                label="Đơn vị tính"
                name={"unit"}
                required
                data={units}
                itemText={"tenDonViTinh"}
                itemValue={"maDonViTinh"}
                title="Chọn đơn vị"
                titlePlaceholder="-Chọn đơn vị-"
                value={unitSelected}
                onFinish={(unit) => setUnitSelected(unit)}
                searchable
                searchPlaceholder="Tìm đơn vị"
              />

              <Pix size={16} />
              <RadioButtonGroup
                onValueChange={(value) => {
                  setPostType(Number(value));
                }}
                value={postType}
              >
                <View>
                  <View style={tw("flex-row")}>
                    <Text style={tw("text-#707070")}>Lên bài</Text>
                  </View>
                  <RadioButton
                    text="Chạy tiếp và không lên bài"
                    textStyle={tw("text-#707070")}
                    value={PostType.NoPost}
                  />
                  <RadioButton
                    text="Có lên bài mới"
                    textStyle={tw("text-#707070")}
                    value={PostType.Post}
                  />
                </View>
              </RadioButtonGroup>

              <Pix size={16} />
              <TextInputWithLabel
                name="sumQuantity"
                label="Tổng sản lượng sản xuất"
                keyboardType={"number-pad"}
                value={String(sumQuantity)}
                onChangeText={(text) => setSumQuantity(Number(text))}
                required
              />

              <Pix size={16} />
              <TextInputWithLabel
                name="failQuantity"
                label="Sản lượng hỏng"
                keyboardType={"number-pad"}
                value={String(failQuantity)}
                onChangeText={(text) => setFailQuantity(Number(text))}
                error={
                  Number(failQuantity) > Number(sumQuantity)
                    ? "Sản lượng hỏng không được lớn hơn tổng sản lượng"
                    : ""
                }
              />
            </CardContainer>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={tw("p-16", "bg-white")}>
        <Button
          children={actionType && actionType === ActionId.Edit ? "Sửa" : "Thêm"}
          rounded
          style={isValidQuantityData ? tw("bg-#EE0033") : tw("bg-#AAAAAA")}
          onPress={() => onAddQuantity()}
          disabled={!isValidQuantityData}
        />
      </View>
    </View>
  );
};

export default StatisticAddQuantity;
