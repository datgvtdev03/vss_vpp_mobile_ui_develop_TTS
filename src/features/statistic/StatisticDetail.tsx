import { StackScreenProps } from "@react-navigation/stack";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { TextInputWithLabel } from "src/components/base/Input";
import Pix from "src/components/base/Pix";
import CardContainer from "src/components/common/CardContainer";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { RootStackParamList } from "src/navigation/StackNavigator";
import { isEmptyObj } from "src/utils/helpers";
import { StatisticApi } from "./api/StatisticApi";
import QuantityDetail from "./components/QuantityDetail";
import StaffContainer from "./components/StaffContainer";
import { StatisticDetailData } from "./models/statistic";

type Props = StackScreenProps<RootStackParamList, "Statistic/StatisticDetail">;
const StatisticDetail = ({ route }: Props) => {
  const { tw } = useTailwind();
  const idStatistic = route.params?.idStatistic;

  const [detailStatistic, setDetailStatistic] = useState<StatisticDetailData>(
    {} as StatisticDetailData
  );

  const getDetailStatistic = useCallback(async () => {
    const resDetail = await StatisticApi.getDetailStatistic(idStatistic).run();
    !isEmptyObj(resDetail) && setDetailStatistic(resDetail);
  }, [idStatistic]);

  useEffect(() => {
    getDetailStatistic();
  }, [getDetailStatistic]);

  // console.log("===");
  // console.log("isEmptyObj(resDetail)", isEmptyObj(resDetail));

  const _staffsGroup = useMemo(() => {
    if (!isEmptyObj(detailStatistic)) {
      const staffs = detailStatistic.nhomThoThongKeList.reduce((prev, item) => {
        const staff = [
          {
            staffSelected: {
              maNhanVien: item.maNhanVien,
              displayName: item.displayName,
            },
            positionSelected: {
              tenChucDanh: item.tenChucDanh,
            },
          },
        ];
        return [...prev, ...staff];
      }, []);
      return staffs;
    } else return [];
  }, [detailStatistic.nhomThoThongKeList]);

  const _quantityGroup = useMemo(() => {
    if (!isEmptyObj(detailStatistic)) {
      const quantities = detailStatistic.sanLuongThongKeList.reduce(
        (prev, item) => {
          const quantity = [
            {
              fromHour: item.tuGio,
              toHour: item.denGio,
              ticketSelected: {
                tenThanhPham: item.tenThanhPham,
                soPhieuSp: item.soPhieuSp,
              },
              stageSelected: {
                tenCongDoan: item.tenCongDoan,
              },
              unitSelected: {
                tenDonViTinh: item.tenDonViTinh,
              },
              postType: item.bitLenBai ? 2 : 1,
              note: item.noiDungCongViec,
              sumQuantity: item.tongSanLuong,
              failQuantity: item.sanLuongHong,
            },
          ];
          return [...prev, ...quantity];
        },
        []
      );
      return quantities;
    } else return [];
  }, [detailStatistic.sanLuongThongKeList]);

  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar title="Chi tiết thống kê" />
      <ScrollView>
        <View style={tw("pt-16", "pb-24")}>
          <CardContainer
            titleCard="Thông tin nhập liệu"
            icon={<Svgs.InformationInput />}
            isOpen
          >
            <Pix size={16} />
            <TextInputWithLabel
              label="Ngày nhập liệu"
              name="date"
              required
              defaultValue={dayjs(detailStatistic.ngayNhap).format(
                "DD/MM/YYYY"
              )}
              inputStyle={tw("opacity-70")}
              disabled
            />
            <Pix size={16} />
            <TextInputWithLabel
              label="Tên thiết bị"
              name="deviceName"
              required
              defaultValue={detailStatistic?.tenThietBi}
              inputStyle={tw("opacity-70")}
              disabled
            />

            <Pix size={16} />
            <TextInputWithLabel
              label="Ca sản xuất"
              name="shift"
              required
              defaultValue={detailStatistic?.tenCa}
              inputStyle={tw("opacity-70")}
              disabled
            />

            <Pix size={16} />
            <TextInputWithLabel
              label="Ghi chú"
              name="note"
              required
              defaultValue={detailStatistic.ghiChu}
              inputStyle={tw("opacity-70")}
              disabled
            />
          </CardContainer>

          <Pix size={16} />
          <CardContainer
            titleCard="Thông tin nhóm thợ"
            icon={<Svgs.StaffsGroup />}
            isOpen
          >
            {_staffsGroup.map((item, index) => (
              <StaffContainer key={String(index)} item={item} isView />
            ))}
          </CardContainer>

          <Pix size={16} />
          <CardContainer
            titleCard="Thông tin sản lượng"
            icon={<Svgs.QuantityGroup />}
            isOpen
          >
            {_quantityGroup.map((item, index) => (
              <QuantityDetail key={String(index)} item={item} isView />
            ))}
          </CardContainer>
        </View>
      </ScrollView>
    </View>
  );
};

export default StatisticDetail;
