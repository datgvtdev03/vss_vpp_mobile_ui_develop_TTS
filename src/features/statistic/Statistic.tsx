import { StackScreenProps } from "@react-navigation/stack";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
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
import Svgs from "src/constants/Svgs";
import { globalData } from "src/constants/common";
import { useTailwind } from "src/lib/tailwind/tailwind";
import {
  RootStackParamList,
  navigationRoutes,
} from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { isEmptyObj, isHasLength } from "src/utils/helpers";
import { StatisticApi } from "./api/StatisticApi";
import QuantityDetail from "./components/QuantityDetail";
import StaffContainer from "./components/StaffContainer";
import { ActionId, StatisticType } from "./constants";
import { Device, Shift } from "./models/statistic";
import useStatisticStore from "./store/useStatisticStore";

type Props = StackScreenProps<RootStackParamList, "Statistic/Statistic">;
const Statistic = ({ route }: Props) => {
  const { tw } = useTailwind();
  const _statisticType = route.params?.statisticType;
  const _fromManagement = route.params?.fromManagement;
  const _dataManagement = route.params?.dataManagement;
  const _managementAction = route.params?.managementAction;

  const [dateInput, setDateInput] = useState(new Date());
  const [deviceSelected, setDeviceSelected] = useState({} as Device);
  const [shiftSelected, setShiftSelected] = useState({} as Shift);
  const [note, setNote] = useState("");

  const [devices, setDevices] = useState<Device[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [
    statisticType,
    setStatisticType,
    staffsGroup,
    setStaffsGroup,
    quantityGroup,
    setActionType,
    resetStatisticData,
  ] = useStatisticStore((state) => [
    state.statisticType,
    state.setStatisticType,
    state.staffsGroup,
    state.setStaffsGroup,
    state.quantityGroup,
    state.setActionType,
    state.resetStatisticData,
  ]);

  useEffect(() => {
    if (_statisticType === StatisticType.Personal) {
      const _staffsGroup = [
        {
          staffSelected: globalData.userInfo,
          positionSelected: globalData.userPosition,
        },
      ];
      setStaffsGroup(_staffsGroup);
    }
    _statisticType && setStatisticType(_statisticType);
  }, [_statisticType]);

  useEffect(() => {
    if (_fromManagement) {
      if (isHasLength(devices) && isHasLength(shifts)) {
        const _deviceSelected = devices.find(
          (device) => device.idThietBi === _dataManagement.idThietBi
        );
        const _shiftSelected = shifts.find(
          (shift) => shift.id === _dataManagement.idCa
        );
        setDateInput(new Date(_dataManagement?.ngayNhap));
        setDeviceSelected(_deviceSelected ? _deviceSelected : ({} as Device));
        setShiftSelected(_shiftSelected ? _shiftSelected : ({} as Shift));
        setNote(_dataManagement?.ghiChu);
      }
    }
  }, [_fromManagement, devices, shifts]);

  const getDevices = async () => {
    const res = await StatisticApi.getDevices().run();
    if (isHasLength(res)) {
      setDevices(res);
    }
  };

  const getShifts = async () => {
    const res = await StatisticApi.getShifts().run();
    if (isHasLength(res)) {
      setShifts(res);
    }
  };

  useEffect(() => {
    getDevices();
    getShifts();
  }, []);

  const _staffsGroupDisplay = useMemo(() => {
    return staffsGroup.filter(
      (item) => item.staffSelected.status !== ActionId.Delete
    );
  }, [staffsGroup]);

  const _quantityGroupDisplay = useMemo(() => {
    return quantityGroup.filter((item) => item.status !== ActionId.Delete);
  }, [quantityGroup]);

  const isValidDataStatistic = useMemo(() => {
    const validQuantityGroup = _quantityGroupDisplay.every((item) => {
      if (item.sumQuantity > 0 && item.sumQuantity >= item.failQuantity) {
        return true;
      } else {
        return false;
      }
    });
    if (
      isHasLength(staffsGroup) &&
      isHasLength(_quantityGroupDisplay) &&
      validQuantityGroup &&
      !isEmptyObj(deviceSelected) &&
      !isEmptyObj(shiftSelected) &&
      dateInput
    ) {
      return true;
    }
    return false;
  }, [
    staffsGroup,
    _quantityGroupDisplay,
    deviceSelected,
    shiftSelected,
    dateInput,
  ]);

  const handleSaveStatistic = async () => {
    const _staffsGroup = staffsGroup.reduce((prev, item) => {
      const _staff = [
        {
          id:
            _fromManagement && _managementAction === ActionId.Edit
              ? item.staffSelected.id
              : null,
          maNhanVien: item.staffSelected.maNhanVien,
          maNhanVienBD: item.staffSelected.maNhanVienBD,
          hoTen: item.staffSelected.hoTen,
          displayName: item.staffSelected.displayName,
          dienThoai: item.staffSelected.diaChi,
          email: item.staffSelected.email,
          ngaySinh: item.staffSelected.ngaySinh,
          gioiTinh: item.staffSelected.gioiTinh,
          diaChi: item.staffSelected.diaChi,
          idChucDanhNv: item.positionSelected.maChucDanh,
          tenChucDanh: item.positionSelected.tenChucDanh,
          bitTruongCa: item.positionSelected.bitTruongCa,
          status: item.staffSelected.status,
        },
      ];
      return [...prev, ..._staff];
    }, []);

    const _quantityGroup = quantityGroup.reduce((prev, item) => {
      const _quantity = [
        {
          id:
            _fromManagement && _managementAction === ActionId.Edit
              ? item.id
              : null,
          idNhapThongKe:
            _fromManagement && _managementAction === ActionId.Edit
              ? item.idNhapThongKe
              : null,
          ngayNhap:
            _fromManagement && _managementAction === ActionId.Edit
              ? item.ngayNhap
              : null,
          tuGio: dayjs(item.fromHour).format("HH"),
          denGio: dayjs(item.toHour).format("HH"),
          idPhieuSp: item.ticketSelected.id,
          soPhieuSp: item.ticketSelected.soPhieuSp,
          idThanhPham: item.ticketSelected.idThanhPham,
          tenThanhPham: item.ticketSelected.tenThanhPham,
          idDonViTinh: item.unitSelected.maDonViTinh,
          tenDonViTinh: item.unitSelected.tenDonViTinh,
          noiDungCongViec: item.note,
          tongSanLuong: item.sumQuantity,
          sanLuongHong: item.failQuantity,
          idCongDoan: item.stageSelected.id,
          tenCongDoan: item.stageSelected.tenCongDoan,
          bitLenBai: item.postType === 1 ? false : true,
          status: item.status,
        },
      ];
      return [...prev, ..._quantity];
    }, []);

    const body = {
      id:
        _fromManagement && _managementAction === ActionId.Edit
          ? _dataManagement.id
          : null,
      idThietBi: deviceSelected.idThietBi,
      tenThietBi: deviceSelected.tenThietBi,
      idCa: shiftSelected.id,
      tenCa: shiftSelected.tenCa,
      ngayNhap: dayjs(dateInput).format("YYYY-MM-DD"),
      ghiChu: note,
      bitDuyet:
        _fromManagement &&
        _managementAction === ActionId.Edit &&
        _dataManagement.bitDuyet
          ? _dataManagement.bitDuyet
          : false,
      nhomThoThongKeList: _staffsGroup,
      sanLuongThongKeList: _quantityGroup,
      tieuHaoThongKeList: [],
      hoatDongThongKeList: [],
    };

    if (_fromManagement && _managementAction === ActionId.Edit) {
      const resUpdate = await StatisticApi.postUpdateStatistic(body)
        .loadingMessage("Sửa thông kê")
        .run();
      if (resUpdate) {
        DialogAlert.showSuccess("Thông báo", "Sửa thống kê thành công!", [
          {
            text: "Đóng",
            onPress: () => {
              resetStatisticData();
              navigationService.reset(navigationRoutes.MAIN);
            },
          },
        ]);
      }
    } else {
      const resInsert = await StatisticApi.postInsertStatistic(body)
        .loadingMessage("Thêm mới thông kê")
        .run();
      if (resInsert) {
        DialogAlert.showSuccess("Thông báo", "Thêm thống kê thành công!", [
          {
            text: "Đóng",
            onPress: () => {
              resetStatisticData();
              navigationService.reset(navigationRoutes.MAIN);
            },
          },
        ]);
      }
    }
  };

  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar
        title={_fromManagement ? "Sửa thống kê" : "Thống kê"}
        onPressLeft={() => {
          if (_fromManagement) {
            navigationService.goBack();
          } else {
            DialogAlert.showWarning(
              "Cảnh báo",
              "Quay lại sẽ làm mới toàn bộ dữ liệu thống kê!",
              [
                { text: "Hủy" },
                {
                  text: "Đồng ý",
                  onPress: () => {
                    resetStatisticData();
                    navigationService.goBack();
                  },
                },
              ]
            );
          }
        }}
      />

      <ScrollView style={tw("flex-1")}>
        <View style={tw("py-16")}>
          <CardContainer
            titleCard="Thông tin nhập liệu"
            icon={<Svgs.InformationInput />}
            isOpen
          >
            <DatePickerButtonWithLabel
              label="Ngày nhập liệu"
              maxDate={new Date()}
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
            />

            <Pix size={16} />
            <TextInputWithLabel
              label="Ghi chú"
              name="note"
              defaultValue={note}
              onChangeText={(note) => setNote(note)}
            />
          </CardContainer>

          {/* Thong tin nhom tho can lam  */}
          <Pix size={16} />
          <CardContainer
            titleCard={`Thông tin nhóm thợ (${_staffsGroupDisplay.length})`}
            icon={<Svgs.StaffsGroup />}
            action={() => {
              setActionType(ActionId.Add);
              navigationService.navigate(navigationRoutes.STATISTIC_ADD_STAFF);
            }}
            isDisableAction={statisticType === StatisticType.Personal}
            titleAction={
              statisticType === StatisticType.Personal ? "" : "+ Thêm"
            }
            isOpen={isHasLength(_staffsGroupDisplay)}
          >
            {isHasLength(_staffsGroupDisplay)
              ? _staffsGroupDisplay.map((item, index) => (
                  <StaffContainer key={String(index)} item={item} />
                ))
              : null}
          </CardContainer>

          {/* Thong tin san luong can lam */}
          <Pix size={16} />
          <CardContainer
            titleCard={`Thông tin sản lượng (${_quantityGroupDisplay.length})`}
            icon={<Svgs.QuantityGroup />}
            action={() =>
              navigationService.navigate(
                navigationRoutes.STATISTIC_ADD_QUANTITY,
                { action: ActionId.Add }
              )
            }
            titleAction={"+ Thêm"}
            isOpen={isHasLength(_quantityGroupDisplay)}
          >
            {isHasLength(_quantityGroupDisplay)
              ? _quantityGroupDisplay.map((item, index) => (
                  <QuantityDetail key={String(index)} item={item} />
                ))
              : null}
          </CardContainer>
        </View>
      </ScrollView>
      <View style={tw("p-16", "bg-white", "shadow-7")}>
        <Button
          children={"Lưu"}
          rounded
          style={!isValidDataStatistic ? tw("bg-#AAAAAA") : tw("bg-#EE0033")}
          disabled={!isValidDataStatistic}
          onPress={() => {
            handleSaveStatistic();
          }}
        />
      </View>
    </View>
  );
};
export default Statistic;
