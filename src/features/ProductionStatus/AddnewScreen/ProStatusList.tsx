import { FlatList, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductionSituation } from "src/features/statistic/models/productionSituation";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { navigationRoutes } from "src/navigation/StackNavigator";
import Svgs from "src/constants/Svgs";
import navigationService from "src/navigation/navigationService";
import MultipleChoiceAction from "src/components/common/MultipleChoiceAction";
import {
  ActionId,
  BottomSheetActionProps,
} from "src/features/statistic/constants";

import DialogAlert from "src/components/common/DialogAlert";
import { del_ProStatus } from "src/redux/ProSatusSlice";
import { ModalPortal } from "src/components/common/Modal";
import { isHasLength, randomId } from "src/utils/helpers";
import { StackScreenProps } from "@react-navigation/stack";
import dayjs from "dayjs";
import UpdateProStatus from "./UpdateProStatus";
import { useNavigation } from "@react-navigation/native";
interface Props {
  _item: ProductionSituation[];
}

const ProStatusList = ({ _item }: Props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { tw } = useTailwind();
  const delete_ProStatus = (_id) => {
    dispatch(del_ProStatus(_id));
  };
  const handleActon = (item, action) => {
    switch (action.actionId) {
      case ActionId.Copy: {
        navigationService.navigate(navigationRoutes.UPDATE_PROSTATUS, {
          item: item,
          idNhapThongKe: item.idNhapThongKe,
        });
        ModalPortal.dismissAll();
        break;
      }
      case ActionId.Edit: {
        // navigationService.push(navigationRoutes.UPDATE_PROSTATUS, {
        //   action: ActionId.Edit,
        //   item: item,
        //   idNhapThongKe: item.idNhapThongKe,
        // });
        navigationService.navigate(navigationRoutes.UPDATE_PROSTATUS, {
          action: ActionId.Edit,
          item: item,
          idNhapThongKe: item.idNhapThongKe,
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
    <FlatList
      style={tw("flex-1")}
      data={_item}
      renderItem={({ item }) => renderProStatus(item)}
    />
  );
};

export default ProStatusList;
