import { useCallback, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native";
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const LIST_ITEM_HEIGHT = 70;

const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

const TITLES = [
  "Record the dismissable tutorial video 📺",
  "Leave 👍 for the video",
  "Check Youtube comments",
  "Subscribe to the channel rocket 🚀",
  "Leave a ⭐ on the github repo",
];

const TASKS = TITLES.map((title, index) => ({ title, index }));

function ListItem({ task, onDismiss, simultaneousHandlers }) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      const shouldBeDismissed = event.translationX < TRANSLATE_X_THRESHOLD;

      if (shouldBeDismissed) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && onDismiss) runOnJS(onDismiss)(task);
        });
      } else {
        translateX.value = withTiming(0, { duration: 1000 });
      }
    },
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      translateX.value <= TRANSLATE_X_THRESHOLD ? 1 : 0
    );
    return { opacity };
  });

  const rItemContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.taskContainer, rItemContainerStyle]}>
      <Animated.View style={[styles.itemContainer, rIconContainerStyle]}>
        <FontAwesome5
          name="trash-alt"
          size={LIST_ITEM_HEIGHT * 0.4}
          color="red"
        />
      </Animated.View>
      <PanGestureHandler
        onGestureEvent={panGesture}
        simultaneousHandlers={simultaneousHandlers}
      >
        <Animated.View style={[styles.task, rStyle]}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

export default function SwipeToDelete() {
  const [tasks, setTasks] = useState(TASKS);
  const scrollRef = useRef(null);

  const onDismiss = useCallback((task) => {
    setTasks((prev) => prev.filter((p) => p.index !== task.index));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <ScrollView style={{ flex: 1 }} ref={scrollRef}>
        {tasks.map((task) => (
          <ListItem
            task={task}
            onDismiss={onDismiss}
            simultaneousHandlers={scrollRef}
            key={task.index}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: "5%",
  },
  task: {
    width: "90%",
    height: LIST_ITEM_HEIGHT,
    backgroundColor: "white",
    justifyContent: "center",
    paddingLeft: 20,
    shadowOpacity: 0.09,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
  },
  taskContainer: {
    width: "100%",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 16,
  },
  itemContainer: {
    height: LIST_ITEM_HEIGHT,
    width: LIST_ITEM_HEIGHT,
    position: "absolute",
    right: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
