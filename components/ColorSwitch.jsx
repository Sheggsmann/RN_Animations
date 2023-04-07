import { useState } from "react";
import { StyleSheet, View, Text, Switch, Dimensions } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const COLORS = {
  dark: {
    background: "#1E1E1E",
    circle: "#252525",
    text: "#F8F8F8",
  },
  light: {
    background: "#F8F8F8",
    circle: "#FFF",
    text: "#1E1E1E",
  },
};

const SWITCH_TRACK_COLOR = {
  true: "rgba(256, 0, 256, 0.2)",
  false: "rgba(0,0,0,1)",
};

export default function ColorSwitch() {
  const [theme, setTheme] = useState("light");

  // const progress = useSharedValue(0);

  const progress = useDerivedValue(
    () => (theme === "dark" ? withTiming(1) : withTiming(0)),
    [theme]
  );

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.background, COLORS.dark.background]
    );

    return {
      backgroundColor,
    };
  });

  const rCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.background, COLORS.dark.background]
    );

    return {
      backgroundColor,
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.light.text, COLORS.dark.text]
    );

    return {
      color,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
        rStyle,
      ]}
    >
      <Animated.Text style={[styles.text, rTextStyle]}>THEME</Animated.Text>
      <Animated.View style={[styles.circle, rCircleStyle]}>
        <Switch
          value={theme === "dark"}
          onValueChange={(toggled) => setTheme(toggled ? "dark" : "light")}
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor="violet"
        />
      </Animated.View>
    </Animated.View>
  );
}

const SIZE = Dimensions.get("window").width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZE / 2,
    backgroundColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 0,
  },
  text: {
    fontSize: 70,
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 14,
    marginBottom: 35,
  },
});
