import { StyleSheet } from "react-native";
import colors from "src/constants/colors";

const styles = StyleSheet.create({
  QRcode: {
    position: "absolute",
    bottom: 10, // space from bottombar
    height: 56,
    width: 56,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EE0033",
  },
  stack: {
    flex: 1,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 5,
  },
  item: {
    paddingTop: 20,
    flexBasis: "25%",
    maxWidth: "25%",
    alignItems: "center",
    alignContent: "center",
  },
  itemView: {
    alignItems: "center",
  },
  itemText: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10,
    alignContent: "center",
  },
  title: {
    fontSize: 10,
  },
  ViewLeftMenu: {
    backgroundColor: "#EE0033",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  ViewLeftMenuContent: {
    width: "100%",
    paddingHorizontal: 20,
  },
  ViewLeftMenuItem: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  ItemHeadLeft: { position: "absolute", left: 0 },
  ItemHeadRight: { position: "absolute", right: 0 },
  ViewHead: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "row",
    marginTop: 32,
    marginBottom: 24,
  },
  SlideshowPlaceholder: {
    height: 66,
  },
  ViewSlideShow: {
    height: 150,
    left: 20,
    right: 20,
    borderRadius: 16,
    position: "absolute",
    bottom: -70,
  },
  ItemHearImage: {
    height: 40,
    width: 40,
  },
  TextTop: {
    color: "white",
    fontWeight: "bold",
  },
  TextCenter: {
    fontWeight: "bold",
    color: "white",
  },
  TextBot: {
    marginTop: 5,
    color: "white",
    fontWeight: "bold",
  },
  textView: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "row",
  },
  viewHearLeft: { flex: 1, marginLeft: 20 },
  viewHearLeftContent: { flexDirection: "row", flexWrap: "wrap" },
  paddingStatusHeight: {
    // paddingTop: dimens.avoidStatusBarDistance,
    zIndex: 1,
  },
  notiView: {
    position: "absolute",
    zIndex: 1,
    right: 5,
    top: -5,
  },
  notiText: { color: "white", fontSize: 8, fontWeight: "600" },
  salaryViewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  salaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  salaryReportContainer: {
    marginBottom: 12,
    marginTop: 12,
    flex: 1,
    flexDirection: "row",
    marginLeft: 16,
    marginRight: 16,
  },
  salaryReportText: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    opacity: 0.3,
  },
  salaryReportCurrencyText: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    paddingBottom: 5,
    opacity: 0.3,
  },
  viewDebt: {
    padding: 8,
    backgroundColor: "#fff",
    flex: 1,
    marginBottom: 8,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    elevation: 3,
  },
  card: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    elevation: 3,
  },
  containDebt: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  txtVND: {
    fontSize: 14,
    color: "#000",
    marginLeft: 2,
    fontWeight: "bold",
  },
  txtSell: {
    color: colors.color_0A0A12,
    marginLeft: 8,
    fontSize: 14,
  },
  vbos: {
    color: "#ffffff",
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: "bold",
  },
});

export default styles;
