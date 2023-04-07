import { useState, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

const LIST_ITEM_COLOR = "#1798DE";

export default function LayoutAnimMagic() {
  const [items, setItems] = useState(
    new Array(5).fill(0).map((_, index) => ({ id: index }))
  );

  const onAdd = useCallback(() => {
    setItems((currentItems) => {
      const nextId = (currentItems[currentItems.length - 1]?.id ?? 0) + 1;
      return [...currentItems, { id: nextId }];
    });
  }, []);

  const onDelete = useCallback((itemId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  }, []);

  console.log(items);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.floatingButton} onPress={onAdd}>
        <Text style={{ fontSize: 40, color: "white" }}>+</Text>
      </TouchableOpacity>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 50 }}
      >
        {items.map((item, index) => (
          <Animated.View
            style={styles.listItem}
            key={index.toString()}
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout.delay(200)}
            onTouchEnd={() => onDelete(item.id)}
          ></Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listItem: {
    height: 100,
    backgroundColor: LIST_ITEM_COLOR,
    width: "90%",
    marginVertical: 10,
    borderRadius: 20,
    alignSelf: "center",
    // Android
    elevation: 5,
    // IOS shadow
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  floatingButton: {
    width: 80,
    aspectRatio: 1,
    backgroundColor: "black",
    borderRadius: 40,
    position: "absolute",
    bottom: 50,
    right: "5%",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
