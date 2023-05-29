import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Pix from "src/components/base/Pix";
import DialogAlert from "src/components/common/DialogAlert";
import { ModalPortal } from "src/components/common/Modal";
import MultipleChoiceAction from "src/components/common/MultipleChoiceAction";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { ActionId, BottomSheetActionProps, StatisticType } from "../constants";
import useStatisticStore from "../store/useStatisticStore";
import { StaffList } from "../models/statistic";

interface StaffContainerProps {
  item: StaffList;
  isView?: boolean;
  onDeleteStaffList?: (staffId: number) => void;
}

const StaffContainer = ({
  item,
  isView,
  onDeleteStaffList,
}: StaffContainerProps) => {
  const { tw } = useTailwind();

  const _route = useRoute();
  const [statisticType, staffsGroup, setStaffsGroup, setActionType] =
    useStatisticStore((state) => [
      state.statisticType,
      state.staffsGroup,
      state.setStaffsGroup,
      state.setActionType,
    ]);

  const isAddStaffScreen = useMemo(() => {
    return _route?.name?.includes("StatisticAddStaff");
  }, [_route]);

  const handleActionStaffGroup = (
    item: StaffList,
    action: BottomSheetActionProps
  ) => {
    switch (action.actionId) {
      case ActionId.Edit: {
        setActionType(ActionId.Edit);
        navigationService.push(navigationRoutes.STATISTIC_ADD_STAFF, {
          item: item,
        });
        ModalPortal.dismissAll();
        break;
      }
      case ActionId.Delete: {
        DialogAlert.showInfo(
          "Thông báo",
          `Bạn có chắn chắc ${item?.staffSelected?.displayName} muốn xóa không?`,
          [
            { text: "Hủy" },
            {
              text: "Đồng ý",
              onPress: () => {
                if (isAddStaffScreen) {
                  onDeleteStaffList &&
                    onDeleteStaffList(item?.staffSelected?.maNhanVien);
                } else {
                  onDeleteStaffGroup(item?.staffSelected?.maNhanVien);
                }
              },
            },
          ]
        );
        break;
      }
      default:
        break;
    }
  };

  const onDeleteStaffGroup = (staffId: number) => {
    const filterItem = staffsGroup.map((item) => {
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
    setStaffsGroup(filterItem);
  };

  return (
    <View style={tw("bg-white", "rounded-10", "shadow-2", "p-16", "my-8")}>

      <View style={tw("flex-row")}>
        <View style={tw("w-1/3")}>
          <Text>{`Nhân viên:`}</Text>
        </View>
        <View style={tw("w-2/3", "pr-16")}>
          <Text>{item?.staffSelected?.displayName}</Text>
        </View>
      </View>

      <Pix size={16} />
      <View style={tw("flex-row")}>
        <View style={tw("w-1/3")}>
          <Text>{`Chức danh:`}</Text>
        </View>
        <View>
          <Text>{item?.positionSelected?.tenChucDanh}</Text>
        </View>
      </View>

      {isView ? null : statisticType ===
        StatisticType.Personal ? null : isAddStaffScreen ? (
        <TouchableOpacity
          style={tw("absolute", "right-8", "top-8", "p-8")}
          onPress={() => {
            DialogAlert.showInfo(
              "Thông báo",
              `Bạn muốn xóa ${item?.staffSelected?.displayName} khỏi danh sách!`,
              [
                { text: "Hủy" },
                {
                  text: "Đồng ý",
                  onPress: () =>
                    onDeleteStaffList &&
                    onDeleteStaffList(item?.staffSelected?.maNhanVien),
                },
              ]
            );
          }}
        >
          <Svgs.Delete />
        </TouchableOpacity>
      ) : (
        <MultipleChoiceAction
          actionList={[ActionId.Edit, ActionId.Delete]}
          action={(action) => handleActionStaffGroup(item, action)}
        >
          <TouchableOpacity style={tw("absolute", "right-8", "top-8", "p-8")}>
            <Svgs.ThreeDot fill={"#000000"} />
          </TouchableOpacity>
        </MultipleChoiceAction>
      )}
    </View>
  );
};

export default StaffContainer;
