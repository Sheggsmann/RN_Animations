import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.9;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.2;

const BottomSheet = forwardRef(({}, ref) => {
  const translateY = useSharedValue(0);

  const clampedTranslateY = useDerivedValue(() => {
    return Math.min(
      Math.max(translateY.value, MAX_TRANSLATE_Y),
      MIN_TRANSLATE_Y
    );
  }, []);

  const scrollTo = (destination) => {
    "worklet";
    translateY.value = withTiming(destination);
  };

  useImperativeHandle(ref, () => ({ scrollTo }), [scrollTo]);

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.translationY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = event.translationY + ctx.translationY;
      if (event.velocityY < -2500) {
        scrollTo(MAX_TRANSLATE_Y);
      } else if (event.velocityY > 2500) {
        scrollTo(MIN_TRANSLATE_Y);
      }
    },
    onEnd: () => {
      if (translateY.value < -SCREEN_HEIGHT * 0.7)
        return scrollTo(MAX_TRANSLATE_Y);
    },
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: clampedTranslateY.value }],
    };
  });

  useEffect(() => {
    translateY.value = withTiming(-SCREEN_HEIGHT * 0.3);
  }, []);

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line} />
      </Animated.View>
    </PanGestureHandler>
  );
});

export default function BottomSheetApp() {
  const bottomSheetRef = useRef();

  const onPress = () => {
    bottomSheetRef?.current?.scrollTo(-100);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={onPress}>
        <View style={styles.container}>
          <Text>BottomSheet</Text>
        </View>
      </Pressable>
      <BottomSheet ref={bottomSheetRef} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    alignSelf: "center",
    backgroundColor: "gray",
    marginVertical: 12,
    borderRadius: 2,
  },
});
