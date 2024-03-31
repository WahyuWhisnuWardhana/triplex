import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { SEARCH_USER } from "../queries";
import { Feather, Entypo } from "@expo/vector-icons";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
} from "react-native";
import { Button } from "@rneui/base";
import UserCard from "../components/UserCard";
export default function SearchScreen({ navigation }) {
  const [clicked, setClicked] = useState(false);
  const [username, setUsername] = useState("");

  const {
    data: allData,
    loading: allLoading,
    error: allError,
  } = useQuery(SEARCH_USER);
  const [
    dispatchSearchUser,
    { data: searchData, loading: searchLoading, error: searchError, refetch },
  ] = useLazyQuery(SEARCH_USER);

  const onSearchPress = async (varUser) => {
    console.log(varUser);
    await dispatchSearchUser({
      variables: {
        username: varUser,
      },
    });
    refetch();
  };

  useEffect(() => {}, [username, allData, searchData, refetch]);

  function getFoundLength(userData) {
    if (userData?.searchUsername?.length > 0) {
      refetch();
      return (
        <FlatList
          data={userData.searchUsername}
          renderItem={({ item }) => (
            <UserCard
              username={item.username}
              realname={item.name}
              id={item._id}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      );
    } else {
      return (
        <Text
          style={{
            marginTop: "50%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          User with that username is not found
        </Text>
      );
    }
  }

  if (allLoading) {
    return (
      <Text
        style={{
          marginTop: "50%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Loading...
      </Text>
    );
  }

  if (!allLoading && allError) {
    return (
      <Text
        style={{
          marginTop: "50%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Error: {allError.message}
      </Text>
    );
  }

  if (!allLoading && allData) {
    return (
      <View>
        <View style={styles.container}>
          <View
            style={
              clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
            }
          >
            <Feather
              name="search"
              size={20}
              color="black"
              style={{ marginLeft: 1 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Search by username.."
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                onSearchPress(value);
              }}
              onFocus={() => {
                setClicked(true);
                refetch();
              }}
              onKeyPress={() => {
                refetch();
              }}
            />
            {clicked && (
              <Entypo
                name="cross"
                size={20}
                color="black"
                style={{ padding: 1 }}
                onPress={() => {
                  Keyboard.dismiss();
                  setClicked(false);
                }}
              />
            )}
          </View>
          {clicked && (
            <View>
              <Button
                containerStyle={styles.clearButton}
                type="clear"
                onPress={() => {
                  Keyboard.dismiss();
                  setClicked(false);
                }}
                title="Cancel"
              />
            </View>
          )}
        </View>
        {!searchLoading && searchData ? (
          getFoundLength(searchData)
        ) : (
          <FlatList
            data={allData.searchUsername}
            renderItem={({ item }) => (
              <UserCard
                username={item.username}
                realname={item.name}
                id={item._id}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "85%",
    width: "100%",
  },
  item: {
    margin: 30,
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    fontStyle: "italic",
  },

  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  clearButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: "transparent",
  },
});
