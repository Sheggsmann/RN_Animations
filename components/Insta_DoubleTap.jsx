import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import { useCallback, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const bg_image = require("../assets/bg-image.jpeg");
const heart_image = require("../assets/heart.png");

const { width: SIZE } = Dimensions.get("window");

export default function Insta_DoubleTap() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const _doubleTap = useRef();

  const rStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const rTextStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const onDoubleTap = useCallback(() => {
    scale.value = withSequence(
      withSpring(1, { stiffness: 140 }),
      withDelay(500, withSpring(0, { overshootClamping: true, mass: 0.1 }))
    );
  }, []);

  const onSingleTap = useCallback(() => {
    opacity.value = withSequence(withTiming(0), withDelay(500, withTiming(1)));
  }, []);

  return (
    <TapGestureHandler waitFor={_doubleTap} onActivated={onSingleTap}>
      <TapGestureHandler
        maxDelayMs={250}
        ref={_doubleTap}
        numberOfTaps={2}
        onActivated={onDoubleTap}
      >
        <Animated.View>
          <ImageBackground source={bg_image} style={styles.image}>
            <Animated.Image
              source={heart_image}
              style={[
                styles.image,
                {
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.35,
                  shadowRadius: 35,
                },
                rStyle,
              ]}
              resizeMode="center"
            />
          </ImageBackground>
          <Animated.Text style={[styles.love, rTextStyle]}>❤❤❤</Animated.Text>
        </Animated.View>
      </TapGestureHandler>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  image: {
    width: SIZE,
    height: SIZE,
  },
  love: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 35,
  },
});
