import { StyleSheet, View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { useCallback, useRef } from "react";

const { width } = Dimensions.get("window");

const COLORS = [
  "red",
  "purple",
  "blue",
  "cyan",
  "green",
  "yellow",
  "orange",
  "black",
  "white",
];

const BG_COLOR = "rgba(0,0,0,0.9)";

const CIRCLE_PICKER_SIZE = 45;
const INNER_CIRCLE_SIZE = CIRCLE_PICKER_SIZE / 2;
const PICKER_WIDTH = width * 0.8;
const CIRCLE_SIZE = width * 0.7;

function ColorPicker({ colors, start, end, style, onColorChange }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const clampedValue = useDerivedValue(() => {
    return Math.min(
      Math.max(translateX.value, 0),
      PICKER_WIDTH - CIRCLE_PICKER_SIZE
    );
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: clampedValue.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const rInnerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map(
      (_, index) => (index / (colors.length - 1)) * PICKER_WIDTH
    );

    const backgroundColor = interpolateColor(
      translateX.value,
      inputRange,
      colors
    );

    onColorChange?.(backgroundColor);

    return {
      backgroundColor,
    };
  });

  const onEnd = useCallback(() => {
    "worklet";
    translateY.value = withTiming(0);
    scale.value = withSpring(1);
  }, []);

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.translationX = clampedValue.value;
      translateY.value = withTiming(-CIRCLE_PICKER_SIZE);
      scale.value = withSpring(1.2);
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.translationX;
    },
    onEnd,
  });

  const tapGestureEvent = useAnimatedGestureHandler({
    onStart: (event) => {
      translateX.value = withTiming(event.absoluteX);
    },
    onEnd,
  });

  const _panGesture = useRef(null);

  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureEvent} ref={_panGesture}>
          <Animated.View style={{ justifyContent: "center" }}>
            <Animated.View style={[styles.picker, rStyle]}>
              <Animated.View style={[styles.internalPicker, rInnerStyle]} />
            </Animated.View>
            <LinearGradient
              colors={colors}
              start={start}
              end={end}
              style={style}
            />
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
}

export default function AnimatedColorPicker() {
  const pickedColor = useSharedValue(COLORS[0]);

  const onColorChange = useCallback((color) => {
    "worklet";
    pickedColor.value = color;
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return { backgroundColor: pickedColor.value };
  });

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.circle, rStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
          pickedColor={pickedColor}
          onColorChange={onColorChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: BG_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BG_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: { height: 25, width: PICKER_WIDTH, borderRadius: 20 },
  picker: {
    position: "absolute",
    backgroundColor: "#fff",
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  internalPicker: {
    width: INNER_CIRCLE_SIZE,
    height: INNER_CIRCLE_SIZE,
    borderRadius: INNER_CIRCLE_SIZE / 2,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
});
