import React from "react";
import Svgs from "src/constants/Svgs";

export interface BottomSheetActionProps {
  actionId: number;
  actionName: string;
  icon: React.ReactElement;
}

export enum StatisticType {
  Personal = 1,
  Group = 2,
}

export enum PostType {
  NoPost = 1,
  Post = 2,
}

export const PostName = {
  [PostType.NoPost]: "Chạy tiếp và không lên bài",
  [PostType.Post]: "Có lên bài mới",
} as const;

export enum ActionId {
  Add = 1,
  Edit = 2,
  Copy = 3,
  Delete = 4,
  Click = 5,
}

export const ActionObj = {
  [ActionId.Add]: "Thêm sản lượng",
  [ActionId.Edit]: "Sửa",
  [ActionId.Copy]: "Sao chép",
  [ActionId.Delete]: "Xóa",
  [ActionId.Click]: "Click",
} as const;

export const BottomSheetActions: BottomSheetActionProps[] = [
  {
    actionId: ActionId.Edit,
    actionName: "Sửa",
    icon: <Svgs.Edit fill={"#EE0033"} />,
  },
  {
    actionId: ActionId.Copy,
    actionName: "Sao chép",
    icon: <Svgs.Copy fill={"#EE0033"} />,
  },
  {
    actionId: ActionId.Delete,
    actionName: "Xóa",
    icon: <Svgs.Delete fill={"#EE0033"} />,
  },
  {
    actionId: ActionId.Add,
    actionName: "Thêm sản lượng",
    icon: <Svgs.AddQuantity fill={"#EE0033"} />,
  },

  {
    actionId: ActionId.Click,
    actionName: "Click",
    icon: <Svgs.AddQuantity fill={"#EE0033"} />
  },
];
