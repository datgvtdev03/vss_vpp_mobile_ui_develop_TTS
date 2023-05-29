import { TextStyle, ViewStyle } from "react-native";

type keys =
  | "r"
  | "abs"
  | "top"
  | "bottom"
  | "right"
  | "left"
  | "fs_12"
  | "fs_13"
  | "fs_14"
  | "fs_15"
  | "fs_16"
  | "fs_17"
  | "fs_18"
  | "fs_19"
  | "fs_20"
  | "fs_21"
  | "fs_22"
  | "fs_23"
  | "fs_24"
  | "fw_100"
  | "fw_200"
  | "fw_300"
  | "fw_400"
  | "fw_500"
  | "fw_600"
  | "fw_700"
  | "fw_800"
  | "fw_900"
  | "fwBold"
  | "fwNormal"
  | "i"
  | "taRight"
  | "taCenter"
  | "taLeft"
  | "pa_0"
  | "pt_0"
  | "pb_0"
  | "pl_0"
  | "pr_0"
  | "px_0"
  | "py_0"
  | "pa_1"
  | "pt_1"
  | "pb_1"
  | "pl_1"
  | "pr_1"
  | "px_1"
  | "py_1"
  | "pa_2"
  | "pt_2"
  | "pb_2"
  | "pl_2"
  | "pr_2"
  | "px_2"
  | "py_2"
  | "pa_3"
  | "pt_3"
  | "pb_3"
  | "pl_3"
  | "pr_3"
  | "px_3"
  | "py_3"
  | "pa_4"
  | "pt_4"
  | "pb_4"
  | "pl_4"
  | "pr_4"
  | "px_4"
  | "py_4"
  | "pa_5"
  | "pt_5"
  | "pb_5"
  | "pl_5"
  | "pr_5"
  | "px_5"
  | "py_5"
  | "pa_6"
  | "pt_6"
  | "pb_6"
  | "pl_6"
  | "pr_6"
  | "px_6"
  | "py_6"
  | "pa_7"
  | "pt_7"
  | "pb_7"
  | "pl_7"
  | "pr_7"
  | "px_7"
  | "py_7"
  | "pa_8"
  | "pt_8"
  | "pb_8"
  | "pl_8"
  | "pr_8"
  | "px_8"
  | "py_8"
  | "pa_9"
  | "pt_9"
  | "pb_9"
  | "pl_9"
  | "pr_9"
  | "px_9"
  | "py_9"
  | "pa_10"
  | "pt_10"
  | "pb_10"
  | "pl_10"
  | "pr_10"
  | "px_10"
  | "py_10"
  | "ma_0"
  | "mt_0"
  | "mb_0"
  | "ml_0"
  | "mr_0"
  | "mx_0"
  | "my_0"
  | "ma_1"
  | "mt_1"
  | "mb_1"
  | "ml_1"
  | "mr_1"
  | "mx_1"
  | "my_1"
  | "ma_2"
  | "mt_2"
  | "mb_2"
  | "ml_2"
  | "mr_2"
  | "mx_2"
  | "my_2"
  | "ma_3"
  | "mt_3"
  | "mb_3"
  | "ml_3"
  | "mr_3"
  | "mx_3"
  | "my_3"
  | "ma_4"
  | "mt_4"
  | "mb_4"
  | "ml_4"
  | "mr_4"
  | "mx_4"
  | "my_4"
  | "ma_5"
  | "mt_5"
  | "mb_5"
  | "ml_5"
  | "mr_5"
  | "mx_5"
  | "my_5"
  | "ma_6"
  | "mt_6"
  | "mb_6"
  | "ml_6"
  | "mr_6"
  | "mx_6"
  | "my_6"
  | "ma_7"
  | "mt_7"
  | "mb_7"
  | "ml_7"
  | "mr_7"
  | "mx_7"
  | "my_7"
  | "ma_8"
  | "mt_8"
  | "mb_8"
  | "ml_8"
  | "mr_8"
  | "mx_8"
  | "my_8"
  | "ma_9"
  | "mt_9"
  | "mb_9"
  | "ml_9"
  | "mr_9"
  | "mx_9"
  | "my_9"
  | "ma_10"
  | "mt_10"
  | "mb_10"
  | "ml_10"
  | "mr_10"
  | "mx_10"
  | "my_10"
  | "br_0"
  | "btlr_0"
  | "btrr_0"
  | "bblr_0"
  | "bbrr_0"
  | "br_1"
  | "btlr_1"
  | "btrr_1"
  | "bblr_1"
  | "bbrr_1"
  | "br_2"
  | "btlr_2"
  | "btrr_2"
  | "bblr_2"
  | "bbrr_2"
  | "br_3"
  | "btlr_3"
  | "btrr_3"
  | "bblr_3"
  | "bbrr_3"
  | "br_4"
  | "btlr_4"
  | "btrr_4"
  | "bblr_4"
  | "bbrr_4"
  | "br_5"
  | "btlr_5"
  | "btrr_5"
  | "bblr_5"
  | "bbrr_5"
  | "ba_0"
  | "btw_0"
  | "bbw_0"
  | "brw_0"
  | "blw_0"
  | "ba_1"
  | "btw_1"
  | "bbw_1"
  | "brw_1"
  | "blw_1"
  | "ba_2"
  | "btw_2"
  | "bbw_2"
  | "brw_2"
  | "blw_2"
  | "ba_3"
  | "btw_3"
  | "bbw_3"
  | "brw_3"
  | "blw_3"
  | "ba_4"
  | "btw_4"
  | "bbw_4"
  | "brw_4"
  | "blw_4"
  | "ba_5"
  | "btw_5"
  | "bbw_5"
  | "brw_5"
  | "blw_5"
  | "w_0"
  | "h_0"
  | "w_10"
  | "h_10"
  | "w_12"
  | "h_12"
  | "w_20"
  | "h_20"
  | "w_25"
  | "h_25"
  | "w_30"
  | "h_30"
  | "w_33"
  | "h_33"
  | "w_40"
  | "h_40"
  | "w_50"
  | "h_50"
  | "w_60"
  | "h_60"
  | "w_66"
  | "h_66"
  | "w_70"
  | "h_70"
  | "w_75"
  | "h_75"
  | "w_80"
  | "h_80"
  | "w_90"
  | "h_90"
  | "w_100"
  | "h_100"
  | "op_0"
  | "op_1"
  | "op_2"
  | "op_3"
  | "op_4"
  | "op_5"
  | "op_6"
  | "op_7"
  | "op_8"
  | "op_9"
  | "transparent"
  | "hidden"
  | "overflowHidden"
  | "overflowScroll"
  | "zIndex_0"
  | "zIndex_1"
  | "zIndex_2"
  | "zIndex_3"
  | "zIndex_4"
  | "zIndex_5"
  | "zIndex_6"
  | "zIndex_7"
  | "zIndex_8"
  | "zIndex_9";

const atomicUtils: Record<keys, ViewStyle | TextStyle> = {
  r: { position: "relative" },
  abs: { position: "absolute" },
  top: { top: 0 },
  bottom: { bottom: 0 },
  right: { right: 0 },
  left: { left: 0 },
  fs_12: { fontSize: 12 },
  fs_13: { fontSize: 13 },
  fs_14: { fontSize: 14 },
  fs_15: { fontSize: 15 },
  fs_16: { fontSize: 16 },
  fs_17: { fontSize: 17 },
  fs_18: { fontSize: 18 },
  fs_19: { fontSize: 19 },
  fs_20: { fontSize: 20 },
  fs_21: { fontSize: 21 },
  fs_22: { fontSize: 22 },
  fs_23: { fontSize: 23 },
  fs_24: { fontSize: 24 },
  fw_100: { fontWeight: "100" },
  fw_200: { fontWeight: "200" },
  fw_300: { fontWeight: "300" },
  fw_400: { fontWeight: "400" },
  fw_500: { fontWeight: "500" },
  fw_600: { fontWeight: "600" },
  fw_700: { fontWeight: "700" },
  fw_800: { fontWeight: "800" },
  fw_900: { fontWeight: "900" },
  fwBold: { fontWeight: "bold" },
  fwNormal: { fontWeight: "normal" },
  i: { fontStyle: "italic" },
  taRight: { textAlign: "right" },
  taCenter: { textAlign: "center" },
  taLeft: { textAlign: "left" },
  pa_0: { padding: 0 },
  pt_0: { paddingTop: 0 },
  pb_0: { paddingBottom: 0 },
  pl_0: { paddingLeft: 0 },
  pr_0: { paddingRight: 0 },
  px_0: { paddingHorizontal: 0 },
  py_0: { paddingVertical: 0 },
  pa_1: { padding: 6 },
  pt_1: { paddingTop: 6 },
  pb_1: { paddingBottom: 6 },
  pl_1: { paddingLeft: 6 },
  pr_1: { paddingRight: 6 },
  px_1: { paddingHorizontal: 6 },
  py_1: { paddingVertical: 6 },
  pa_2: { padding: 12 },
  pt_2: { paddingTop: 12 },
  pb_2: { paddingBottom: 12 },
  pl_2: { paddingLeft: 12 },
  pr_2: { paddingRight: 12 },
  px_2: { paddingHorizontal: 12 },
  py_2: { paddingVertical: 12 },
  pa_3: { padding: 18 },
  pt_3: { paddingTop: 18 },
  pb_3: { paddingBottom: 18 },
  pl_3: { paddingLeft: 18 },
  pr_3: { paddingRight: 18 },
  px_3: { paddingHorizontal: 18 },
  py_3: { paddingVertical: 18 },
  pa_4: { padding: 24 },
  pt_4: { paddingTop: 24 },
  pb_4: { paddingBottom: 24 },
  pl_4: { paddingLeft: 24 },
  pr_4: { paddingRight: 24 },
  px_4: { paddingHorizontal: 24 },
  py_4: { paddingVertical: 24 },
  pa_5: { padding: 30 },
  pt_5: { paddingTop: 30 },
  pb_5: { paddingBottom: 30 },
  pl_5: { paddingLeft: 30 },
  pr_5: { paddingRight: 30 },
  px_5: { paddingHorizontal: 30 },
  py_5: { paddingVertical: 30 },
  pa_6: { padding: 36 },
  pt_6: { paddingTop: 36 },
  pb_6: { paddingBottom: 36 },
  pl_6: { paddingLeft: 36 },
  pr_6: { paddingRight: 36 },
  px_6: { paddingHorizontal: 36 },
  py_6: { paddingVertical: 36 },
  pa_7: { padding: 42 },
  pt_7: { paddingTop: 42 },
  pb_7: { paddingBottom: 42 },
  pl_7: { paddingLeft: 42 },
  pr_7: { paddingRight: 42 },
  px_7: { paddingHorizontal: 42 },
  py_7: { paddingVertical: 42 },
  pa_8: { padding: 48 },
  pt_8: { paddingTop: 48 },
  pb_8: { paddingBottom: 48 },
  pl_8: { paddingLeft: 48 },
  pr_8: { paddingRight: 48 },
  px_8: { paddingHorizontal: 48 },
  py_8: { paddingVertical: 48 },
  pa_9: { padding: 54 },
  pt_9: { paddingTop: 54 },
  pb_9: { paddingBottom: 54 },
  pl_9: { paddingLeft: 54 },
  pr_9: { paddingRight: 54 },
  px_9: { paddingHorizontal: 54 },
  py_9: { paddingVertical: 54 },
  pa_10: { padding: 60 },
  pt_10: { paddingTop: 60 },
  pb_10: { paddingBottom: 60 },
  pl_10: { paddingLeft: 60 },
  pr_10: { paddingRight: 60 },
  px_10: { paddingHorizontal: 60 },
  py_10: { paddingVertical: 60 },
  ma_0: { margin: 0 },
  mt_0: { marginTop: 0 },
  mb_0: { marginBottom: 0 },
  ml_0: { marginLeft: 0 },
  mr_0: { marginRight: 0 },
  mx_0: { marginHorizontal: 0 },
  my_0: { marginVertical: 0 },
  ma_1: { margin: 8 },
  mt_1: { marginTop: 8 },
  mb_1: { marginBottom: 8 },
  ml_1: { marginLeft: 8 },
  mr_1: { marginRight: 8 },
  mx_1: { marginHorizontal: 8 },
  my_1: { marginVertical: 8 },
  ma_2: { margin: 16 },
  mt_2: { marginTop: 16 },
  mb_2: { marginBottom: 16 },
  ml_2: { marginLeft: 16 },
  mr_2: { marginRight: 16 },
  mx_2: { marginHorizontal: 16 },
  my_2: { marginVertical: 16 },
  ma_3: { margin: 24 },
  mt_3: { marginTop: 24 },
  mb_3: { marginBottom: 24 },
  ml_3: { marginLeft: 24 },
  mr_3: { marginRight: 24 },
  mx_3: { marginHorizontal: 24 },
  my_3: { marginVertical: 24 },
  ma_4: { margin: 32 },
  mt_4: { marginTop: 32 },
  mb_4: { marginBottom: 32 },
  ml_4: { marginLeft: 32 },
  mr_4: { marginRight: 32 },
  mx_4: { marginHorizontal: 32 },
  my_4: { marginVertical: 32 },
  ma_5: { margin: 40 },
  mt_5: { marginTop: 40 },
  mb_5: { marginBottom: 40 },
  ml_5: { marginLeft: 40 },
  mr_5: { marginRight: 40 },
  mx_5: { marginHorizontal: 40 },
  my_5: { marginVertical: 40 },
  ma_6: { margin: 48 },
  mt_6: { marginTop: 48 },
  mb_6: { marginBottom: 48 },
  ml_6: { marginLeft: 48 },
  mr_6: { marginRight: 48 },
  mx_6: { marginHorizontal: 48 },
  my_6: { marginVertical: 48 },
  ma_7: { margin: 56 },
  mt_7: { marginTop: 56 },
  mb_7: { marginBottom: 56 },
  ml_7: { marginLeft: 56 },
  mr_7: { marginRight: 56 },
  mx_7: { marginHorizontal: 56 },
  my_7: { marginVertical: 56 },
  ma_8: { margin: 64 },
  mt_8: { marginTop: 64 },
  mb_8: { marginBottom: 64 },
  ml_8: { marginLeft: 64 },
  mr_8: { marginRight: 64 },
  mx_8: { marginHorizontal: 64 },
  my_8: { marginVertical: 64 },
  ma_9: { margin: 72 },
  mt_9: { marginTop: 72 },
  mb_9: { marginBottom: 72 },
  ml_9: { marginLeft: 72 },
  mr_9: { marginRight: 72 },
  mx_9: { marginHorizontal: 72 },
  my_9: { marginVertical: 72 },
  ma_10: { margin: 80 },
  mt_10: { marginTop: 80 },
  mb_10: { marginBottom: 80 },
  ml_10: { marginLeft: 80 },
  mr_10: { marginRight: 80 },
  mx_10: { marginHorizontal: 80 },
  my_10: { marginVertical: 80 },
  br_0: { borderRadius: 0 },
  btlr_0: { borderTopLeftRadius: 0 },
  btrr_0: { borderTopRightRadius: 0 },
  bblr_0: { borderBottomLeftRadius: 0 },
  bbrr_0: { borderBottomRightRadius: 0 },
  br_1: { borderRadius: 2 },
  btlr_1: { borderTopLeftRadius: 2 },
  btrr_1: { borderTopRightRadius: 2 },
  bblr_1: { borderBottomLeftRadius: 2 },
  bbrr_1: { borderBottomRightRadius: 2 },
  br_2: { borderRadius: 4 },
  btlr_2: { borderTopLeftRadius: 4 },
  btrr_2: { borderTopRightRadius: 4 },
  bblr_2: { borderBottomLeftRadius: 4 },
  bbrr_2: { borderBottomRightRadius: 4 },
  br_3: { borderRadius: 6 },
  btlr_3: { borderTopLeftRadius: 6 },
  btrr_3: { borderTopRightRadius: 6 },
  bblr_3: { borderBottomLeftRadius: 6 },
  bbrr_3: { borderBottomRightRadius: 6 },
  br_4: { borderRadius: 8 },
  btlr_4: { borderTopLeftRadius: 8 },
  btrr_4: { borderTopRightRadius: 8 },
  bblr_4: { borderBottomLeftRadius: 8 },
  bbrr_4: { borderBottomRightRadius: 8 },
  br_5: { borderRadius: 10 },
  btlr_5: { borderTopLeftRadius: 10 },
  btrr_5: { borderTopRightRadius: 10 },
  bblr_5: { borderBottomLeftRadius: 10 },
  bbrr_5: { borderBottomRightRadius: 10 },
  ba_0: { borderWidth: 0 },
  btw_0: { borderTopWidth: 0 },
  bbw_0: { borderBottomWidth: 0 },
  brw_0: { borderRightWidth: 0 },
  blw_0: { borderLeftWidth: 0 },
  ba_1: { borderWidth: 1 },
  btw_1: { borderTopWidth: 1 },
  bbw_1: { borderBottomWidth: 1 },
  brw_1: { borderRightWidth: 1 },
  blw_1: { borderLeftWidth: 1 },
  ba_2: { borderWidth: 2 },
  btw_2: { borderTopWidth: 2 },
  bbw_2: { borderBottomWidth: 2 },
  brw_2: { borderRightWidth: 2 },
  blw_2: { borderLeftWidth: 2 },
  ba_3: { borderWidth: 3 },
  btw_3: { borderTopWidth: 3 },
  bbw_3: { borderBottomWidth: 3 },
  brw_3: { borderRightWidth: 3 },
  blw_3: { borderLeftWidth: 3 },
  ba_4: { borderWidth: 4 },
  btw_4: { borderTopWidth: 4 },
  bbw_4: { borderBottomWidth: 4 },
  brw_4: { borderRightWidth: 4 },
  blw_4: { borderLeftWidth: 4 },
  ba_5: { borderWidth: 5 },
  btw_5: { borderTopWidth: 5 },
  bbw_5: { borderBottomWidth: 5 },
  brw_5: { borderRightWidth: 5 },
  blw_5: { borderLeftWidth: 5 },
  w_0: { width: "0%", maxWidth: "0%" },
  h_0: { height: "0%", maxHeight: "0%" },
  w_10: { width: "10%", maxWidth: "10%" },
  h_10: { height: "10%", maxHeight: "10%" },
  w_12: { width: "12.5%", maxWidth: "12.5%" },
  h_12: { height: "12.5%", maxHeight: "12.5%" },
  w_20: { width: "20%", maxWidth: "20%" },
  h_20: { height: "20%", maxHeight: "20%" },
  w_25: { width: "25%", maxWidth: "25%" },
  h_25: { height: "25%", maxHeight: "25%" },
  w_30: { width: "30%", maxWidth: "30%" },
  h_30: { height: "30%", maxHeight: "30%" },
  w_33: { width: "33.3333%", maxWidth: "33.3333%" },
  h_33: { height: "33.3333%", maxHeight: "33.3333%" },
  w_40: { width: "40%", maxWidth: "40%" },
  h_40: { height: "40%", maxHeight: "40%" },
  w_50: { width: "50%", maxWidth: "50%" },
  h_50: { height: "50%", maxHeight: "50%" },
  w_60: { width: "60%", maxWidth: "60%" },
  h_60: { height: "60%", maxHeight: "60%" },
  w_66: { width: "66.6667%", maxWidth: "66.6667%" },
  h_66: { height: "66.6667%", maxHeight: "66.6667%" },
  w_70: { width: "70%", maxWidth: "70%" },
  h_70: { height: "70%", maxHeight: "70%" },
  w_75: { width: "75%", maxWidth: "75%" },
  h_75: { height: "75%", maxHeight: "75%" },
  w_80: { width: "80%", maxWidth: "80%" },
  h_80: { height: "80%", maxHeight: "80%" },
  w_90: { width: "90%", maxWidth: "90%" },
  h_90: { height: "90%", maxHeight: "90%" },
  w_100: { width: "100%", maxWidth: "100%" },
  h_100: { height: "100%", maxHeight: "100%" },
  op_0: { opacity: 0 },
  op_1: { opacity: 0.1 },
  op_2: { opacity: 0.2 },
  op_3: { opacity: 0.3 },
  op_4: { opacity: 0.4 },
  op_5: { opacity: 0.5 },
  op_6: { opacity: 0.6 },
  op_7: { opacity: 0.7 },
  op_8: { opacity: 0.8 },
  op_9: { opacity: 0.9 },
  transparent: {
    backgroundColor: "transparent",
    color: "transparent",
    borderWidth: 0,
  },
  hidden: { display: "none" },
  overflowHidden: { overflow: "hidden" },
  overflowScroll: { overflow: "scroll" },
  zIndex_0: { zIndex: 0 },
  zIndex_1: { zIndex: 1 },
  zIndex_2: { zIndex: 2 },
  zIndex_3: { zIndex: 3 },
  zIndex_4: { zIndex: 4 },
  zIndex_5: { zIndex: 5 },
  zIndex_6: { zIndex: 6 },
  zIndex_7: { zIndex: 7 },
  zIndex_8: { zIndex: 8 },
  zIndex_9: { zIndex: 9 },
};

export default atomicUtils;
