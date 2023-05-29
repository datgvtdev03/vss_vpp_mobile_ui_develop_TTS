import { StyleSheet } from "react-native";
import colors from "src/constants/colors";

const styles = StyleSheet.create({
  itemView: {
    flex: 1,
    flexDirection: "column",
  },
  itemViewInput: {
    flex: 9,
    backgroundColor: colors.color_line_table,
  },
  itemViewButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTiepTuc: {
    alignItems: "center",
    backgroundColor: colors.color_EE0033,
    padding: 10,
    width: "70%",
    borderColor: colors.color_EE0033,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 15,
  },
  textTiepTuc: {
    color: colors.white,
    fontWeight: "bold",
  },
  buttonBoQua: {
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 10,
    width: "70%",
    borderColor: colors.color_EE0033,
    borderWidth: 1,
    borderRadius: 20,
    marginLeft: 15,
  },
  textBoQua: {
    color: colors.color_EE0033,
    fontWeight: "bold",
  },
  viewBtn: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
export default styles;
