import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import Animated from "react-native-reanimated";
import { useCallback } from "react";
import { ReText } from "react-native-redash";

const { width, height } = Dimensions.get("window");

const BACKGROUND_COLOR = "#444b6f";
const BACKGROUND_STROKE_COLOR = "#303458";
const STROKE_COLOR = "#A6E1FA";

const CIRCLE_LENGTH = 1000;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedTimer() {
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    return { strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value) };
  });

  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}`;
  });

  const onPress = useCallback(() => {
    progress.value = withTiming(progress.value > 0 ? 0 : 1, {
      duration: 2000,
    });
  }, []);

  return (
    <View style={styles.container}>
      <ReText style={styles.progressText} text={progressText} />
      <Svg style={{ position: "absolute" }}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={30}
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={STROKE_COLOR}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
        <Text style={styles.buttonText}>Run</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 80,
    color: "rgba(256,256,256,0.7)",
    width: 200,
    textAlign: "center",
  },
  buttonStyle: {
    position: "absolute",
    top: 700,
    left: (width - width * 0.7) / 2,
    height: 60,
    width: width * 0.7,
    backgroundColor: BACKGROUND_STROKE_COLOR,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  buttonText: {
    fontSize: 25,
    color: "white",
    letterSpacing: 2.0,
  },
});
