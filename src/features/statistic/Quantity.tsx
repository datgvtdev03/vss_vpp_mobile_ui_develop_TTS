import React from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import navigationService from "src/navigation/navigationService";
import QuantityData from "./QuantityData.json";
import { useTailwind } from "src/lib/tailwind/tailwind";
import Svgs from "src/constants/Svgs";
import { formatNumber } from "src/utils/helpers";
const DATA = QuantityData;

const Quantity = () => {
  const { tw } = useTailwind();

  const _renderItem = ({ item }: any) => {
    return (
      <View
        style={tw(
          "bg-white",
          "p-16",
          "rounded-10",
          "my-8",
          "mx-16",
          "relative"
        )}
      >
        <View style={tw("flex-1", "flex-row", "pb-16")}>
          <View style={tw("flex-1")}>
            <View style={tw("flex-1", "pb-16")}>
              <Text style={tw("text-#707070", "pb-4")}>{`Tên thành phẩm`}</Text>
              <Text>{item.tentp}</Text>
            </View>
            <View style={tw("flex-1")}>
              <Text style={tw("text-#707070", "pb-4")}>{`Từ giờ`}</Text>
              <Text>{item.tugio}</Text>
            </View>
          </View>

          <View style={tw("flex-1")}>
            <View style={tw("flex-1", "pb-16")}>
              <Text style={tw("text-#707070", "pb-4")}>{`Phiếu sản phẩm`}</Text>
              <Text>{item.masp}</Text>
            </View>
            <View style={tw("flex-1")}>
              <Text style={tw("text-#707070", "pb-4")}>{`Đến giờ`}</Text>
              <Text>{item.dengio}</Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-1", "flex-row", "pb-16")}>
          <View style={tw("flex-1")}>
            <View style={tw("flex-1", "pb-16")}>
              <Text style={tw("text-#707070", "pb-4")}>{`CĐSX`}</Text>
              <Text>{item.cdsx}</Text>
            </View>
            <View style={tw("flex-1")}>
              <Text style={tw("text-#707070", "pb-4")}>{`Lên bài`}</Text>
              <Text>{item.lenbai}</Text>
            </View>
          </View>

          <View style={tw("flex-1")}>
            <View style={tw("flex-1", "pb-16")}>
              <Text style={tw("text-#707070", "pb-4")}>{`Đơn vị tính`}</Text>
              <Text>{item.donvi}</Text>
            </View>
            <View style={tw("flex-1")}>
              <Text style={tw("text-#707070", "pb-4")}>{`Nội dung`}</Text>
              <Text>{item.noidung}</Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-1", "flex-row")}>
          <View style={tw("flex-1")}>
            <View style={tw("flex-1")}>
              <Text
                style={tw("text-#707070", "pb-4")}
              >{`Tổng sản lượng SX`}</Text>
              <Text style={tw("text-#FF5F40", "font-bold")}>
                {formatNumber(item.tongsl)}
              </Text>
            </View>
          </View>

          <View style={tw("flex-1")}>
            <View style={tw("flex-1")}>
              <Text style={tw("text-#707070", "pb-4")}>{`Sản lượng hỏng`}</Text>
              <Text style={tw("text-#FF5F40", "font-bold")}>
                {formatNumber(item.slhong)}
              </Text>
            </View>
          </View>
        </View>

        {/* <TouchableOpacity
          style={tw("absolute", "top-10", "right-10", "px-6", "py-12")}
          onPress={() => alert("Clicked")}
        >
          <Svgs.ThreeDot fill={"#000000"} />
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar title="Sản lượng" iconType="none" />
      <View style={tw("flex-1")}>
        <View style={tw("p-16")}>
          <Text style={tw("font-semi-bold")}>Danh sách: {DATA.length}</Text>
        </View>

        <FlatList
          keyExtractor={(item) => String(item.id)}
          data={DATA}
          renderItem={_renderItem}
          style={tw("mb-16")}
        />
      </View>
    </View>
  );
};
export default Quantity;
