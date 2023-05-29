import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  PickerInputWithLabel,
  TextInput,
  TextInputWithLabel,
} from "src/components/base/Input";
import Pix from "src/components/base/Pix";
import { DatePickerButtonWithLabel } from "src/components/common/DatePickerButton";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { isHasLength } from "src/utils/helpers";
import { StatisticApi } from "./api/StatisticApi";
import { ProductTicket, Staff, Stage } from "./models/statistic";
import useStatisticStore from "./store/useStatisticStore";
import navigationService from "src/navigation/navigationService";
import DialogAlert from "src/components/common/DialogAlert";

const SearchAdvance = () => {
  const { tw } = useTailwind();

  const [
    searchKeyword,
    setSearchKeyword,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    searchStaff,
    setSearchStaff,
    searchProductTicket,
    setSearchProductTicket,
    searchStage,
    setSearchStage,
    setDataManagementStatistic,
  ] = useStatisticStore((state) => [
    state.searchKeyword,
    state.setSearchKeyword,
    state.fromDate,
    state.setFromDate,
    state.toDate,
    state.setToDate,
    state.searchStaff,
    state.setSearchStaff,
    state.searchProductTicket,
    state.setSearchProductTicket,
    state.searchStage,
    state.setSearchStage,
    state.setDataManagementStatistic,
  ]);

  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [productTickets, setProductTickets] = useState<ProductTicket[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);

  const getStaffs = async () => {
    const res = await StatisticApi.getStaffs().run();
    isHasLength(res) ? setStaffs(res) : setStaffs([]);
  };

  const getProductTicketByDate = async () => {
    const res = await StatisticApi.getProductTicketByDate(
      // dayjs(fromDate).format("YYYY-MM-DD"),
      // dayjs(toDate).format("YYYY-MM-DD")
      dayjs("2021-11-16").format("YYYY-MM-DD"),
      dayjs("2021-11-17").format("YYYY-MM-DD")
    ).run();
    isHasLength(res) ? setProductTickets(res) : setProductTickets([]);
  };

  const getStages = async () => {
    const res = await StatisticApi.getStages().run();
    isHasLength(res) ? setStages(res) : setStages([]);
  };

  useEffect(() => {
    getStaffs();
    getProductTicketByDate();
    getStages();
  }, []);

  const onSearchAdvance = async () => {
    const body = {
      fromDate: dayjs(fromDate).format("YYYY-MM-DD"),
      toDate: dayjs(toDate).format("YYYY-MM-DD"),
      keyword: searchKeyword ? searchKeyword : "",
      maCongDoan: searchStage?.id ? searchStage?.id : null,
      maThanhPham: searchProductTicket?.idThanhPham
        ? searchProductTicket?.idThanhPham
        : null,
      soPhieuSp: searchProductTicket?.soPhieuSp
        ? searchProductTicket?.soPhieuSp
        : null,
      maNhanVien: searchStaff?.maNhanVien ? searchStaff?.maNhanVien : null,
    };

    const resSearch = await StatisticApi.postSearchStatisticAdvance(body).run();
    if (isHasLength(resSearch)) {
      setDataManagementStatistic(resSearch);
      navigationService.goBack();
    } else {
      DialogAlert.showInfo(
        "Thông báo",
        "Không tìm thấy bản ghi nào! \nVui lòng thử lại."
      );
      setDataManagementStatistic([]);
    }
  };

  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar
        title="Tìm kiếm nâng cao"
        rightText="Xong"
        onPressRight={() => onSearchAdvance()}
      />

      <View style={tw("py-8")}>
        <View style={tw("px-16")}>
          <TextInput
            name="search"
            placeholder="Tìm kiếm"
            rounded
            prependIcon={
              <Svgs.SearchIcon fill={"#AAAAAA"} width={15} height={15} />
            }
            defaultValue={searchKeyword}
            onChangeText={(text) => setSearchKeyword(text)}
            style={tw("border-0")}
          />
        </View>

        <Pix size={8} />
        <View style={tw("flex-row", "px-16")}>
          <View style={tw("flex-1", "pr-8")}>
            <DatePickerButtonWithLabel
              label="Từ ngày"
              value={fromDate}
              onChange={(fromDate) => setFromDate(fromDate)}
              maxDate={new Date()}
            />
          </View>
          <View style={tw("flex-1", "pl-8")}>
            <DatePickerButtonWithLabel
              label="Đến ngày"
              value={toDate}
              onChange={(toDate) => setToDate(toDate)}
              maxDate={new Date()}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={tw(
          "flex-1",
          "p-16",
          "bg-white",
          "rounded-tr-16",
          "rounded-tl-16",
          "mt-16"
        )}
      >
        <PickerInputWithLabel
          name="staffName"
          label="Tên nhân viên"
          data={staffs}
          itemText={"displayName"}
          itemValue={"maNhanVien"}
          value={searchStaff}
          onFinish={(staff) => setSearchStaff(staff)}
          titlePlaceholder="-Chọn nhân viên-"
          searchPlaceholder="Tìm nhân viên"
          searchable
          title="Chọn nhân viên"
        />

        <Pix size={16} />
        <PickerInputWithLabel
          name="ticket"
          label="Phiếu sản phẩm"
          data={productTickets}
          itemText={"soPhieuSp"}
          itemValue={"id"}
          value={searchProductTicket}
          onFinish={(ticket) => setSearchProductTicket(ticket)}
          titlePlaceholder="-Chọn phiếu sản phẩm-"
          searchPlaceholder="Tìm phiếu sản phẩm"
          searchable
          title="Chọn phiếu sản phẩm"
        />

        <Pix size={16} />
        <TextInputWithLabel
          name="ticketName"
          label="Tên thành phẩm"
          value={searchProductTicket?.tenThanhPham}
          disabled
        />

        <Pix size={16} />
        <PickerInputWithLabel
          name="step"
          label="Công đoạn"
          data={stages}
          itemText={"tenCongDoan"}
          itemValue={"maBd"}
          value={searchStage}
          onFinish={(stage) => setSearchStage(stage)}
          titlePlaceholder="-Chọn công đoạn-"
          searchPlaceholder="Tìm công đoạn"
          searchable
          title="Chọn công đoạn"
        />
      </ScrollView>
    </View>
  );
};

export default SearchAdvance;
