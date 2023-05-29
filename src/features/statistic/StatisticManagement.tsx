import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useCallback, useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "src/components/base/Input";
import Pix from "src/components/base/Pix";
import { DatePickerButtonWithLabel } from "src/components/common/DatePickerButton";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { isHasLength } from "src/utils/helpers";
import ItemStatisticManagement from "./ItemStatisticManagement";
import { StatisticApi } from "./api/StatisticApi";
import EmptyComponent from "./components/EmptyComponent";
import { StatisticManagementResponse } from "./models/statistic";
import useStatisticStore from "./store/useStatisticStore";

const StatisticManagement = () => {
  const { tw } = useTailwind();
  const isFocus = useIsFocused();
  const [
    searchKeyword,
    setSearchKeyword,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    dataManagementStatistic,
    setDataManagementStatistic,
  ] = useStatisticStore((state) => [
    state.searchKeyword,
    state.setSearchKeyword,
    state.fromDate,
    state.setFromDate,
    state.toDate,
    state.setToDate,
    state.dataManagementStatistic,
    state.setDataManagementStatistic,
  ]);

  const getStatisticTicket = useCallback(async () => {
    const body = {
      fromDate: dayjs(fromDate).format("YYYY-MM-DD"),
      toDate: dayjs(toDate).format("YYYY-MM-DD"),
      keyword: searchKeyword,
    };

    const res = await StatisticApi.postSearchStatistic(body).run();
    isHasLength(res)
      ? setDataManagementStatistic(res)
      : setDataManagementStatistic([]);
  }, [fromDate, toDate, searchKeyword]);

  useEffect(() => {
    if (isFocus) {
      getStatisticTicket();
    }
  }, [getStatisticTicket]);

  const _renderItem = ({ item }: { item: StatisticManagementResponse }) => {
    return (
      <ItemStatisticManagement
        item={item}
        getStatisticTicket={getStatisticTicket}
      />
    );
  };

  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar title="Quản lý thống kê" />
      <View style={tw("py-8")}>
        <View style={tw("px-16")}>
          <TextInput
            name="search"
            placeholder="Ca, Tên thiết bị, Số phiếu nhập ..."
            rounded
            prependIcon={
              <Svgs.SearchIcon fill={"#AAAAAA"} width={15} height={15} />
            }
            defaultValue={searchKeyword}
            onEndEditing={(event) => setSearchKeyword(event.nativeEvent.text)}
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
            />
          </View>
          <View style={tw("flex-1", "pl-8")}>
            <DatePickerButtonWithLabel
              label="Đến ngày"
              value={toDate}
              onChange={(toDate) => setToDate(toDate)}
            />
          </View>
        </View>

        <Pix size={8} />
        <View style={tw("flex-row")}>
          <View style={tw("flex-1", "py-8", "px-16")}>
            <Text>{`Danh sách: ${dataManagementStatistic.length}`}</Text>
          </View>
          <View style={tw("flex-1", "items-end")}>
            <TouchableOpacity
              onPress={() =>
                navigationService.navigate(
                  navigationRoutes.STATISTIC_SEARCH_ADVANCE
                )
              }
            >
              <Svgs.SearchAdvance />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={tw("flex-1")}>
        <FlatList
          keyExtractor={(item) => String(item.id)}
          data={dataManagementStatistic}
          renderItem={_renderItem}
          ListEmptyComponent={() => (
            <EmptyComponent
              text={`Hiện tại chưa có bản thông kê nào! \n Vui lòng kéo xuống để tải lại!`}
            />
          )}
          style={tw("px-16", "pb-16")}
        />
      </View>
    </View>
  );
};

export default StatisticManagement;
