import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Button } from "@rneui/base";
import { useState } from "react";
import { ADD_POST } from "../queries";
import { useMutation } from "@apollo/client";

export default function AddPostModal({ isVisible, onClose, refetch }) {
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [content, setContent] = useState("");
  const [dispatchAddPost, { data, loading, error }] = useMutation(ADD_POST, {
    onCompleted: () => {
      setContent("");
      setImgUrl("");
      setTags("");
      onClose();
      refetch();
    },
  });

  const onPostPress = async () => {
    await dispatchAddPost({
      variables: {
        content,
        tags: tags.split(" "),
        imgUrl,
      },
    });
  };

  const clearInput = () => {
    setContent("");
    setImgUrl("");
    setTags("");
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.loginScreenContainer}>
        <View style={styles.loginFormView}>
          <Entypo
            onPress={clearInput}
            name="squared-cross"
            size={35}
            color="red"
            style={{ marginLeft: 10, marginTop: 10, marginBottom: 20 }}
          />
          <Text style={styles.logoText}>Add new post</Text>
          {error ? (
            <Text style={styles.errorMsg}>
              {
                error?.networkError?.result?.errors[0].extensions.stacktrace[0].split(
                  "GraphQLError: "
                )[1]
              }
            </Text>
          ) : (
            ""
          )}
          <TextInput
            placeholder="HashTags (without #)"
            placeholderTextColor="#c4c3cb"
            style={styles.addPostTextInput}
            value={tags}
            onChangeText={setTags}
          />
          <TextInput
            placeholder="Image URL (ignore if not proper link)"
            placeholderTextColor="#c4c3cb"
            style={styles.addPostTextInput}
            value={imgUrl}
            onChangeText={setImgUrl}
          />
          <TextInput
            placeholder="Content*"
            placeholderTextColor="#c4c3cb"
            style={styles.addPostTextInput}
            value={content}
            onChangeText={setContent}
          />
          <Button
            buttonStyle={styles.postButton}
            onPress={() => {
              return onPostPress();
            }}
            // onPress={onClose}
            title="Post"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: "center",
  },
  loginScreenContainer: {
    flex: 1,
    backgroundColor: "#fff",
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
  addPostTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },

  postButton: {
    backgroundColor: "#1DA1F2",
    height: 60,
    marginTop: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 80,
    marginRight: 80,
  },
  errorMsg: {
    color: "red",
    marginLeft: 20,
  },
});
