import { memo } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const data = new Array(50).fill(0).map((_, index) => ({ id: index }));

const ListItem = memo(({ item, viewableItems }) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((viewableItem) => viewableItem.item?.id === item.id)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [{ scale: withTiming(isVisible ? 1 : 0.6) }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 80,
          width: "90%",
          backgroundColor: "royalblue",
          marginTop: 20,
          alignSelf: "center",
          borderRadius: 15,
        },
        rStyle,
      ]}
    />
  );
});

export default function AnimatedFlatList() {
  const viewableItems = useSharedValue([]);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingVertical: 40 }}
        data={data}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        renderItem={({ item }) => {
          return <ListItem item={item} viewableItems={viewableItems} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
