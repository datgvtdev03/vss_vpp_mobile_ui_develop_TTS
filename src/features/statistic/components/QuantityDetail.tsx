import dayjs from "dayjs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MultipleChoiceAction from "src/components/common/MultipleChoiceAction";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { formatNumber } from "src/utils/helpers";
import { ActionId, PostName } from "../constants";
import navigationService from "src/navigation/navigationService";
import { navigationRoutes } from "src/navigation/StackNavigator";
import { ModalPortal } from "src/components/common/Modal";
import DialogAlert from "src/components/common/DialogAlert";
import useStatisticStore from "../store/useStatisticStore";
import { QuantityInfo } from "../models/statistic";

interface StaffContainerProps {
  item: QuantityInfo;
  isView?: boolean;
}

const QuantityDetail = ({ item, isView }: StaffContainerProps) => {
  const [quantityGroup, setQuantityGroup] = useStatisticStore((state) => [
    state.quantityGroup,
    state.setQuantityGroup,
  ]);

  const handleBottomAction = (item, action) => {
    switch (action.actionId) {
      case ActionId.Copy: {
        navigationService.push(navigationRoutes.STATISTIC_ADD_QUANTITY, {
          action: ActionId.Copy,
          item: item,
        });
        ModalPortal.dismissAll();
        break;
      }
      case ActionId.Edit: {
        navigationService.push(navigationRoutes.STATISTIC_ADD_QUANTITY, {
          action: ActionId.Edit,
          item: item,
        });
        ModalPortal.dismissAll();
        break;
      }
      case ActionId.Delete: {
        DialogAlert.showInfo("Thông báo", "Bạn có chắn chắc muốn xóa không?", [
          { text: "Hủy" },
          { text: "Đồng ý", onPress: () => onDeleteQuantity(item) },
        ]);
        break;
      }
      default:
        break;
    }
  };

  const onDeleteQuantity = (itemDelete) => {
    const filterItem = quantityGroup.map((item) => {
      if (item.id === itemDelete.id) {
        return { ...item, status: ActionId.Delete };
      } else return item;
    });
    setQuantityGroup(filterItem);
  };

  const { tw } = useTailwind();
  return (
    <View style={tw("bg-white", "rounded-10", "shadow-2", "p-16", "my-8")}>
      <View style={tw("flex-row")}>
        <View style={tw("flex-1", "py-8", "mr-4")}>
          <Text style={tw("text-#707070")}>{`Tên thành phẩm`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Product />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8")}>
                {item?.ticketSelected?.tenThanhPham}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-1", "py-8")}>
          <Text style={tw("text-#707070")}>{`Phiếu sản phẩm`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.ProductTicket />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8")}>{item?.ticketSelected?.soPhieuSp}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={tw("flex-row")}>
        <View style={tw("flex-1", "py-8")}>
          <Text style={tw("text-#707070")}>{`Từ giờ`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Clock />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8")}>
                {isView
                  ? dayjs()
                      .hour(Number(item?.fromHour))
                      .minute(0)
                      .format("HH:mm")
                  : dayjs(item?.fromHour).format("HH:mm")}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-1", "py-8")}>
          <Text style={tw("text-#707070")}>{`Đến giờ`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Clock />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8")}>
                {isView
                  ? dayjs().hour(Number(item?.toHour)).minute(0).format("HH:mm")
                  : dayjs(item?.toHour).format("HH:mm")}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={tw("flex-row")}>
        <View style={tw("flex-1", "py-8", "mr-4")}>
          <Text style={tw("text-#707070")}>{`CĐSX`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Step />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8")}>{item?.stageSelected.tenCongDoan}</Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-1", "py-8")}>
          <Text style={tw("text-#707070")}>{`Đơn vị tính`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Unit />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8")}>{item?.unitSelected?.tenDonViTinh}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={tw("flex-row")}>
        <View style={tw("flex-1", "py-8", "mr-4")}>
          <Text style={tw("text-#707070")}>{`Lên bài`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Post />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8")}>{PostName[item?.postType]}</Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-1", "py-8")}>
          <Text style={tw("text-#707070")}>{`Nội dung công việc`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Note />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8")}>{item?.note}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={tw("flex-row")}>
        <View style={tw("flex-1", "py-8")}>
          <Text style={tw("text-#707070")}>{`Tổng sản lượng SX`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Sum />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8", "text-#FF5F40", "font-bold")}>
                {formatNumber(item?.sumQuantity)}
              </Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-1", "py-8")}>
          <Text style={tw("text-#707070")}>{`Sản lượng hỏng`}</Text>
          <View style={tw("flex-row")}>
            <View style={tw("py-8")}>
              <Svgs.Bug />
            </View>
            <View style={tw("flex-1", "py-8")}>
              <Text style={tw("pl-8", "text-#FF5F40", "font-bold")}>
                {formatNumber(item?.failQuantity)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {isView ? null : (
        <MultipleChoiceAction
          actionList={[ActionId.Edit, ActionId.Copy, ActionId.Delete]}
          action={(action) => handleBottomAction(item, action)}
        >
          <TouchableOpacity style={tw("absolute", "right-8", "top-8", "p-8")}>
            <Svgs.ThreeDot fill={"#000000"} />
          </TouchableOpacity>
        </MultipleChoiceAction>
      )}
    </View>
  );
};

export default QuantityDetail;
