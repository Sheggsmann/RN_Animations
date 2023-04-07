import { StyleSheet, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useState, useCallback } from "react";

const ICON_SIZE = 20;
const BUTTON_WIDTH = 170;

const clamp = (value, min, max) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

function SlidingCounter() {
  const [count, setCount] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const MAX_SLIDE_OFFSET = BUTTON_WIDTH * 0.3;

  const changeCount = useCallback((direction) => {
    if (direction === "right") setCount((prev) => prev + 1);
    if (direction === "left") setCount((prev) => prev - 1);
  }, []);

  const resetCount = useCallback(() => {
    setCount(0);
  }, []);

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = clamp(
        event.translationX,
        -MAX_SLIDE_OFFSET,
        MAX_SLIDE_OFFSET
      );

      translateY.value = clamp(event.translationY, 0, MAX_SLIDE_OFFSET);
    },
    onEnd: () => {
      if (translateX.value === MAX_SLIDE_OFFSET) {
        // Increment
        runOnJS(changeCount)("right");
      } else if (translateX.value === -MAX_SLIDE_OFFSET) {
        // Decrement
        runOnJS(changeCount)("left");
      } else if (translateY.value === MAX_SLIDE_OFFSET) {
        // Reset
        runOnJS(resetCount)();
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const rPlusMinusIconStyle = useAnimatedStyle(() => {
    const opacityX = interpolate(
      translateX.value,
      [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
      [0.4, 0.8, 0.4]
    );

    const opacityY = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET],
      [1, 0]
    );

    return { opacity: opacityX * opacityY };
  }, []);

  const rCloseIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET],
      [0, 0.8]
    );

    return { opacity };
  });

  const rButtonstyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value * 0.1 }],
    };
  });

  return (
    <Animated.View style={[styles.button, rButtonstyle]}>
      <Animated.View style={[rPlusMinusIconStyle]}>
        <AntDesign name="minus" color="white" size={ICON_SIZE} />
      </Animated.View>
      <Animated.View style={[rCloseIconStyle]}>
        <AntDesign name="close" color="white" size={ICON_SIZE} />
      </Animated.View>
      <Animated.View style={[rPlusMinusIconStyle]}>
        <AntDesign name="plus" color="white" size={ICON_SIZE} />
      </Animated.View>

      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.circle, rStyle]}>
            <Text style={styles.text}>{count}</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Animated.View>
  );
}

export default function AnimatedCounter() {
  return (
    <View style={styles.container}>
      <SlidingCounter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 70,
    width: BUTTON_WIDTH,
    backgroundColor: "#111",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  circle: {
    height: 50,
    width: 50,
    backgroundColor: "#333",
    borderRadius: 25,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    color: "#fff",
  },
});
