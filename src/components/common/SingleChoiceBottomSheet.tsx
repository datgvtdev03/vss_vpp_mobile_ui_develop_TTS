import React from "react";
import MultipleChoiceBottomSheet, {
  ALL_VALUE,
  ValueType,
} from "./MultipleChoiceBottomSheet";

export interface SingleChoiceProps<P> {
  data: P[];
  itemText: keyof P;
  itemValue: keyof P;
  value?: P;
  onFinish?: (p: P) => void;
  onOpen?: () => void;
  onClose?: (p?: P) => void;
  imperativeState?: "show" | "hide" | null;
  height?: number;
  header?: boolean;
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  showIcon?: boolean;
  keepPosition?: boolean;
  firstE?: boolean;
  isLoadMore?: boolean;
  changeTextInOut?: (e: string) => void;
  onLoadMore?: () => void;
  multipleChoice?: boolean;
  isSelectAll?: boolean;
  autoFinish?: boolean;
  isInventory?: boolean;
  disableItems?: number[];
}

function SingleChoiceBottomSheet<P>({
  data,
  itemText,
  itemValue,
  value,
  onFinish,
  onOpen,
  onClose,
  imperativeState = null,
  height = 400,
  header = true,
  title,
  searchable,
  searchPlaceholder,
  showIcon,
  keepPosition = true,
  firstE,
  children,
  isLoadMore,
  changeTextInOut,
  onLoadMore,
  multipleChoice,
  isSelectAll,
  autoFinish,
  disableItems,
}: SingleChoiceProps<P> & { children?: React.ReactElement }) {
  return (
    <MultipleChoiceBottomSheet
      height={height}
      display="stepped"
      // autoFinish
      autoFinish={autoFinish}
      searchable={searchable}
      keepPosition={keepPosition}
      header={header}
      changeTextInOut={changeTextInOut}
      data={[
        {
          data: data as unknown as ValueType[],
          itemText: itemText as string,
          itemValue: itemValue as string,
          title,
          placeholder: searchPlaceholder,
          returnObject: multipleChoice ? false : true,
          showIcon: showIcon,
        },
      ]}
      value={[value as unknown as ValueType]}
      onFinish={(value) => {
        if (multipleChoice && isSelectAll) {
          const _value = value?.filter((item) => item[itemValue] !== ALL_VALUE);
          onFinish?.(_value as unknown as P);
        } else if (multipleChoice) {
          value && onFinish?.(value as unknown as P);
        } else {
          value && value[0] && onFinish?.(value[0] as P);
        }
      }}
      onOpen={onOpen}
      onClose={onClose}
      imperativeState={imperativeState}
      children={children}
      firstE={firstE}
      isLoadMore={isLoadMore}
      onLoadMore={onLoadMore}
      multipleChoice={multipleChoice}
      isSelectAll={isSelectAll}
      itemText={itemText as string}
      itemValue={itemValue as string}
      disableItems={disableItems}
    />
  );
}

export default SingleChoiceBottomSheet;
