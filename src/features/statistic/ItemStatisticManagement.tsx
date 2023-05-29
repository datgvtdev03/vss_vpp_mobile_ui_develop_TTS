import dayjs from "dayjs";
import React, { useState } from "react";
import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import DialogAlert from "src/components/common/DialogAlert";
import { ModalPortal } from "src/components/common/Modal";
import MultipleChoiceAction from "src/components/common/MultipleChoiceAction";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { StatisticApi } from "./api/StatisticApi";
import { ActionId, BottomSheetActionProps } from "./constants";
import {
  ProductTicket,
  QuantityInfo,
  StaffList,
  Stage,
  StatisticManagementResponse,
  Unit,
} from "./models/statistic";
import useStatisticStore from "./store/useStatisticStore";
import { randomId } from "src/utils/helpers";

interface ItemStatisticManagementProps {
  item: StatisticManagementResponse;
  getStatisticTicket: () => void;
}

const ItemStatisticManagement = ({
  item,
  getStatisticTicket,
}: ItemStatisticManagementProps) => {
  const { tw } = useTailwind();
  const [expand, setExpand] = useState<boolean>(false);
  const [setStaffsGroup, setQuantityGroup] = useStatisticStore((state) => [
    state.setStaffsGroup,
    state.setQuantityGroup,
  ]);

  const handleEditAndCopyAction = async (
    item: StatisticManagementResponse,
    action: BottomSheetActionProps
  ) => {
    const getStatisticDetail = await StatisticApi.getDetailStatistic(
      item.id
    ).run();
    const positions = await StatisticApi.getStaffsPosition().run();
    const products = await StatisticApi.getProductTicketByDate(
      dayjs("2021-11-16").format("YYYY-MM-DD"),
      dayjs("2021-11-17").format("YYYY-MM-DD")
    ).run();
    const stages = await StatisticApi.getStages().run();
    const units = await StatisticApi.getUnits().run();

    const arrQuantity = getStatisticDetail.sanLuongThongKeList;
    const staffSelected = getStatisticDetail.nhomThoThongKeList;
    const _staffGroup = staffSelected.reduce<StaffList[]>((prev, item) => {
      const _position = positions.find(
        (position) => position.maChucDanh === item.idChucDanhNv
      );
      if (_position) {
        const _staffSelected = [
          {
            staffSelected: {
              ...item,
              id: action.actionId === ActionId.Edit ? item.id : null,
              status:
                action.actionId === ActionId.Edit ? item.status : ActionId.Add,
            },
            positionSelected: _position,
          },
        ];
        return [...prev, ..._staffSelected];
      } else {
        return prev;
      }
    }, []);

    const _quantityGroup = arrQuantity.reduce<QuantityInfo[]>((prev, item) => {
      const _ticketSelected = products.find(
        (product) => product.id === item.idPhieuSp
      );
      const _stageSelected = stages.find(
        (stage) => stage.id === item.idCongDoan
      );
      const _unitSelected = units.find(
        (unit) => unit.maDonViTinh === item.idDonViTinh
      );

      const _itemQuantity = {
        id: action.actionId === ActionId.Edit ? item.id : randomId(),
        idNhapThongKe:
          action.actionId === ActionId.Edit ? item.idNhapThongKe : null,
        ngayNhap: action.actionId === ActionId.Edit ? item.ngayNhap : null,
        fromHour: dayjs()
          .hour(Number(item.tuGio.length < 2 ? "0" + item.tuGio : item.tuGio))
          .minute(0),
        toHour: dayjs()
          .hour(
            Number(item.denGio.length < 2 ? "0" + item.denGio : item.denGio)
          )
          .minute(0),
        ticketSelected: _ticketSelected
          ? _ticketSelected
          : ({} as ProductTicket),
        stageSelected: _stageSelected ? _stageSelected : ({} as Stage),
        unitSelected: _unitSelected ? _unitSelected : ({} as Unit),
        postType: item.bitLenBai ? 2 : 1,
        note: item.noiDungCongViec || "",
        sumQuantity:
          action.actionId === ActionId.Edit ? item.tongSanLuong || 0 : 0,
        failQuantity:
          action.actionId === ActionId.Edit ? item.sanLuongHong || 0 : 0,
        status: action.actionId === ActionId.Edit ? item.status : ActionId.Add,
      };
      return prev.concat(_itemQuantity);
    }, []);

    setStaffsGroup(_staffGroup);
    setQuantityGroup(_quantityGroup);
  };

  const handleDeleteAction = async (statisticId: number) => {
    const resDel = await StatisticApi.postDeleteStatistic(statisticId)
      .loadingMessage("Xóa phiếu thông kê!")
      .run();
    if (resDel) {
      DialogAlert.showSuccess("Thông báo", "Xóa thống kê thành công!", [
        { text: "Đóng", onPress: () => getStatisticTicket() },
      ]);
    }
  };

  // done luồng edit => xử lý luồng copy
  const handleBottomAction = async (
    item: StatisticManagementResponse,
    action: BottomSheetActionProps
  ) => {
    switch (action.actionId) {
      case ActionId.Copy: {
        await handleEditAndCopyAction(item, action);
        navigationService.navigate(navigationRoutes.STATISTIC, {
          fromManagement: true,
          dataManagement: item,
          managementAction: ActionId.Copy,
        });
        ModalPortal.dismissAll();
        break;
      }
      case ActionId.Edit: {
        await handleEditAndCopyAction(item, action);
        navigationService.navigate(navigationRoutes.STATISTIC, {
          fromManagement: true,
          dataManagement: item,
          managementAction: ActionId.Edit,
        });
        ModalPortal.dismissAll();
        break;
      }
      case ActionId.Delete: {
        DialogAlert.showInfo(
          "Thông báo",
          "Bạn có chắn chắc muốn xóa phiếu thống kê không?",
          [
            { text: "Hủy" },
            { text: "Đồng ý", onPress: () => handleDeleteAction(item.id) },
          ]
        );
        break;
      }

      case ActionId.Add: {
        const statisticDetail = await StatisticApi.getDetailStatistic(
          item.id
        ).run();

        navigationService.navigate(navigationRoutes.STATISTIC_ADD_QUANTITY, {
          fromManagement: true,
          item: statisticDetail,
          action: ActionId.Add,
        });
        ModalPortal.dismissAll();
        break;
      }
      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      style={tw("bg-white", "rounded-8", "p-16", "mb-16", "shadow-3")}
      onPress={() =>
        navigationService.navigate(navigationRoutes.STATISTIC_DETAIL, {
          idStatistic: item.id,
        })
      }
    >
      <View style={tw("flex-row", "pb-12")}>
        <View style={tw("w-2/3")}>
          <Text style={tw("text-#707070")}>{`Người nhập`}</Text>
          <View style={tw("flex-row", "py-8", "items-center")}>
            <Svgs.Personal />
            <Text style={tw("pl-4")}>{item.nguoiNhap}</Text>
          </View>
        </View>

        <View style={tw("w-1/3")}>
          <Text style={tw("text-#707070")}>{`Ca`}</Text>
          <View style={tw("flex-row", "py-8", "items-center")}>
            <Svgs.Calendar />
            <Text style={tw("pl-4")}>{item.tenCa}</Text>
          </View>
        </View>
      </View>

      <View style={tw("flex-row", "pb-12")}>
        <View style={tw("w-2/3")}>
          <Text style={tw("text-#707070")}>{`Tên thiết bị`}</Text>
          <View style={tw("flex-row", "py-8", "items-center")}>
            <Svgs.Product />
            <Text style={tw("pl-4")}>{item.tenThietBi}</Text>
          </View>
        </View>

        <View style={tw("w-1/3")}>
          <Text style={tw("text-#707070")}>{`Ngày nhập`}</Text>
          <View style={tw("flex-row", "py-8", "items-center")}>
            <Svgs.Calendar />
            <Text style={tw("pl-4")}>
              {dayjs(item.ngayNhap).format("DD/MM/YYYY")}
            </Text>
          </View>
        </View>
      </View>

      <View style={tw("relative")}>
        <Text style={tw("text-#707070")}>{`Nhóm thợ`}</Text>
        <View style={tw("flex-row", "pt-8", "items-center")}>
          <Svgs.Group />
          <View style={tw("flex-1")}>
            <Text style={tw("pl-4")} numberOfLines={expand ? 0 : 3}>
              {item.nhanVien}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={tw("absolute", "top-0", "-right-16", "px-12", "py-8", "z-10")}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpand(!expand);
          }}
        >
          {expand ? (
            <Svgs.ArrowUp fill={"#000000"} />
          ) : (
            <Svgs.ArrowDown fill={"#000000"} />
          )}
        </TouchableOpacity>
      </View>

      <MultipleChoiceAction
        actionList={[
          ActionId.Edit,
          ActionId.Copy,
          ActionId.Delete,
          ActionId.Add,
        ]}
        action={(action) => handleBottomAction(item, action)}
      >
        <TouchableOpacity style={tw("absolute", "right-8", "top-8", "p-8")}>
          <Svgs.ThreeDot fill={"#000000"} />
        </TouchableOpacity>
      </MultipleChoiceAction>
    </TouchableOpacity>
  );
};

export default React.memo(ItemStatisticManagement);
