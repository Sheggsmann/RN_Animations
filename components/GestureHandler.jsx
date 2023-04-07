import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { PanGestureHandler } from "react-native-gesture-handler";
import { useEffect } from "react";

const SIZE = 100;
const CIRCLE_RADIUS = SIZE * 1.5;

export default function GestureHandler() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesutureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

      if (distance < CIRCLE_RADIUS) {
        translateY.value = event.translationY + context.translateY;
        translateX.value = event.translationX + context.translateX;
      }
    },
    onEnd: () => {
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

  return (
    <PanGestureHandler onGestureEvent={panGesutureEvent}>
      <Animated.View style={styles.circle}>
        <Animated.View style={[styles.square, rStyle]} />
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(0, 0, 256, 0.5)",
    borderRadius: SIZE / 2,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "rgba(0, 0, 256, 0.5)",
  },
});
