import { auto } from "@popperjs/core";
import React, { FC, ReactElement, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Image,
  TextInput,
} from "react-native";
import images from "src/constants/images";

interface Props {
  label: string;
  data: Array<InterfaceLabelValue>;
  onSelect: (item: { label: string; value: string }) => void;
  title: string;
  hasFilter: boolean;
}

const DropdownModal: FC<Props> = ({
  label,
  data,
  onSelect,
  title,
  hasFilter,
}) => {
  const DropdownButton = useRef<any>();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<any>();
  const [searchText, setSearchText] = useState("");
  const [filterData, setFilterData] = useState<any>(null);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : setVisible(true);
  };

  const onItemPress = (item): void => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const filterSearch = (searchText) => {
    setSearchText(searchText);

    let filteredData = data.filter((item) => item.label.includes(searchText));
    setFilterData(filteredData);
  };

  const renderItem = ({ item }): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal
        visible={visible}
        supportedOrientations={["portrait", "landscape"]}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.dropdown}>
            <Text style={styles.title}>{title}</Text>
            {hasFilter && (
              <View style={styles.searchSection}>
                <Image style={styles.searchIcon} source={images.ic_search} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập từ cần tìm kiếm"
                  underlineColorAndroid="transparent"
                  value={searchText}
                  onChangeText={(text) => filterSearch(text)}
                />
              </View>
            )}
            <View style={styles.flatList}>
              <FlatList
                data={filterData ? filterData : data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.touchClose}
            >
              <Image style={styles.closeIcon} source={images.ic_cancel} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <Text style={styles.buttonText} numberOfLines={1}>
        {(selected && selected.label) || label}
      </Text>
      <Image style={styles.icon} source={images.ic_dropdown_blue} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    zIndex: 1,
    borderColor: "#85a88d",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  buttonText: {
    flex: 1,
  },
  icon: {
    width: 15,
    height: 15,
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "90%",
    height: "85%",
    shadowColor: "#000000",
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    alignSelf: "center",
    marginTop: 20,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000099",
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 0.4,
    borderColor: "gray",
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginBottom: 20,
    height: 40,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingLeft: 5,
    height: 40,
  },
  flatList: {
    flex: 1,
  },
  title: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
  },
  closeIcon: {
    width: 20,
    marginTop: 15,
    marginRight: 15,
    height: 20,
  },
  touchClose: {
    top: 5,
    right: 5,
    position: "absolute",
  },
});

export default DropdownModal;
