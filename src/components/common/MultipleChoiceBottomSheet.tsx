import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import Swiper from "react-native-swiper";
import BaseInput from "../base/BaseInput";
import colors from "src/constants/colors";
import fonts from "src/constants/fonts";
import BottomSheet from "../base/BottomSheet";
import RadioButton from "../base/RadioButton";
import defaultStyles from "src/common/styles";
import images from "src/constants/images";
import Divider from "../base/Divider";
import { nonAccentVietnamese } from "src/utils/string";
import Checkbox from "../base/Checkbox";
import { isArray } from "lodash";

export type ValueType =
  | (Record<string | number, unknown> & { icon?: React.ReactNode })
  | undefined;

export interface ListItem {
  title?: string;
  lazyLoadData?: (prevStepChoice: ValueType | null) => Promise<ValueType[]>;
  data: ValueType[];
  placeholder?: string;
  itemText: string;
  itemValue: string;
  returnObject?: boolean;
  scrollIndex?: number;
  showIcon?: boolean;
  disableTextColor?: string;
}

interface Props {
  data: ListItem[];
  display?: "single" | "stepped";
  value?: ValueType[];
  onFinish?: (data: ValueType[] | unknown[] | null) => void;
  onOpen?: () => void;
  onClose?: () => void;
  imperativeState?: "show" | "hide" | null;
  children?: React.ReactElement;
  height?: number;
  searchable?: boolean;
  autoFinish?: boolean;
  keepPosition?: boolean;
  displayValue?: boolean;
  header?: boolean;
  firstE?: boolean;
  isLoadMore?: boolean;
  changeTextInOut?: (e: string) => void;
  onLoadMore?: () => void;
  multipleChoice?: boolean;
  isSelectAll?: boolean;
  itemValue: string;
  itemText: string;
  disableItems?: number[];
}

interface State {
  internalValue: ValueType[];
  filteredData: ListItem[];
  loading: boolean;
}

export const ALL_VALUE = -99;
const ALL_TEXT = "Tất cả";

const MultipleChoiceBottomSheet = ({
  data = [],
  value = [],
  display = "single",
  height = 250,
  searchable = false,
  autoFinish = true,
  keepPosition = false,
  displayValue = false,
  header = true,
  onFinish,
  children,
  imperativeState = null,
  firstE,
  isLoadMore,
  changeTextInOut,
  multipleChoice,
  isSelectAll,
  itemText,
  itemValue,
  disableItems,
  ...props
}: Props): React.ReactElement => {
  const [state, setState] = useState<State>({
    internalValue: [],
    filteredData: Array.from(data),
    loading: false,
  });

  const _objAll: ValueType = {
    [itemValue]: ALL_VALUE,
    [itemText]: ALL_TEXT,
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const swiperRef = useRef<Swiper>(null);
  const searchText = useRef<string[]>([]);
  const originalData = useRef<ListItem[]>([]);
  const filterData = () => {
    const { internalValue } = state;
    return originalData.current?.map((listItem, index) => {
      let scrollIndex = 0;
      const filtered = listItem.data
        ?.filter((item) =>
          searchable && item
            ? nonAccentVietnamese(String(item[listItem.itemText])).includes(
                nonAccentVietnamese((searchText.current[index] || "").trim())
              )
            : true
        )
        .map((item, itemIdx) => {
          scrollIndex =
            item &&
            item[listItem.itemValue] === value?.[index]?.[listItem.itemValue]
              ? itemIdx
              : scrollIndex;
          return item;
        });

      if (keepPosition && filtered.length > scrollIndex) {
        const selected = filtered.splice(scrollIndex, 1)[0];
        filtered.unshift(selected);
      }
      return { ...listItem, data: filtered, scrollIndex };
    });
  };

  useEffect(() => {
    originalData.current = data;
    setState((prev) => ({
      ...prev,
      filteredData: filterData(),
    }));
    return () => {
      setState({
        internalValue: [],
        filteredData: Array.from(data),
        loading: false,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const loadAsyncData = async (
    prevValueChoice: ValueType | null,
    index: number
  ) => {
    setState((prev) => ({ ...prev, loading: true }));
    if (data[index] && typeof data[index].lazyLoadData === "function") {
      const loadedData = await data[index]?.lazyLoadData?.(prevValueChoice);
      originalData.current[index] = {
        ...originalData.current[index],
        data: loadedData || [],
      };
    }
    setState((prev) => ({ ...prev, loading: false }));
  };

  const selectionValue = useRef<{
    selectedItem?: ValueType | ValueType[];
    index?: number;
  }>({});

  const onSelectItem = (selectedItem: ValueType, index: number) => {
    if (!autoFinish && multipleChoice) {
      let arrSelectedItem = selectionValue.current?.selectedItem || [];

      const isSelectAllValue =
        selectedItem && selectedItem[itemValue] === ALL_VALUE;
      const isExistAllValue =
        isArray(arrSelectedItem) &&
        arrSelectedItem.find((item) => item && item[itemValue] === ALL_VALUE);

      const filteredDataLength =
        state.filteredData.length > 0 ? state.filteredData[0].data.length : 0;
      const internalValueLength = state.internalValue.length;

      if (isSelectAllValue && !isExistAllValue) {
        arrSelectedItem =
          filteredDataLength > 0 ? state.filteredData[0].data : [];
        selectionValue.current = {
          selectedItem: arrSelectedItem,
          index: index,
        };
      } else if (isSelectAllValue && isExistAllValue) {
        arrSelectedItem = [];
        selectionValue.current = {
          selectedItem: arrSelectedItem,
          index: index,
        };
      } else if (
        !isSelectAllValue &&
        isExistAllValue &&
        filteredDataLength - 1 !== internalValueLength
      ) {
        if (isArray(arrSelectedItem)) {
          arrSelectedItem = arrSelectedItem.filter(
            (item) =>
              item[itemValue] !== ALL_VALUE &&
              item[itemValue] !== selectedItem[itemValue]
          );
          selectionValue.current = {
            selectedItem: arrSelectedItem,
            index: index,
          };
        }
      } else {
        if (
          isArray(arrSelectedItem) &&
          arrSelectedItem.find(
            (item) => JSON.stringify(item) === JSON.stringify(selectedItem)
          )
        ) {
          arrSelectedItem = arrSelectedItem.filter(
            (item) => JSON.stringify(item) !== JSON.stringify(selectedItem)
          );
          selectionValue.current = {
            selectedItem: arrSelectedItem,
            index: index,
          };
        } else {
          arrSelectedItem = arrSelectedItem.concat(selectedItem);
          if (
            filteredDataLength === arrSelectedItem.length + 1 &&
            multipleChoice &&
            isSelectAll
          ) {
            arrSelectedItem = state.filteredData[0].data;
          }
          selectionValue.current = {
            selectedItem: arrSelectedItem,
            index: index,
          };
        }
      }
      setState((prev) => {
        return { ...prev, internalValue: arrSelectedItem };
      });
    } else {
      selectionValue.current = { selectedItem, index };
      setState((prev) => {
        const itemValue = state.filteredData?.[index].itemValue;
        const internalValue = Array.from(prev.internalValue);
        internalValue[index] = state.filteredData[index].data.find(
          (item) => item?.[itemValue] === selectedItem?.[itemValue]
        );
        return { ...prev, internalValue };
      });
    }
  };
  useEffect(() => {
    if (
      selectionValue.current.selectedItem &&
      selectionValue.current.index !== undefined
    ) {
      loadAsyncData(
        selectionValue.current.selectedItem,
        selectionValue.current.index + 1
      ).then(() => {
        setState((prev) => ({ ...prev, filteredData: filterData() }));
        if (selectionValue.current.index !== data.length - 1) {
          swiperRef?.current?.scrollBy?.(1, true);
        } else if (autoFinish) {
          _onFinish(
            display === "single" ? [selectionValue.current.selectedItem] : null
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.internalValue]);

  const swipeForward = (index: number) => {
    swiperRef?.current?.scrollBy?.(1, true);
    onSelectItem(state.internalValue[index], index);
  };

  const swipeBack = () => {
    return () => {
      swiperRef?.current?.scrollBy?.(-1, true);
    };
  };

  const onClose = () => {
    swiperRef?.current?.scrollTo?.(0, true);
    selectionValue.current = {};
    const newValue: ValueType[] = value.flatMap((item) => item);
    setState((prev) => ({
      ...prev,
      internalValue: multipleChoice ? newValue : [...value],
    }));

    loadAsyncData(null, 0).then(() =>
      setState((prev) => ({ ...prev, filteredData: filterData() }))
    );
    props.onClose && props.onClose();
  };

  const onOpen = () => {
    const newValue: ValueType[] = value.flatMap((item) => item);
    if (
      multipleChoice &&
      isSelectAll &&
      data.length > 0 &&
      newValue.length === data[0].data.length - 1
    ) {
      newValue.unshift(_objAll);
    }
    selectionValue.current =
      (multipleChoice && isSelectAll) || multipleChoice
        ? { index: 0, selectedItem: newValue }
        : {};
    setState((prev) => ({
      ...prev,
      internalValue:
        (multipleChoice && isSelectAll) || multipleChoice
          ? newValue
          : [...value],
    }));
    loadAsyncData(null, 0).then(() =>
      setState((prev) => ({ ...prev, filteredData: filterData() }))
    );
    props.onOpen && props.onOpen();
  };
  const onLoadMore = () => {
    props.onLoadMore && props.onLoadMore();
  };

  const _onFinish = (finalValue: ValueType[] | null = null) => {
    const _value = finalValue || state.internalValue;
    if (multipleChoice) {
      onFinish?.(_value);
    } else {
      const returnValue = data?.map((listItem, index) => {
        if (listItem.returnObject) {
          return _value?.[index];
        } else {
          return _value?.[index]?.[listItem.itemValue];
        }
      });
      onFinish?.(returnValue);
    }
    bottomSheetRef?.current?.hide?.();
    searchText.current = [];
  };

  const finishEnabled = () => {
    return (
      state.internalValue.length === data?.length &&
      state.internalValue.reduce((res, v) => res && !!v, true)
    );
  };

  const handleSearchEndEditing = (text: string) => {
    //@ts-ignore
    changeTextInOut && changeTextInOut(text);
  };

  const handleSearch = (text: string, index: number) => {
    searchText.current[index] = text;
    setState((prev) => ({ ...prev, filteredData: filterData() }));
  };

  const onPressNext = (index: number, pageData: ListItem) => {
    if (
      state.internalValue[index]?.[pageData.itemValue] &&
      state.filteredData[index]?.data?.findIndex(
        (item) =>
          item?.[pageData.itemValue] ===
          state.internalValue[index]?.[pageData.itemValue]
      ) >= 0
    ) {
      if (index === data.length - 1) {
        _onFinish();
      } else {
        swipeForward(index);
      }
    } else {
      _onFinish();
    }
  };

  const renderSearchInput = (index: number) => {
    return (
      <BaseInput
        name="search"
        containerStyle={styles.inputSearch}
        editable={true}
        leftIcon={<Image source={images.ic_search} style={styles.searchIcon} />}
        maxLength={150}
        placeholder={data[index]?.placeholder || ""}
        // value={searchText.current[index]}
        defaultValue={searchText.current[index]}
        placeholderTextColor={"#C8C8CA"}
        onChangeText={(text) => {
          handleSearch(text, index);
        }}
        onEndEditing={() => {
          handleSearchEndEditing(searchText.current[index]);
        }}
      />
    );
  };

  const renderSingleSheet = () => {
    const singleList = state.filteredData.length === 1;
    return (
      <>
        {singleList && header && (
          <>
            <View style={[styles.row, styles.justifySpaceBetween]}>
              <Text style={[styles.title]}>{state.filteredData[0].title}</Text>
              {!autoFinish && (
                <TouchableOpacity
                  style={styles.actionButton}
                  disabled={!finishEnabled()}
                  onPress={() => _onFinish()}
                >
                  <Text
                    style={
                      finishEnabled()
                        ? styles.actionText
                        : styles.disabledActionText
                    }
                  >
                    {"Xong"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {searchable && renderSearchInput(0)}
          </>
        )}
        {!singleList && header && !autoFinish && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonFinish]}
            disabled={!finishEnabled()}
            onPress={() => _onFinish()}
          >
            <Text
              style={
                finishEnabled() ? styles.actionText : styles.disabledActionText
              }
            >
              {"Xong"}
            </Text>
          </TouchableOpacity>
        )}
        {state.filteredData.reduce(
          (acc, listItem) => acc + listItem.data.length,
          0
        ) === 0 ? (
          <View style={styles.emptyView} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {state.filteredData
              .filter((listItem) => listItem.data.length > 0)
              .map((listItem, index) => (
                <View style={defaultStyles.pt_2} key={index}>
                  {!singleList && header && (
                    <View style={[styles.row, styles.justifySpaceBetween]}>
                      <Text style={styles.title}>{listItem.title}</Text>
                    </View>
                  )}
                  {listItem.data?.map((item, itemIndex) => (
                    <View
                      key={String(item?.[listItem.itemValue])}
                      style={[
                        defaultStyles.row,
                        defaultStyles.alignItemsCenter,
                      ]}
                    >
                      {listItem.showIcon && (
                        <View
                          style={[
                            styles.choiceIconContainer,
                            defaultStyles.centeredItem,
                          ]}
                        >
                          {item !== undefined &&
                            Boolean(item.icon) &&
                            item.icon}
                        </View>
                      )}
                      <View style={[defaultStyles.flex_1]}>
                        <TouchableOpacity
                          disabled={
                            item !== undefined &&
                            listItem.disableTextColor !== undefined &&
                            String(item[listItem.disableTextColor]) === `true`
                          }
                          style={[
                            styles.row,
                            styles.alignCenter,
                            styles.choiceButton,
                            !listItem.showIcon && defaultStyles.ml_3,
                          ]}
                          onPress={() => onSelectItem(item, index)}
                        >
                          {!listItem.showIcon && (
                            <RadioButton
                              color={colors.color_4353FA}
                              onPress={() => onSelectItem(item, index)}
                              status={
                                state.internalValue?.[index]?.[
                                  listItem.itemValue
                                ] === item?.[listItem.itemValue]
                                  ? "checked"
                                  : "unchecked"
                              }
                            />
                          )}
                          <Text
                            style={
                              item !== undefined &&
                              listItem.disableTextColor &&
                              String(item[listItem.disableTextColor]) === `true`
                                ? [
                                    styles.choiceText,
                                    { color: colors.color_C8C8CA },
                                  ]
                                : [styles.choiceText]
                            }
                          >
                            {item !== undefined &&
                              String(item[listItem.itemText])}
                          </Text>
                        </TouchableOpacity>
                        {itemIndex !== listItem.data?.length - 1 && (
                          <Divider color={"#C8C8CA"} lineSize={1} stretch />
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            <View style={styles.mb_24} />
          </ScrollView>
        )}
      </>
    );
  };

  const renderPage = (pageData: ListItem, index: number) => {
    if (isSelectAll) {
      const isHasAllValue = pageData.data.some(
        (item) => item && item[pageData.itemValue] === ALL_VALUE
      );
      if (!isHasAllValue) {
        pageData.data.unshift(_objAll);
      }
    }

    const isChecked = (item) => {
      if (state.internalValue.length > 0) {
        const _isChecked = state.internalValue.some((internalValue) => {
          if (internalValue === undefined) {
            return false;
          } else if (internalValue?.[itemValue] === item?.[itemValue]) {
            return true;
          }
        });
        return _isChecked;
      } else {
        return false;
      }
    };

    return (
      <View
        style={styles.flex_1}
        key={String(state.internalValue[index]?.[pageData.itemValue])}
      >
        {header && (
          <View style={[styles.row, styles.justifySpaceBetween]}>
            {index !== 0 ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={swipeBack()}
              >
                <Text style={styles.actionText}>{"Trước"}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.actionButton} />
            )}
            <Text style={styles.title}>
              {index === 0 || !displayValue
                ? pageData?.title
                : String(
                    state.internalValue?.[index - 1]?.[
                      data?.[index - 1]?.itemText
                    ]
                  )}
            </Text>
            <View style={styles.actionButton}>
              {index === data.length - 1 && !autoFinish && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onPressNext(index, pageData)}
                >
                  <Text style={styles.actionText}>{"Xong"}</Text>
                </TouchableOpacity>
              )}
              {index !== data.length - 1 && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onPressNext(index, pageData)}
                >
                  <Text style={styles.actionText}>{"Tiếp"}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {searchable && renderSearchInput(index)}
        {pageData?.data?.length !== 0 ? (
          <FlatList
            //phân trang imei
            onEndReachedThreshold={0.7}
            onEndReached={() => {
              if (isLoadMore) {
                onLoadMore();
              }
            }}
            data={pageData?.data}
            keyExtractor={(item, index) =>
              String(item?.[pageData.itemValue] + "_" + index)
            }
            style={defaultStyles.mb_2}
            renderItem={({ item, index: itemIndex }) => {
              return (
                <View
                  style={[defaultStyles.row, defaultStyles.alignItemsCenter]}
                >
                  {pageData.showIcon && (
                    <View
                      style={[
                        styles.choiceIconContainer,
                        defaultStyles.centeredItem,
                      ]}
                    >
                      {item !== undefined && Boolean(item.icon) && item.icon}
                    </View>
                  )}
                  <View style={[defaultStyles.flex_1]}>
                    <TouchableOpacity
                      key={String(item?.[pageData.itemValue])}
                      style={[
                        styles.row,
                        styles.alignCenter,
                        styles.choiceButton,
                        !pageData.showIcon && defaultStyles.ml_3,
                      ]}
                      disabled={
                        disableItems &&
                        disableItems.includes(item?.[pageData.itemValue])
                      }
                      onPress={() => onSelectItem(item, index)}
                    >
                      {multipleChoice ? (
                        <Checkbox
                          color={colors.color_EE0033}
                          onPress={() => onSelectItem(item, index)}
                          disabled={
                            disableItems &&
                            disableItems.includes(item?.[pageData.itemValue])
                          }
                          checked={isChecked(item)}
                        />
                      ) : (
                        <RadioButton
                          color={colors.color_4353FA}
                          onPress={() => onSelectItem(item, index)}
                          disabled={
                            disableItems &&
                            disableItems.includes(item?.[pageData.itemValue])
                          }
                          status={
                            item?.[pageData.itemValue] ===
                            state.internalValue?.[index]?.[pageData.itemValue]
                              ? "checked"
                              : "unchecked"
                          }
                        />
                      )}
                      <Text
                        style={[
                          styles.choiceText,
                          firstE && itemIndex === 0 ? styles.gray : null,
                          disableItems &&
                          disableItems.includes(item?.[pageData.itemValue])
                            ? { color: colors.color_disable }
                            : null,
                        ]}
                      >
                        {String(item?.[pageData.itemText])}
                      </Text>
                    </TouchableOpacity>
                    {itemIndex !== pageData.data.length - 1 && (
                      <Divider color={"#C8C8CA"} lineSize={1} stretch />
                    )}
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={[styles.flex_1, styles.bgWhite]}>
            {state.loading ? (
              <ActivityIndicator
                style={styles.flex_1}
                color={colors.color_4353FA}
              />
            ) : (
              <View style={styles.emptyView} />
            )}
          </View>
        )}
      </View>
    );
  };

  const renderSteppedSheets = () => {
    return (
      <Swiper
        ref={swiperRef}
        autoplay={false}
        showsButtons={false}
        showsPagination={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        loop={false}
      >
        {state.filteredData?.map((listItem, index) => {
          return renderPage(listItem, index);
        })}
      </Swiper>
    );
  };

  useEffect(() => {
    if (imperativeState === "show") {
      bottomSheetRef?.current?.show();
    }
  }, [imperativeState]);

  return (
    <>
      {children &&
        React.cloneElement(children, {
          onPress: () => {
            children.props.onPress && children.props.onPress();
            if (imperativeState === null) {
              bottomSheetRef?.current?.show();
            }
          },
        })}
      <BottomSheet
        ref={bottomSheetRef}
        height={height}
        onClose={onClose}
        onOpen={onOpen}
        style={styles.container}
      >
        {display && display === "single" && renderSingleSheet()}
        {display && display === "stepped" && renderSteppedSheets()}
      </BottomSheet>
    </>
  );
};

export default MultipleChoiceBottomSheet;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "stretch",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  row: {
    flexDirection: "row",
  },
  justifySpaceBetween: {
    justifyContent: "space-between",
  },
  alignCenter: {
    alignItems: "center",
  },
  inputSearch: {
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderColor: colors.color_C8C8CA,
    borderWidth: 0.5,
    borderRadius: 24,
    // ...elevations[1],
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.color_0A0A12,
    paddingTop: Platform.OS === "ios" ? 4 : 0,
    textAlign: "center",
    flex: 1,
  },
  actionButton: {
    // paddingHorizontal: 16,
    paddingRight: 16,
    alignSelf: "stretch",
    // alignItems: "center",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 4,
    minWidth: 70,
    maxWidth: 70,
  },
  actionText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#EE0033",
  },
  actionButtonFinish: {
    position: "absolute",
    top: 24,
    right: 0,
    zIndex: 10,
  },
  disabledActionText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.color_929295,
  },
  choiceButton: {
    alignSelf: "stretch",
    paddingVertical: 8,
    marginRight: 16,
  },
  choiceText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: "#333",
    marginLeft: 8,
    paddingTop: 4,
    flex: 1,
  },
  choiceIcon: {
    height: 23,
    width: 23,
  },
  choiceIconContainer: {
    width: 48,
    height: 48,
  },
  searchIcon: { width: 18, height: 18 },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mb_24: {
    marginBottom: 24,
  },
  flex_1: {
    flex: 1,
  },
  bgWhite: {
    backgroundColor: "white",
  },
  gray: {
    color: "#707070",
  },
});
