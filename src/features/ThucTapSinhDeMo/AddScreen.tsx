import React from "react";
import { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";

import Svgs from "src/constants/Svgs";
import {
  PickerInputWithLabel,
  TextInputWithLabel,
} from "src/components/base/Input";
import CardContainer from "src/components/common/CardContainer";
import DefaultActionBar from "src/components/common/DefaultActionBar";
import navigationService from "src/navigation/navigationService";
import DialogAlert from "src/components/common/DialogAlert";
import { useTailwind } from "src/lib/tailwind/tailwind";
import styles from "../ThucTapSinhDeMo/styles";

import Pix from "src/components/base/Pix";
import { DatePickerButtonWithLabel } from "src/components/common/DatePickerButton";

const AddScreen = ({ route }: Props) => {
  const _fromManagement = route.params?.fromManagement;
  const { tw } = useTailwind();

  const [dateInput, setDateInput] = useState();
  const [voteSelected, setVoteSelected] = useState();
  const [product, setProduct] = useState();
  const [customerName, setCustomerName] = useState();

  return (
    <View style={tw("flex-1")}>
      <DefaultActionBar
        title="Thêm mới"
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
                    // resetStatisticData();
                    navigationService.goBack();
                  },
                },
              ]
            );
          }
        }}
      />
      <View style={styles.itemView}>
        <View style={styles.itemViewInput}>
          <ScrollView>
            <View style={tw("pt-16", "pb-24")}>
              <CardContainer
                titleCard="Thông tin chung"
                icon={<Svgs.IconGeneral />}
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
                  label="Phiếu sản phẩm"
                  name="vote"
                  data={["data 1, data 2, data 3"]}
                  title="Chọn phiếu sản phẩm"
                  required
                  value={voteSelected}
                  onFinish={(device) => setVoteSelected(device)}
                />

                <Pix size={16} />
                <TextInputWithLabel
                  label="Sản phẩm"
                  name="product"
                  defaultValue={product}
                  onChangeText={(text) => setProduct(text)}
                />
                <Pix size={16} />
                <TextInputWithLabel
                  label="Tên khách hàng"
                  name="customer name"
                  defaultValue={customerName}
                  onChangeText={(text) => setCustomerName(text)}
                />
                <Pix size={16} />
                <PickerInputWithLabel
                  label="Chọn máy/thiết bị"
                  name="vote"
                  data={["data 1, data 2, data 3"]}
                  title="Chọn máy/thiết bị"
                  required
                  value={voteSelected}
                  onFinish={(device) => setVoteSelected(device)}
                />
                <Pix size={16} />
                <PickerInputWithLabel
                  label="Chọn nhóm máy/thiết bị"
                  name="vote"
                  required
                  data={["data 1, data 2, data 3"]}
                  title="Chọn nhóm máy/thiết bị"
                  value={voteSelected}
                  onFinish={(device) => setVoteSelected(device)}
                />
                <Pix size={16} />
                <PickerInputWithLabel
                  label="Ca sản xuất"
                  name="vote"
                  data={["data 1, data 2, data 3"]}
                  title="Chọn ca"
                  value={voteSelected}
                  onFinish={(device) => setVoteSelected(device)}
                />
                <Pix size={16} />
                <PickerInputWithLabel
                  label="Trưởng máy/Phụ máy"
                  name="vote"
                  data={["data 1, data 2, data 3"]}
                  title="Chọn trưởng máy/Phụ máy"
                  required
                  value={voteSelected}
                  onFinish={(device) => setVoteSelected(device)}
                />
              </CardContainer>
            </View>
          </ScrollView>
        </View>

        <View style={styles.itemViewButton}>
          <View style={styles.viewBtn}>
            <TouchableOpacity style={styles.buttonBoQua} onPress={() => {}}>
              <Text style={styles.textBoQua}>Bỏ qua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.viewBtn}>
            <TouchableOpacity style={styles.buttonTiepTuc} onPress={() => {}}>
              <Text style={styles.textTiepTuc}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddScreen;
