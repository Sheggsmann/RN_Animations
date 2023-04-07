import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const BACKGROUND_COLOR = "#0d0d0d";
const DARK_GRAY = "#282828";
const GRAY = "#909090";
const LIGHT_GRAY = "rgba(255,255,255,0.1)";

const STATUS_HEIGHT = 80;

const CIRCLE_LENGTH = 180;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const STATUS_DATA = [
  { id: 1, name: "Sheggs", posts: 5, time: "8m ago" },
  { id: 2, name: "Chibuzor ❤❤", posts: 1, time: "2h ago" },
  { id: 3, name: "Joel", posts: 2, time: "33m ago" },
  { id: 4, name: "Somto$$$", posts: 3, time: "43m ago" },
  { id: 5, name: "Paula", posts: 4, time: "6h ago" },
  { id: 6, name: "Favor", posts: 1, time: "9h ago" },
  { id: 7, name: "Chris", posts: 2, time: "2m ago" },
  { id: 8, name: "Testimony😎", posts: 2, time: "2m ago" },
  { id: 9, name: "Morry 🤦‍♂️", posts: 2, time: "4m ago" },
];

function Status({ data, rightComponent }) {
  return (
    <TouchableHighlight
      style={styles.status}
      touchSoundDisabled={true}
      underlayColor={"white"}
    >
      <>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Svg style={{ width: 70, height: STATUS_HEIGHT }}>
            <Circle
              cx={30}
              cy={STATUS_HEIGHT / 2}
              r={R}
              stroke={GRAY}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={10}
            />
          </Svg>
          <View>
            <Text style={styles.boldText}>{`${
              data ? data.name : "My Status"
            }`}</Text>
            <Text style={styles.timeText}>{`${
              data ? data.time : "5h ago"
            }`}</Text>
          </View>
        </View>
        {rightComponent && rightComponent()}
      </>
    </TouchableHighlight>
  );
}

export default function WhatsAppStatus() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.myStatus}>
          <Status
            rightComponent={() => (
              <View style={styles.editStatus}>
                <TouchableOpacity style={styles.editStatusButton}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={23}
                    color="#3ea6ff"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.editStatusButton, marginLeft: 20 }}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={23}
                    color="#3ea6ff"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View style={styles.otherStatus}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 7 }}>
            <Text style={styles.recentText}>RECENT UPDATES</Text>
          </View>

          {STATUS_DATA.map((data, id) => (
            <Status data={data} key={id} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  myStatus: {
    marginTop: 20,
  },
  otherStatus: {
    marginTop: 40,
  },
  status: {
    flexDirection: "row",
    height: STATUS_HEIGHT,
    backgroundColor: DARK_GRAY,
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderTopColor: LIGHT_GRAY,
    borderBottomColor: LIGHT_GRAY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  boldText: {
    fontWeight: "600",
    fontSize: 18,
    color: "white",
  },
  timeText: {
    marginTop: 4,
    color: "#ccc",
    fontSize: 15,
  },
  editStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  editStatusButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: LIGHT_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },
  recentText: {
    fontSize: 13,
    color: "#fff",
  },
});
