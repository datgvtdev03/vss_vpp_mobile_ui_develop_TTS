import React, { ReactElement, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Animated,
  TouchableOpacity,
} from "react-native";
import { TouchableOpacity as MoreTouch } from "react-native-gesture-handler";
import { elevations } from "src/common/styles/elevation";
import colors from "src/constants/colors";
import Svgs from "src/constants/Svgs";

interface itemBtnAction {
  styleItem: ViewStyle;
  onPress?: () => void;
  children: ReactElement;
}

const FirstItemActionBtn = ({
  styleItem,
  onPress,
  children,
}: itemBtnAction) => {
  return (
    <Animated.View style={[styles.btnItem, styleItem]}>
      <MoreTouch style={styles.clickView} onPress={onPress}>
        {children}
      </MoreTouch>
    </Animated.View>
  );
};

const SecondaryItemActionBtn = ({
  styleItem,
  onPress,
  children,
}: itemBtnAction) => {
  return (
    <Animated.View style={[styles.btnItem, styleItem]}>
      <MoreTouch style={styles.clickView} onPress={onPress}>
        {children}
      </MoreTouch>
    </Animated.View>
  );
};

const ThreeItemActionBtn = ({
  styleItem,
  onPress,
  children,
}: itemBtnAction) => {
  return (
    <Animated.View style={[styles.btnItem, styleItem]}>
      <MoreTouch style={styles.clickView} onPress={onPress}>
        <View>{children}</View>
      </MoreTouch>
    </Animated.View>
  );
};

interface ActionBtnProp {
  styleBtn?: StyleProp<ViewStyle>;
  FirstItemOnPress?: () => void;
  SecondaryItemOnPress?: () => void;
  ThreeItemOnPress?: () => void;
  ImgFirstItem?: ReactElement;
  ImgSecondaryItem?: ReactElement;
  ImgThreeItem?: ReactElement;
  toggleClose: boolean;
}

const FloatingActionButton = ({
  styleBtn,
  FirstItemOnPress,
  SecondaryItemOnPress,
  ThreeItemOnPress,
  ImgFirstItem,
  ImgSecondaryItem,
  ImgThreeItem,
  toggleClose,
}: ActionBtnProp): React.ReactElement => {
  const [animation] = useState(new Animated.Value(0));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    open && toggleMenu();
  }, [toggleClose]); //eslint-disable-line react-hooks/exhaustive-deps

  const toggleMenu = () => {
    const toValue = open ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const pinStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -65],
        }),
      },
    ],
  } as unknown as ViewStyle;

  const secondaryStyle = {
    transform: [
      { scale: animation },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -28],
        }),
      },
    ],
  } as unknown as ViewStyle;

  const ThreeStyle = {
    transform: [
      { scale: animation },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -53],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 40],
        }),
      },
    ],
  } as unknown as ViewStyle;

  return (
    <>
      {/* {open && ( */}
      <View style={[styles.component, styleBtn]}>
        {/* {open && (
          <> */}
        {ImgFirstItem && (
          <FirstItemActionBtn onPress={FirstItemOnPress} styleItem={pinStyle}>
            {ImgFirstItem}
          </FirstItemActionBtn>
        )}
        {ImgSecondaryItem && (
          <SecondaryItemActionBtn
            onPress={SecondaryItemOnPress}
            styleItem={secondaryStyle}
          >
            {ImgSecondaryItem}
          </SecondaryItemActionBtn>
        )}
        {ImgThreeItem && (
          <ThreeItemActionBtn onPress={ThreeItemOnPress} styleItem={ThreeStyle}>
            {ImgThreeItem}
          </ThreeItemActionBtn>
        )}
        {/* </>
        )} */}
        <TouchableOpacity
          style={[styles.button, styles.mainBtn]}
          onPress={toggleMenu}
        >
          <Svgs.ActionBtn />
        </TouchableOpacity>
      </View>
      {/* )} */}
      {/* {open && (
      )} */}
      {open && (
        <TouchableOpacity onPress={toggleMenu} style={styles.overlayStyle} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  component: {
    position: "absolute",
    zIndex: 10,
    right: 24,
    bottom: 136,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: "center",
    backgroundColor: colors.white,
    alignItems: "center",
    ...elevations[3],
  },
  mainBtn: {
    backgroundColor: colors.color_EE0033,
  },
  btnItem: {
    backgroundColor: colors.white,
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
    ...elevations[3],
  },
  clickView: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayStyle: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
  },
});

export default FloatingActionButton;
