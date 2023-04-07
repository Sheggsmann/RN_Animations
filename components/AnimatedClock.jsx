import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

const SQUARE_SIZE = 12;
const N = 12;

function Square({ index, progress }) {
  const offsetAngle = (2 * Math.PI) / N;
  const finalAngle = (N - 1 - index) * offsetAngle;

  const rotate = useDerivedValue(() => {
    if (progress.value <= 2 * Math.PI) {
      return Math.min(finalAngle, progress.value);
    }

    if (progress.value - 2 * Math.PI < finalAngle) {
      return finalAngle;
    }

    return progress.value;
  }, []);

  const translateY = useDerivedValue(() => {
    // When the animation is complete, stretch the boxes to their radius
    if (finalAngle === rotate.value) return withTiming(-N * SQUARE_SIZE);
    if (progress.value > 2 * Math.PI) return (index - N) * SQUARE_SIZE;

    return withTiming(-index * SQUARE_SIZE);
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotate.value}rad` },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: SQUARE_SIZE,
          aspectRatio: 1,
          backgroundColor: "#fff",
          opacity: (index + 1) / N,
          position: "absolute",
        },
        rStyle,
      ]}
    ></Animated.View>
  );
}

export default function AnimatedClock() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(4 * Math.PI, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  return (
    <View style={styles.container}>
      {new Array(N).fill(0).map((_, index) => {
        return (
          <Square index={index} progress={progress} key={index.toString()} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});
