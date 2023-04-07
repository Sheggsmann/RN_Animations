import { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: PAGE_WIDTH } = Dimensions.get("window");

const titles = ["what's", "up", "mobile", "devs"];

function Page({ title, index, translateX }) {
  const pageOffset = PAGE_WIDTH * index;

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value + pageOffset }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: `rgba(0,0,256,0.${index + 2})`,
          alignItems: "center",
          justifyContent: "center",
        },
        rStyle,
      ]}
    >
      <Text
        style={{
          fontSize: 70,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 1.5,
        }}
      >
        {title}
      </Text>
    </Animated.View>
  );
}

const MAX_TRANSLATE_X = -PAGE_WIDTH * (titles.length - 1);

export default function CustomScrollView() {
  const translateX = useSharedValue(0);

  const clampedTranslateX = useDerivedValue(() => {
    return Math.max(Math.min(translateX.value, 0), MAX_TRANSLATE_X);
  });

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.translationX = clampedTranslateX.value;
      cancelAnimation(translateX);
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.translationX;
    },
    onEnd: (event) => {
      translateX.value = withDecay({ velocity: event.velocityX });
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={{ flex: 1, flexDirection: "row" }}>
          {titles.map((title, index) => (
            <Page
              title={title}
              index={index}
              translateX={clampedTranslateX}
              key={index.toString()}
            />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
