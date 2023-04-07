import { StyleSheet, View } from "react-native";
import Intro from "./components/Intro";
import GestureHandler from "./components/GestureHandler";
import SVLikePro from "./components/SVLikePro";
import ColorSwitch from "./components/ColorSwitch";
import PinchHandler from "./components/PinchHandler";
import Insta_DoubleTap from "./components/Insta_DoubleTap";
import CustomScrollView from "./components/CustomScrollView";
import AnimatedColorPicker from "./components/AnimatedColorPicker";
import AnimatedTimer from "./components/AnimatedTimer";
import WhatsAppStatus from "./components/WhatsAppStatus";
import SwipeToDelete from "./components/SwipeToDelete";
import RippleEffect from "./components/RippleEffect";
import PerspectiveMenu from "./components/PerspectiveMenu";
import AnimatedCounter from "./components/AnimatedCounter";
import AnimatedClock from "./components/AnimatedClock";
import LayoutAnimMagic from "./components/LayoutAnimMagic";
import AnimatedFlatList from "./components/AnimatedFlatList";
import BottomSheetApp from "./components/BottomSheetApp";

export default function App() {
  return <BottomSheetApp />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
