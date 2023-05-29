import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Button from "src/components/base/Button";
import { PickerInputWithLabel } from "src/components/base/Input";
import Pix from "src/components/base/Pix";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import DialogAlert from "src/components/common/DialogAlert";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { RootStackParamList } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { isEmptyObj, isHasLength } from "src/utils/helpers";
import { StatisticApi } from "./api/StatisticApi";
import EmptyComponent from "./components/EmptyComponent";
import StaffContainer from "./components/StaffContainer";
import { ActionId } from "./constants";
import { Position, Staff, StaffList } from "./models/statistic";
import useStatisticStore from "./store/useStatisticStore";

type Props = StackScreenProps<
  RootStackParamList,
  "Statistic/StatisticAddStaff"
>;
const StatisticAddStaff = ({ route }: Props) => {
  const staffItem = route?.params?.item;
  const { tw } = useTailwind();

  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [staffSelected, setStaffSelected] = useState({} as Staff);
  const [positionSelected, setPositionSelected] = useState({} as Position);

  const [staffList, setStaffList] = useState<StaffList[]>([]);
  const [staffsGroup, setStaffsGroup, actionType, setActionType] =
    useStatisticStore((state) => [
      state.staffsGroup,
      state.setStaffsGroup,
      state.actionType,
      state.setActionType,
    ]);

  const getStaffs = async () => {
    const res = await StatisticApi.getStaffs().run();
    if (isHasLength(res)) {
      const _staffs = res.map((item) => {
        return { ...item, displayName: `${item.maNhanVien} - ${item.hoTen}` };
      });
      setStaffs(_staffs);
    }
  };

  const getStaffsPosition = async () => {
    const res = await StatisticApi.getStaffsPosition().run();
    if (isHasLength(res)) {
      setPositions(res);
    }
  };

  useEffect(() => {
    getStaffs();
    getStaffsPosition();
  }, []);

  useEffect(() => {
    if (isHasLength(staffsGroup)) {
      setStaffList(staffsGroup);
    }
  }, [staffsGroup]);

  useEffect(() => {
    if (actionType && actionType === ActionId.Edit) {
      if (staffItem) {
        setStaffSelected(staffItem?.staffSelected);
        setPositionSelected(staffItem?.positionSelected);
      }
    }
  }, [actionType, staffItem]);

  const onSubmitStaff = (staffSelected: Staff, positionSelected: Position) => {
    if (!isEmptyObj(staffSelected) && !isEmptyObj(positionSelected)) {
      if (actionType === ActionId.Edit) {
        if (staffSelected.maNhanVien === staffItem?.staffSelected?.maNhanVien) {
          const _staffItem = {
            staffSelected: { ...staffSelected, status: ActionId.Edit },
            positionSelected,
          };
          const _staffList = staffList.map((item) => {
            if (item?.staffSelected?.maNhanVien === staffSelected?.maNhanVien) {
              return _staffItem;
            } else return item;
          });
          setStaffList(_staffList);
          setStaffSelected({} as Staff);
          setPositionSelected({} as Position);
          setActionType(ActionId.Add);
        } else {
          const _staffItem = [
            {
              staffSelected: { ...staffSelected, status: ActionId.Add },
              positionSelected,
            },
          ];
          const isExist = staffList.some(
            (item) =>
              item.staffSelected?.maNhanVien === staffSelected?.maNhanVien
          );
          if (isExist) {
            DialogAlert.showError(
              "Lỗi",
              `Nhân viên ${staffSelected?.displayName} đã có trong danh sách!`
            );
            return;
          } else {
            const _filterStaff = staffList.map((item) => {
              if (
                item?.staffSelected.maNhanVien === staffSelected?.maNhanVien
              ) {
                return {
                  ...item,
                  staffSelected: {
                    ...item.staffSelected,
                    status: ActionId.Add,
                  },
                };
              } else if (
                item?.staffSelected.maNhanVien ===
                staffItem?.staffSelected?.maNhanVien
              ) {
                return {
                  ...item,
                  staffSelected: {
                    ...item.staffSelected,
                    status: ActionId.Delete,
                  },
                };
              } else {
                return item;
              }
            });
            setStaffList([..._filterStaff, ..._staffItem]);
            setStaffSelected({} as Staff);
            setPositionSelected({} as Position);
            setActionType(ActionId.Add);
          }
        }
      } else {
        const _staffItem = [
          {
            staffSelected: { ...staffSelected, status: ActionId.Add },
            positionSelected,
          },
        ];

        const isExist = staffList.some(
          (item) => item?.staffSelected?.maNhanVien === staffSelected.maNhanVien
        );
        if (isExist) {
          DialogAlert.showError(
            "Lỗi",
            `Nhân viên ${staffSelected.displayName} đã có trong danh sách!`
          );
          return;
        } else {
          setStaffList((prev) => [...prev, ..._staffItem]);
          setStaffSelected({} as Staff);
          setPositionSelected({} as Position);
        }
      }
    } else {
      DialogAlert.showInfo("Thông báo", `Vui lòng chọn đủ thông tin!`);
    }
  };

  const _renderItem = ({ item }: { item: StaffList }) => {
    return <StaffContainer item={item} onDeleteStaffList={onDeleteStaffList} />;
  };

  const onDeleteStaffList = (staffId: number) => {
    const filterItem = staffList.map((item) => {
      if (item?.staffSelected.maNhanVien === staffId) {
        return {
          ...item,
          staffSelected: {
            ...item.staffSelected,
            status: ActionId.Delete,
          },
        };
      } else {
        return item;
      }
    });
    setStaffList(filterItem);
  };

  const _staffListDisplay = useMemo(() => {
    return staffList.filter(
      (item) => item.staffSelected.status !== ActionId.Delete
    );
  }, [staffList]);

  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar
        title={
          actionType === ActionId.Edit ? "Sửa nhân viên" : "Thêm nhân viên"
        }
        onPressLeft={() => navigationService.goBack()}
      />
      <View style={tw("flex-1", "p-16")}>
        <View style={tw("bg-white", "shadow-5", "p-16", "rounded-10")}>
          <PickerInputWithLabel
            label="Mã nhân viên"
            name="staff"
            data={staffs}
            itemText={"displayName"}
            itemValue={"maNhanVien"}
            title="Chọn nhân viên"
            required
            value={staffSelected}
            onFinish={(staff) => setStaffSelected(staff)}
            titlePlaceholder="-Chọn mã nhân viên-"
            searchable
            searchPlaceholder="Tìm nhân viên"
          />

          <Pix size={16} />
          <PickerInputWithLabel
            label="Chức danh"
            name="level"
            data={positions}
            itemText={"tenChucDanh"}
            itemValue={"maChucDanhBD"}
            title="Chọn chức danh"
            required
            value={positionSelected}
            onFinish={(position) => setPositionSelected(position)}
            titlePlaceholder="-Chọn chức danh-"
            searchable
            searchPlaceholder="Tìm chức danh"
          />

          <Pix size={16} />
          <View style={tw("items-end")}>
            <View style={tw("w-1/3")}>
              <Button
                children={actionType === ActionId.Edit ? "Sửa" : "Thêm"}
                style={tw("bg-#EE0033")}
                rounded
                onPress={() => onSubmitStaff(staffSelected, positionSelected)}
              />
            </View>
          </View>
        </View>
        <Pix size={24} />
        <View style={tw("flex-1")}>
          <Text
            style={tw("font-semi-bold")}
          >{`Danh sách: ${_staffListDisplay.length}`}</Text>
          
          {/* Hien thi danh sach sau khi added */}
          <Pix size={16} />
          <View style={tw("flex-1")}>
            <FlatList
              keyExtractor={(item) => String(item.staffSelected.maNhanVien)}
              data={_staffListDisplay}
              renderItem={_renderItem}
              ListEmptyComponent={
                <EmptyComponent text="Hiện tại chưa có nhân viên nào!" />
              }
            />
          </View>
          
          <View style={tw("justify-around", "py-12")}>
            <Button
              children={"Xác nhận"}
              rounded
              outlined
              color="white"
              style={[
                tw("bg-#EE0033"),
                staffList.length > 0 ? null : tw("bg-#AAAAAA"),
              ]}
              disabled={staffList.length > 0 ? false : true}
              onPress={() => {
                setStaffsGroup(staffList);
                navigationService.goBack();
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default StatisticAddStaff;
