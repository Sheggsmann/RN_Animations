import { StyleSheet, View, Text, Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const SIZE = width * 0.7;

export default function Page({ word, index, translateX }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const rTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(translateX.value, inputRange, [
      height / 2,
      0,
      -height / 2,
    ]);

    const opacity = interpolate(translateX.value, inputRange, [-2, 1, -2]);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const borderRadius = interpolate(translateX.value, inputRange, [
      0,
      SIZE / 2,
      0,
    ]);

    return {
      borderRadius,
      transform: [{ scale }],
    };
  });

  return (
    <View
      style={[
        styles.pageContainer,
        { backgroundColor: `rgba(0,0,256,0.${index + 1 * 2})` },
      ]}
    >
      <Animated.View style={[styles.square, rStyle]}></Animated.View>
      <Animated.View style={[{ position: "absolute" }, rTextStyle]}>
        <Text style={styles.text}>{word}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "royalblue",
  },
  text: {
    fontSize: 70,
    color: "white",
    textTransform: "uppercase",
    fontWeight: "700",
  },
});
