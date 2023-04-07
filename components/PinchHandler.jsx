import { View, Text, Dimensions } from "react-native";
import {
  PinchGestureHandler,
  LongPressGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const IMAGE_URL =
  "https://images.unsplash.com/photo-1621569642780-4864752e847e";

export default function PinchHandler() {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      if (event.scale > 1) {
        scale.value = event.scale;
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      }
    },
    onEnd: (event) => {
      scale.value = withTiming(1);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },
        { scale: scale.value },
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -width / 2 },
        { translateY: -height / 2 },
      ],
    };
  });

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.Image
        source={{ uri: IMAGE_URL }}
        style={[rStyle, { flex: 1, width, height }]}
      />
    </PinchGestureHandler>
  );
}
