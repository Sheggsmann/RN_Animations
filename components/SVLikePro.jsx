import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Page from "./Page";

const WORDS = ["what's", "up", "mobile", "devs?"];

const { width } = Dimensions.get("window");

export default function SVLikePro() {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    (event) => (translateX.value = event.contentOffset.x)
  );

  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      horizontal={true}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={true}
    >
      {WORDS.map((word, index) => (
        <Page
          word={word}
          index={index}
          translateX={translateX}
          key={index.toString()}
        />
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({});
