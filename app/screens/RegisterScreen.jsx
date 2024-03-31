import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../queries";
import { XLogo } from "../components/Icons";
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

export default function RegisterScreen({ navigation }) {
  const { setIsLoggedIn } = useContext(LoginContext);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dispatchRegister, { data, loading, error }] = useMutation(REGISTER);

  const onRegisterPress = async () => {
    await dispatchRegister({
      variables: {
        payload: {
          name,
          username,
          email,
          password,
        },
      },
    });
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <XLogo style={styles.logo} size={55} />
            <Text style={styles.logoText}>Create your account</Text>
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
              placeholder="Name"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Username"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              value={email}
              onChangeText={setEmail}
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
              onPress={() => onRegisterPress()}
              title="Register"
            />
            <Button
              containerStyle={styles.clearButton}
              type="clear"
              onPress={() => {
                navigation.navigate("Login");
              }}
              title="Already have an account? Sign in"
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
    fontSize: 30,
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
    width: 330,
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
