import { View, TouchableOpacity, Button, Text } from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import AddPostModal from "./AddPostModal";
export default function AddPostButton({ refetch }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showAddPost = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        bottom: 30,
        right: 10,
      }}
      onPress={showAddPost}
    >
      <View
        style={{
          height: 60,
          width: 60,
          borderRadius: 30,
          backgroundColor: "#1DA1F2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name="plus" size={24} color="white" />
      </View>
      <AddPostModal
        isVisible={isModalVisible}
        onClose={onModalClose}
        refetch={refetch}
      >
        <Text>Close</Text>
      </AddPostModal>
    </TouchableOpacity>
  );
}
