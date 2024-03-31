import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          paddingTop: 0,
          backgroundColor: "#dadada",
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "SearchScreen") {
            iconName = focused ? "search-sharp" : "search-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1DA1F2",
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name={"HomeScreen"} component={HomeScreen} />
      <Tab.Screen name={"SearchScreen"} component={SearchScreen} />
    </Tab.Navigator>
  );
}
