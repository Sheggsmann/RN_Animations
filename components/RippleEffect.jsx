import { StyleSheet, View, Text } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  runOnJS,
  useAnimatedStyle,
  withTiming,
  useAnimatedRef,
  measure,
} from "react-native-reanimated";

function Ripple({ children, style, onTap }) {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const opacity = useSharedValue(1);

  const aRef = useAnimatedRef();

  const tapGestureEvent = useAnimatedGestureHandler({
    onStart: (event) => {
      const layout = measure(aRef);
      width.value = layout.width;
      height.value = layout.height;

      opacity.value = 1;

      centerX.value = event.x;
      centerY.value = event.y;

      scale.value = 0;
      scale.value = withTiming(1, { duration: 800 });
    },
    onActive: () => {
      if (onTap) runOnJS(onTap)();
    },
    onFinish: () => {
      opacity.value = withTiming(0, { duration: 800 });
    },
  });

  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);

    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      backgroundColor: "rgba(0,0,0,0.1)",
      opacity: opacity.value,
      transform: [{ translateX }, { translateY }, { scale: scale.value }],
    };
  });

  return (
    <View style={style}>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View style={[style, { overflow: "hidden" }]} ref={aRef}>
          <Animated.View
            style={[{ position: "absolute", left: 0, top: 0 }, rStyle]}
          />
          <View>{children}</View>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
}

export default function RippleEffect() {
  return (
    <View style={styles.container}>
      <Ripple style={styles.ripple} onTap={() => console.log("Tapped")}>
        <Text style={{ fontSize: 25 }}>Tap</Text>
      </Ripple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    width: 200,
    height: 200,
    backgroundColor: "white",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 20,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
