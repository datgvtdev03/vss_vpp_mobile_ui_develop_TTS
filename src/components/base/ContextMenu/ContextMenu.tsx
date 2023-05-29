import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useRef } from "react";

import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  TranslateXTransform,
  TranslateYTransform,
  View,
  ViewStyle,
} from "react-native";
import { elevations } from "src/common/styles/elevation";
import colors from "src/constants/colors";
import dimens from "src/constants/dimens";

enum STATES {
  HIDDEN = "HIDDEN",
  ANIMATING = "ANIMATING",
  SHOWN = "SHOWN",
}

const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

interface Props {
  animationDuration?: number;
  onHidden?: () => void;
  children?: React.ReactElement;
  List?: React.ReactElement;
  style?: ViewStyle;
  menuStyle?: ViewStyle;
  testID?: string;
  right?: boolean;
  overlap?: boolean;
}

export type ContextMenuRef = {
  show: () => void;
  hide: () => void;
};

const ContextMenu = React.forwardRef<ContextMenuRef, Props>(
  (
    {
      animationDuration = 300,
      onHidden,
      children,
      List,
      menuStyle,
      style,
      testID,
      right,
      overlap,
    }: Props,
    ref
  ) => {
    const _container = useRef<View>(null);

    const [menuState, setMenuState] = useState<STATES>(STATES.HIDDEN);

    const [top, setTop] = useState<number>(0);
    const [left, setLeft] = useState<number>(0);

    const [menuWidth, setMenuWidth] = useState<number>(0);
    const [menuHeight, setMenuHeight] = useState<number>(0);

    const [buttonWidth, setButtonWidth] = useState<number>(0);
    const [buttonHeight, setButtonHeight] = useState<number>(0);

    const menuSizeAnimation = useRef(new Animated.ValueXY({ x: 0, y: 0 }));
    const opacityAnimation = useRef(new Animated.Value(0));

    const _onMenuLayout = (e: LayoutChangeEvent) => {
      if (menuState === STATES.ANIMATING) {
        return;
      }

      const { width, height } = e.nativeEvent.layout;
      if (width === 0 && height === 0) {
        return;
      }

      setMenuState(STATES.ANIMATING);
      if (modalVisible) {
        setMenuWidth(width);
        setMenuHeight(height);
      }
    };
    useEffect(() => {
      if (menuState === STATES.ANIMATING) {
        Animated.parallel([
          Animated.timing(menuSizeAnimation.current, {
            toValue: { x: menuWidth, y: menuHeight },
            duration: animationDuration,
            easing: EASING,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnimation.current, {
            toValue: 1,
            duration: animationDuration,
            easing: EASING,
            useNativeDriver: false,
          }),
        ]).start();
      } else if (menuState === STATES.HIDDEN) {
        if (onHidden) {
          onHidden();
        }
      }
    }, [menuState, menuWidth, menuHeight, animationDuration, onHidden]);

    useImperativeHandle(ref, () => ({
      show,
      hide,
    }));
    const show = useCallback(() => {
      _container.current &&
        _container.current.measureInWindow(
          (_left, _top, _buttonWidth, _buttonHeight) => {
            setButtonHeight(_buttonHeight);
            setButtonWidth(_buttonWidth);
            setLeft(_left);
            setTop(_top + (overlap ? 0 : _buttonHeight + 2));
            setMenuState(STATES.SHOWN);
          }
        );
    }, [overlap]);

    const hide = useCallback(() => {
      Animated.timing(opacityAnimation.current, {
        toValue: 0,
        duration: animationDuration,
        easing: EASING,
        useNativeDriver: false,
      }).start(() => {
        // Reset state
        setMenuState(STATES.HIDDEN);
        menuSizeAnimation.current.setValue({ x: 0, y: 0 });
        opacityAnimation.current.setValue(0);
      });
    }, [animationDuration]);
    const menuSize = {
      width: menuSizeAnimation.current.x,
      height: menuSizeAnimation.current.y,
    };
    const shadowMenuContainerStyle = useMemo<ViewStyle>((): ViewStyle => {
      const windowHeight = dimens.deviceHeight - (dimens.statusBarHeight || 0);

      // Adjust position of menu
      const transforms: (TranslateXTransform | TranslateYTransform)[] = [];
      let _left: number = left;
      if (left + menuWidth > dimens.deviceWidth - SCREEN_INDENT || right) {
        const transformStyle: TranslateXTransform = {
          translateX: Animated.multiply(
            menuSizeAnimation.current.x,
            -1
          ) as unknown as number,
        };
        transforms.push(transformStyle);

        _left = Math.min(
          dimens.deviceWidth - SCREEN_INDENT,
          left + buttonWidth
        );
      } else if (left < SCREEN_INDENT) {
        _left = SCREEN_INDENT;
      }

      // Flip by Y axis if menu hits bottom screen border
      let _top: number = top;
      if (top > windowHeight - menuHeight - SCREEN_INDENT) {
        const transformStyle: TranslateYTransform = {
          translateY: Animated.multiply(
            menuSizeAnimation.current.y,
            -1
          ) as unknown as number,
        };
        transforms.push(transformStyle);

        _top = windowHeight - SCREEN_INDENT;
        _top = Math.min(windowHeight - SCREEN_INDENT, top + buttonHeight);
      } else if (top < SCREEN_INDENT) {
        _top = SCREEN_INDENT;
      }

      return {
        opacity: opacityAnimation.current as unknown as number,
        transform: transforms,
        top: _top,
        left: _left,
      };
    }, [buttonHeight, buttonWidth, left, menuHeight, menuWidth, right, top]);

    const animationStarted = useMemo(
      () => menuState === STATES.ANIMATING,
      [menuState]
    );
    const modalVisible = useMemo(() => {
      return menuState === STATES.SHOWN || animationStarted;
    }, [animationStarted, menuState]);

    return (
      <View ref={_container} collapsable={false} style={style} testID={testID}>
        {children && React.cloneElement(children, { onPress: show })}

        <Modal
          visible={modalVisible}
          onRequestClose={hide}
          supportedOrientations={[
            "portrait",
            "portrait-upside-down",
            "landscape",
            "landscape-left",
            "landscape-right",
          ]}
          transparent
        >
          <TouchableWithoutFeedback onPress={hide} accessible={false}>
            <View style={[StyleSheet.absoluteFill]}>
              <Animated.View
                onLayout={_onMenuLayout}
                style={[
                  styles.shadowMenuContainer,
                  shadowMenuContainerStyle,
                  elevations[8],
                  menuStyle,
                ]}
              >
                <Animated.View
                  style={[styles.menuContainer, animationStarted && menuSize]}
                >
                  {Boolean(List) && List}
                </Animated.View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  shadowMenuContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 16,
    opacity: 0,
  },
  menuContainer: {
    overflow: "hidden",
  },
  background: {
    backgroundColor: "rgba(227, 227, 228, 0.24)",
  },
  border: {
    borderWidth: 1,
    borderColor: colors.color_D6D6D7,
    borderRadius: 16,
  },
});

export default ContextMenu;
