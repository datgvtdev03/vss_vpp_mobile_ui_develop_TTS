import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import defaultStyles from "src/common/styles";
import colors from "src/constants/colors";
import i18n from "src/locales/i18n";

const componentText = {
  CANCEL: i18n.t("common:CANCEL"),
  OK: i18n.t("common:OK"),
  DAY: i18n.t("common:Day"),
};

const YearPicker = ({
  initYear,
  fromYear = 1900,
  toYear = 2100,
  minYear,
  maxYear,
  onClose,
  onChange,
  imperativeState,
  children,
}: {
  initYear: number;
  fromYear?: number;
  toYear?: number;
  minYear?: number;
  maxYear?: number;
  onClose?: () => void;
  onChange?: (currentYear: number) => void;
  imperativeState?: "show" | "hide" | null;
  children?: React.ReactElement;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(initYear);
  // const [listYear] = useState<number[]>(() => {
  //   return Array.from(Array(toYear - fromYear)).map(
  //     (_, index) => index + fromYear
  //   );
  // });

  const [yearList, setYearList] = useState<number[]>([]);
  const scrollViewRef = useRef(null);
  const [dataSourceCords, setDataSourceCords] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    const yearSumDefault = toYear - fromYear;
    const arrayYear: number[] = [];
    for (let i = 0; i <= yearSumDefault; i++) {
      arrayYear.push(i + fromYear);
    }
    setYearList(arrayYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imperativeState === "show") {
      setModalVisible(true);
      setTimeout(() => {
        //@ts-ignore
        scrollViewRef.current.scrollTo({
          x: 0,
          y: dataSourceCords[yearList.indexOf(initYear) - 3],
        });
        setScrollEnabled(true);
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imperativeState]);

  const renderTitle = () => {
    return (
      <View style={[styles.dateText]}>
        <View>
          <Text style={styles.infoYear}>{`Năm ${currentYear}`}</Text>
        </View>
      </View>
    );
  };

  const renderItemYear = (item, index) => {
    const year = item - fromYear;
    const isBeforeMinYear = minYear ? currentYear < minYear : false;
    const isAfterMaxYear = maxYear ? currentYear > maxYear : false;
    const isOutOfYearRange = isBeforeMinYear || isAfterMaxYear;
    return (
      <TouchableOpacity
        key={index}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          //@ts-ignore
          dataSourceCords[index] = layout.y;
          setDataSourceCords(dataSourceCords);
        }}
        activeOpacity={isOutOfYearRange ? 1 : 0.6}
        style={[
          defaultStyles.selfStretch,
          defaultStyles.alignItemsCenter,
          item === currentYear && styles.selectedYear,
        ]}
        onPress={() => {
          if (!isOutOfYearRange) {
            setCurrentYear(item);
            // update activeDateTime = day,month,year
          }
        }}
      >
        <Text
          style={[
            styles.textYear,
            isOutOfYearRange && styles.color_929295,
            item === currentYear && styles.selectedYearText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent
        statusBarTranslucent
        onRequestClose={() => {
          setModalVisible(false);
          onClose && onClose();
        }}
      >
        <View style={defaultStyles.flex_1}>
          <View style={styles.modalView}>
            <View>
              <View style={styles.backgroundDefault}>
                {renderTitle()}
                <View style={styles.tabDate}>
                  {/* <FlatList
                    data={yearList}
                    showsVerticalScrollIndicator={false}
                    style={styles.maxHeight300}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => String(item)}
                    initialScrollIndex={yearList.indexOf(initYear)}
                    getItemLayout={(data, index) => ({
                      length: 51.3,
                      offset: 51.3 * index,
                      index,
                    })}
                    renderItem={({ item }) => {
                      const year = item - fromYear;
                      const isBeforeMinYear = minYear
                        ? currentYear < minYear
                        : false;
                      const isAfterMaxYear = maxYear
                        ? currentYear > maxYear
                        : false;
                      const isOutOfYearRange =
                        isBeforeMinYear || isAfterMaxYear;
                      return (
                        <TouchableOpacity
                          activeOpacity={isOutOfYearRange ? 1 : 0.6}
                          style={[
                            defaultStyles.selfStretch,
                            defaultStyles.alignItemsCenter,
                            item === currentYear && styles.selectedYear,
                          ]}
                          onPress={() => {
                            if (!isOutOfYearRange) {
                              setCurrentYear(item);
                              // update activeDateTime = day,month,year
                            }
                          }}
                        >
                          <Text
                            style={[
                              styles.textYear,
                              isOutOfYearRange && styles.color_929295,
                              item === currentYear && styles.selectedYearText,
                            ]}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  /> */}
                  <Animated.ScrollView
                    scrollToOverflowEnabled={true}
                    scrollEventThrottle={1}
                    style={styles.maxHeight300}
                    ref={scrollViewRef}
                    scrollEnabled={scrollEnabled}
                  >
                    {yearList.map((item, index) => renderItemYear(item, index))}
                  </Animated.ScrollView>
                </View>
                <View style={styles.bottomBtn}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      onClose && onClose();
                    }}
                    style={[styles.dateBtn]}
                  >
                    <Text style={styles.textBottom}>
                      {componentText.CANCEL}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      onClose && onClose();
                      onChange?.(currentYear);
                    }}
                    style={[styles.dateBtn]}
                  >
                    <Text style={styles.textBottom}> {componentText.OK} </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {children &&
        React.cloneElement(children, {
          onPress: () => {
            children.props.onPress && children.props.onPress();
            if (imperativeState === null) {
              setModalVisible(true);
            }
          },
        })}
    </>
  );
};

export default YearPicker;

const styles = StyleSheet.create({
  tabDate: {
    minWidth: 300,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  maxHeight300: {
    maxHeight: 300,
  },
  textYear: {
    fontSize: 16,
    paddingVertical: 16,
  },
  color_929295: {
    color: "#929295",
  },
  selectedYearText: {
    color: "#FFFFFF",
  },
  selectedYear: {
    backgroundColor: "#EE0033",
    borderRadius: 26,
    marginHorizontal: 24,
  },
  modalView: {
    flex: 1,
    paddingHorizontal: 20,
    borderRadius: 0,
    justifyContent: "center",
    backgroundColor: "rgba(10, 10, 18, 0.16)",
  },
  bottomBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  textBottom: {
    color: colors.color_EE0033,
    fontWeight: "bold",
  },
  backgroundDefault: {
    backgroundColor: "#FFF",
  },
  dateBtn: {
    padding: 10,
  },
  dateText: {
    backgroundColor: colors.color_EE0033,
    minWidth: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  infoYear: {
    color: "white",
    fontSize: 17,
  },
  infoDayMonth: {
    fontSize: 25,
    color: "#fff",
  },
});
