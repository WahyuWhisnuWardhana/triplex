import { View, Text, StyleSheet, FlatList } from "react-native";
import { AvatarIcon } from "./Icons";
import { Button } from "@rneui/base";
import ProfileScreen from "../screens/ProfileScreen";
import { useNavigation } from "@react-navigation/native";
import { USER_DETAIL } from "../queries";
import { useQuery } from "@apollo/client";

export default function UserCard({ realname, username, id }) {
  const navigation = useNavigation();
  const { loading, error, data, refetch } = useQuery(USER_DETAIL, {
    variables: { userId: id },
  });
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "row",
          paddingHorizontal: 15,
          paddingVertical: 8,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "fff",
          borderWidth: 0.3,
          borderColor: "#AAB8C2",
        },
      ]}
    >
      <View style={{ paddingTop: 7 }}>
        <AvatarIcon size={40} />
      </View>

      <View
        style={{
          paddingLeft: 10,
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            paddingTop: 5,
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>{realname}</Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              color: "#657786",
            }}
          >
            @{username}
          </Text>
        </View>
      </View>
      <View>
        <Button
          containerStyle={styles.clearButton}
          type="solid"
          onPress={() => {
            navigation.navigate("Profile", { userData: data.userDetail });
          }}
          title="See Detail"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FA",
  },
  clearButton: {
    height: 45,
    marginTop: 10,
  },
});
