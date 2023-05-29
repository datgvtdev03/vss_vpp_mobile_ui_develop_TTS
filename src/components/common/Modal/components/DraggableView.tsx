import React, { Component } from "react";
import {
  Animated,
  PanResponder,
  Dimensions,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  LayoutRectangle,
  PanResponderGestureState,
} from "react-native";
import type { SwipeDirection, DragEvent } from "../type";

type Props = {
  style?: StyleProp<ViewStyle>;
  onMove?: (event: DragEvent) => void;
  onSwiping?: (event: DragEvent) => void;
  onRelease?: (event: DragEvent) => void;
  onSwipingOut?: (event: DragEvent) => void;
  onSwipeOut?: (event: DragEvent) => void;
  swipeThreshold?: number;
  swipeDirection?: SwipeDirection | SwipeDirection[];
  children: ({
    onLayout,
    pan,
  }: {
    onLayout: (event: LayoutChangeEvent) => void;
    pan: Animated.ValueXY;
  }) => React.ReactNode;
};

export default class DraggableView extends Component<Props> {
  static defaultProps = {
    style: null,
    onMove: () => null,
    onSwiping: () => null,
    onSwipingOut: () => null,
    onSwipeOut: null,
    onRelease: () => null,
    swipeThreshold: 100,
    swipeDirection: [],
  };

  pan: Animated.ValueXY;
  allowedDirections: SwipeDirection[];
  layout: LayoutRectangle;
  panEventListenerId = "";
  currentSwipeDirection: "up" | "down" | "left" | "right" | null = null;
  constructor(props: Props) {
    super(props);

    this.pan = new Animated.ValueXY();
    this.allowedDirections = ([] as SwipeDirection[]).concat(
      props.swipeDirection || []
    );
    this.layout = { x: 0, y: 0, height: 0, width: 0 };
  }

  componentDidMount() {
    this.panEventListenerId = this.pan.addListener((axis) => {
      this.props.onMove && this.props.onMove(this.createDragEvent(axis));
    });
  }

  componentWillUnmount() {
    this.pan.removeListener(this.panEventListenerId);
  }

  onLayout = (event: LayoutChangeEvent) => {
    this.layout = event.nativeEvent.layout;
  };

  getSwipeDirection(gestureState: PanResponderGestureState) {
    if (this.isValidHorizontalSwipe(gestureState)) {
      return gestureState.dx > 0 ? "right" : "left";
    } else if (this.isValidVerticalSwipe(gestureState)) {
      return gestureState.dy > 0 ? "down" : "up";
    }
    return null;
  }

  getDisappearDirection() {
    const { width, height } = Dimensions.get("window");
    const layout = this.layout;
    const vertical = height / 2 + layout.height / 2;
    const horizontal = width / 2 + layout.width / 2;
    let toValue;
    if (this.currentSwipeDirection === "up") {
      toValue = {
        x: 0,
        y: -vertical,
      };
    } else if (this.currentSwipeDirection === "down") {
      toValue = {
        x: 0,
        y: vertical,
      };
    } else if (this.currentSwipeDirection === "left") {
      toValue = {
        x: -horizontal,
        y: 0,
      };
    } else if (this.currentSwipeDirection === "right") {
      toValue = {
        x: horizontal,
        y: 0,
      };
    }
    return toValue;
  }

  isValidHorizontalSwipe({ vx, dy }) {
    return this.isValidSwipe(vx, dy);
  }

  isValidVerticalSwipe({ vy, dx }) {
    return this.isValidSwipe(vy, dx);
  }

  isValidSwipe(velocity, directionalOffset) {
    const velocityThreshold = 0.3;
    const directionalOffsetThreshold = 80;
    return (
      Math.abs(velocity) > velocityThreshold &&
      Math.abs(directionalOffset) < directionalOffsetThreshold
    );
  }

  isAllowedDirection({ dy, dx }) {
    const draggedDown = dy > 0;
    const draggedUp = dy < 0;
    const draggedLeft = dx < 0;
    const draggedRight = dx > 0;
    const isAllowedDirection = (d) =>
      this.currentSwipeDirection === d && this.allowedDirections.includes(d);
    if (draggedDown && isAllowedDirection("down")) {
      return true;
    } else if (draggedUp && isAllowedDirection("up")) {
      return true;
    } else if (draggedLeft && isAllowedDirection("left")) {
      return true;
    } else if (draggedRight && isAllowedDirection("right")) {
      return true;
    }
    return false;
  }

  createDragEvent(axis): DragEvent {
    return {
      axis,
      layout: this.layout,
      swipeDirection: this.currentSwipeDirection,
    };
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      gestureState.dx !== 0 && gestureState.dy !== 0,
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const isVerticalSwipe = (d) => ["up", "down"].includes(d);
      const isHorizontalSwipe = (d) => ["left", "right"].includes(d);

      const newSwipeDirection = this.getSwipeDirection(gestureState);
      const isSameDirection =
        isVerticalSwipe(this.currentSwipeDirection) ===
          isVerticalSwipe(newSwipeDirection) ||
        isHorizontalSwipe(this.currentSwipeDirection) ===
          isHorizontalSwipe(newSwipeDirection);
      // newDirection & currentSwipeDirection must be same direction
      if (newSwipeDirection && isSameDirection) {
        this.currentSwipeDirection = newSwipeDirection;
      }
      if (this.isAllowedDirection(gestureState)) {
        let animEvent;
        if (isVerticalSwipe(this.currentSwipeDirection)) {
          animEvent = { dy: this.pan.y };
        } else if (isHorizontalSwipe(this.currentSwipeDirection)) {
          animEvent = { dx: this.pan.x };
        }
        Animated.event([null, animEvent], { useNativeDriver: false })(
          event,
          gestureState
        );
        this.props.onSwiping &&
          this.props.onSwiping(
            this.createDragEvent({
              x: (this.pan.x as any)._value, // eslint-disable-line @typescript-eslint/no-explicit-any
              y: (this.pan.y as any)._value, // eslint-disable-line @typescript-eslint/no-explicit-any
            })
          );
      }
    },
    onPanResponderRelease: () => {
      this.pan.flattenOffset();
      const event = this.createDragEvent({
        x: (this.pan.x as any)._value, // eslint-disable-line @typescript-eslint/no-explicit-any
        y: (this.pan.y as any)._value, // eslint-disable-line @typescript-eslint/no-explicit-any
      });
      // on swipe out
      if (
        (this.props.onSwipeOut &&
          Math.abs((this.pan.y as any)._value) > // eslint-disable-line @typescript-eslint/no-explicit-any
            (this.props.swipeThreshold || 100)) ||
        Math.abs((this.pan.y as any)._value) > // eslint-disable-line @typescript-eslint/no-explicit-any
          (this.props.swipeThreshold || 100)
      ) {
        this.props.onSwipingOut && this.props.onSwipingOut(event);
        Animated.spring(this.pan, {
          toValue: this.getDisappearDirection(),
          velocity: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: false,
        }).start(() => {
          this.props.onSwipeOut && this.props.onSwipeOut(event);
        });
        return;
      }
      // on release
      this.currentSwipeDirection = null;
      this.props.onRelease && this.props.onRelease(event);
      Animated.spring(this.pan, {
        toValue: { x: 0, y: 0 },
        velocity: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: false,
      }).start();
    },
  });

  render() {
    const { style, children: renderContent } = this.props;
    const content = renderContent({
      pan: this.pan,
      onLayout: this.onLayout,
    });

    return (
      <Animated.View {...this.panResponder.panHandlers} style={style}>
        {content}
      </Animated.View>
    );
  }
}
