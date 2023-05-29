import React, { PureComponent } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ScrollView,
  NativeModules,
  findNodeHandle,
  I18nManager,
  StyleProp,
  TextStyle,
  EasingFunction,
} from "react-native";
import defaultStyles from "src/common/styles";
import { Text } from "./Typography";

const { UIManager } = NativeModules;

export const TextTickAnimationType = Object.freeze({
  auto: "auto",
  scroll: "scroll",
  bounce: "bounce",
});

type Props = {
  style: StyleProp<TextStyle>;
  loop: boolean;
  bounce: boolean;
  scroll: boolean;
  marqueeOnMount: boolean;
  marqueeDelay: number;
  isInteraction: boolean;
  useNativeDriver: boolean;
  repeatSpacer: number;
  easing: EasingFunction;
  animationType: "auto";
  bounceSpeed: number;
  scrollSpeed: number;
  bouncePadding: { left: number; right: number } | null;
  bounceDelay: number;
  shouldAnimateThreshold: number;
  disabled: boolean;
  isRTL: boolean;
  duration?: number;
  onScrollStart?: () => void;
  onMarqueeComplete?: () => void;
};

export default class TextMarquee extends PureComponent<Props> {
  static defaultProps = {
    style: {},
    loop: true,
    bounce: false,
    scroll: true,
    marqueeOnMount: true,
    marqueeDelay: 0,
    isInteraction: true,
    useNativeDriver: true,
    repeatSpacer: 50,
    easing: Easing.linear,
    animationType: "auto",
    bounceSpeed: 50,
    scrollSpeed: 50,
    bouncePadding: undefined,
    bounceDelay: 0,
    shouldAnimateThreshold: 0,
    disabled: false,
    isRTL: undefined,
  };

  animatedValue = new Animated.Value(0);
  distance = 0;
  textRef = null;
  containerRef: ScrollView | null = null;

  state = {
    animating: false,
    contentFits: true,
    shouldBounce: false,
    isScrolling: false,
  };

  calculateMetricsPromise:
    | (Promise<{
        contentFits: boolean;
        shouldBounce: boolean;
      }> & { cancel?: () => void })
    | null;
  textWidth = 0;
  containerWidth = 0;
  hasFinishedFirstLoop = false;
  timer: NodeJS.Timeout | null = null;
  constructor(props) {
    super(props);
    this.calculateMetricsPromise = null;
  }

  componentDidMount() {
    this.invalidateMetrics();
    const { disabled, marqueeOnMount } = this.props;
    if (!disabled && marqueeOnMount) {
      this.startAnimation();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      this.resetScroll();
    } else if (this.props.disabled !== prevProps.disabled) {
      if (!this.props.disabled && this.props.marqueeOnMount) {
        this.startAnimation();
      } else if (this.props.disabled) {
        // Cancel any promises
        if (this.calculateMetricsPromise !== null) {
          this.calculateMetricsPromise.cancel &&
            this.calculateMetricsPromise.cancel();
          this.calculateMetricsPromise = null;
        }
        this.stopAnimation();
        this.clearTimeout();
      }
    }
  }

  componentWillUnmount() {
    // Cancel promise to stop setState after unmount
    if (this.calculateMetricsPromise !== null) {
      this.calculateMetricsPromise.cancel &&
        this.calculateMetricsPromise.cancel();
      this.calculateMetricsPromise = null;
    }
    this.stopAnimation();
    // always stop timers when unmounting, common source of crash
    this.clearTimeout();
  }

  makeCancelable = (
    promise: Promise<{
      contentFits: boolean;
      shouldBounce: boolean;
    }>
  ) => {
    let cancel: () => void = () => null;
    const wrappedPromise: Promise<{
      contentFits: boolean;
      shouldBounce: boolean;
    }> & { cancel?: () => void } = new Promise((resolve, reject) => {
      cancel = () => {
        resolve = () => null;
        reject = () => null;
      };
      promise.then(
        (value) => {
          if (resolve) {
            resolve(value);
          }
        },
        (error) => {
          if (reject) {
            reject(error);
          }
        }
      );
    });
    wrappedPromise.cancel = cancel;
    return wrappedPromise;
  };

  startAnimation = () => {
    if (this.state.animating) {
      return;
    }
    this.start();
  };

  animateScroll = () => {
    const {
      duration,
      marqueeDelay,
      loop,
      isInteraction,
      useNativeDriver,
      repeatSpacer,
      easing,
      scrollSpeed,
      onMarqueeComplete,
      isRTL,
    } = this.props;
    this.setTimeout(() => {
      const scrollToValue =
        isRTL ?? I18nManager.isRTL
          ? this.textWidth + repeatSpacer
          : -this.textWidth - repeatSpacer;
      if (!isNaN(scrollToValue)) {
        Animated.timing(this.animatedValue, {
          toValue: scrollToValue,
          duration: duration || this.textWidth * scrollSpeed,
          easing: easing,
          isInteraction: isInteraction,
          useNativeDriver: useNativeDriver,
        }).start(({ finished }) => {
          if (finished) {
            if (onMarqueeComplete) {
              onMarqueeComplete();
            }
            if (loop) {
              this.animatedValue.setValue(0);
              this.animateScroll();
            }
          }
        });
      } else {
        this.start();
      }
    }, marqueeDelay);
  };

  animateBounce = () => {
    const {
      duration,
      marqueeDelay,
      loop,
      isInteraction,
      useNativeDriver,
      easing,
      bounceSpeed,
      bouncePadding,
      bounceDelay,
      isRTL,
    } = this.props;
    const rtl = isRTL ?? I18nManager.isRTL;
    const bounceEndPadding = rtl ? bouncePadding?.left : bouncePadding?.right;
    const bounceStartPadding = rtl ? bouncePadding?.right : bouncePadding?.left;
    this.setTimeout(
      () => {
        Animated.sequence([
          Animated.timing(this.animatedValue, {
            toValue: rtl
              ? this.distance + (bounceEndPadding ?? 10)
              : -this.distance - (bounceEndPadding ?? 10),
            duration: duration || this.distance * bounceSpeed,
            easing: easing,
            isInteraction: isInteraction,
            useNativeDriver: useNativeDriver,
          }),
          Animated.timing(this.animatedValue, {
            toValue: rtl
              ? -(bounceStartPadding ?? 10)
              : bounceStartPadding ?? 10,
            duration: duration || this.distance * bounceSpeed,
            easing: easing,
            isInteraction: isInteraction,
            useNativeDriver: useNativeDriver,
            delay: bounceDelay,
          }),
        ]).start(({ finished }) => {
          if (finished) {
            this.hasFinishedFirstLoop = true;
          }
          if (loop) {
            this.animateBounce();
          }
        });
      },
      this.hasFinishedFirstLoop
        ? bounceDelay > 0
          ? bounceDelay
          : 0
        : marqueeDelay
    );
  };

  start = async () => {
    this.setState({ animating: true });
    this.setTimeout(async () => {
      await this.calculateMetrics();
      if (!this.state.contentFits) {
        const { onScrollStart } = this.props;
        if (onScrollStart && typeof onScrollStart === "function") {
          onScrollStart();
        }
        if (this.props.animationType === "auto") {
          if (this.state.shouldBounce && this.props.bounce) {
            this.animateBounce();
          } else {
            this.animateScroll();
          }
        } else if (this.props.animationType === "bounce") {
          this.animateBounce();
        } else if (this.props.animationType === "scroll") {
          this.animateScroll();
        }
      }
    }, 100);
  };

  stopAnimation() {
    this.animatedValue.setValue(0);
    this.setState({ animating: false, shouldBounce: false });
  }

  async calculateMetrics() {
    const { shouldAnimateThreshold } = this.props;
    this.calculateMetricsPromise = this.makeCancelable(
      new Promise((resolve) => {
        const measureWidth = (node): Promise<number> =>
          new Promise((resolve, reject) => {
            // node handle is not always there, causes crash. modified to check..
            const nodeHandle = findNodeHandle(node);
            if (nodeHandle) {
              UIManager.measure(nodeHandle, (x, y, w) => {
                // console.log('Width: ' + w)
                return resolve(w);
              });
            } else {
              return reject("nodehandle_not_found");
            }
          });
        Promise.all([
          measureWidth(this.containerRef),
          measureWidth(this.textRef),
        ])
          .then(([containerWidth, textWidth]) => {
            this.containerWidth = containerWidth;
            this.textWidth = textWidth;
            this.distance = textWidth - containerWidth + shouldAnimateThreshold;
            resolve({
              // Is 1 instead of 0 to get round rounding errors from:
              // https://github.com/facebook/react-native/commit/a534672
              contentFits: this.distance <= 1,
              shouldBounce: this.distance < this.containerWidth / 8,
            });
          })
          .catch((error) => {
            console.warn(
              "react-native-text-ticker: could not calculate metrics",
              error
            );
          });

        // console.log(`distance: ${this.distance}, contentFits: ${this.state.contentFits}`)
      })
    );
    await this.calculateMetricsPromise.then((result) => {
      this.setState({
        contentFits: result.contentFits,
        shouldBounce: result.shouldBounce,
      });
      return [];
    });
  }

  invalidateMetrics = () => {
    this.distance = 0;
    this.setState({ contentFits: true });
  };

  clearTimeout() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setTimeout(fn: () => void, time = 0) {
    this.clearTimeout();
    this.timer = setTimeout(fn, time);
  }

  scrollBegin = () => {
    this.setState({ isScrolling: true });
    this.animatedValue.setValue(0);
  };

  scrollEnd = () => {
    const { marqueeDelay } = this.props;

    this.setTimeout(
      () => {
        this.setState({ isScrolling: false });
        this.start();
      },
      marqueeDelay >= 0 ? marqueeDelay : 3000
    );
  };

  resetScroll = () => {
    this.scrollBegin();
    this.scrollEnd();
  };

  render() {
    const {
      style,
      repeatSpacer,
      scroll,
      shouldAnimateThreshold,
      disabled,
      isRTL,
      ...props
    } = this.props;
    const { animating, contentFits, isScrolling } = this.state;
    const additionalContainerStyle = {
      // This is useful for shouldAnimateThreshold only:
      // we use flex: 1 to make the container take all the width available
      // without this, if the children have a width smaller that this component's parent's,
      // the container would have the width of the children (the text)
      // In this case, it would be impossible to determine if animating is necessary based on the width of the container
      // (contentFits in calculateMetrics() would always be true)
      flex: shouldAnimateThreshold ? 1 : undefined,
    };
    const animatedText = disabled ? null : (
      <ScrollView
        ref={(c) => (this.containerRef = c)}
        horizontal
        scrollEnabled={scroll ? !this.state.contentFits : false}
        scrollEventThrottle={16}
        onScrollBeginDrag={this.scrollBegin}
        onScrollEndDrag={this.scrollEnd}
        showsHorizontalScrollIndicator={false}
        style={[
          StyleSheet.absoluteFillObject,
          (isRTL ?? I18nManager.isRTL) && defaultStyles.rowReverse,
        ]}
        onContentSizeChange={() => this.calculateMetrics()}
      >
        <Animated.Text
          ref={(c) => (this.textRef = c)}
          numberOfLines={1}
          {...props}
          style={[
            style,
            { transform: [{ translateX: this.animatedValue }] },
            styles.width_0,
          ]}
        >
          {this.props.children}
        </Animated.Text>
        {!contentFits && !isScrolling ? (
          <View style={{ paddingLeft: repeatSpacer }}>
            <Animated.Text
              numberOfLines={1}
              {...props}
              style={[
                style,
                {
                  transform: [{ translateX: this.animatedValue }],
                },
                styles.width_0,
              ]}
            >
              {this.props.children}
            </Animated.Text>
          </View>
        ) : null}
      </ScrollView>
    );
    return (
      <View style={[styles.container, additionalContainerStyle]}>
        <Text
          {...props}
          numberOfLines={1}
          style={[
            style,
            !disabled && animating ? styles.opacity_0 : styles.opacity_1,
          ]}
        >
          {this.props.children}
        </Text>
        {animatedText}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  width_0: {
    width: undefined,
  },
  opacity_0: {
    opacity: 0,
  },
  opacity_1: {
    opacity: 1,
  },
});
