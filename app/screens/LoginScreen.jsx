import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries/";
import { XLogo } from "../components/Icons";
import * as SecureStore from "expo-secure-store";
import { LoginContext } from "../contexts/LoginContext";
import { Button } from "@rneui/base";

import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const { setIsLoggedIn } = useContext(LoginContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [dispatchLogin, { data, loading, error }] = useMutation(LOGIN, {
    onCompleted: async (res) => {
      let token = null;
      if (res?.login?.token) {
        token = res.login.token;
      }
      await SecureStore.setItemAsync("access_token", token);
      setIsLoggedIn(true);
      navigation.navigate("Home");
    },
  });

  const onLoginPress = async () => {
    await dispatchLogin({
      variables: {
        username,
        password,
      },
    });
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <XLogo style={styles.logo} size={55} />
            <Text style={styles.logoText}>Sign in to TripleX</Text>
            {error ? (
              <Text style={styles.errorMsg}>
                {
                  error.networkError.result.errors[0].extensions.stacktrace[0].split(
                    "GraphQLError: "
                  )[1]
                }
              </Text>
            ) : (
              ""
            )}
            <TextInput
              placeholder="Username"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => onLoginPress()}
              title="Login"
            />
            <Button
              containerStyle={styles.clearButton}
              type="clear"
              onPress={() => {
                navigation.navigate("Register");
              }}
              title="Don't have an account? Sign up"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: "center",
  },
  loginScreenContainer: {
    flex: 1,
  },
  logo: {
    marginTop: 15,
    marginBottom: 80,
    marginLeft: "auto",
    marginRight: "auto",
  },

  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },

  loginButton: {
    backgroundColor: "black",
    height: 45,
    marginTop: 40,
    alignItems: "center",
    borderRadius: 30,
  },
  clearButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: "transparent",
  },
  errorMsg: {
    color: "red",
  },
});
