import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
} from "react-native-reanimated";

const SIZE = 100;

const handleRotate = (progress) => {
  "worklet";
  return `${progress.value * 2 * Math.PI}rad`;
};

export default function Intro() {
  const progress = useSharedValue(1);
  const scale = useSharedValue(2);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      borderRadius: (progress.value * SIZE) / 2,
      transform: [{ scale: scale.value }, { rotate: handleRotate(progress) }],
    };
  }, []);

  useEffect(() => {
    progress.value = withRepeat(withSpring(0.5), 3, true);
    scale.value = withRepeat(withSpring(1), 3, true);
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: SIZE,
          height: SIZE,
          backgroundColor: "blue",
        },
        reanimatedStyle,
      ]}
    />
  );
}
