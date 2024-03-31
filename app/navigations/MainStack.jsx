import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LoginContext } from "../contexts/LoginContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainTabs from "../tabs/MainTabs";
import ProfileScreen from "../screens/ProfileScreen";
const Stack = createNativeStackNavigator();
const MainStack = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <>
                <Stack.Screen name="Home" component={MainTabs} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MainStack;
