import { FlatList, View, Text, StyleSheet, Pressable } from "react-native";
import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { useQuery } from "@apollo/client";
import { SHOW_POSTS } from "../queries";
import Tweet from "../components/Tweet";
import { XLogo } from "../components/Icons";
import { useState } from "react";
import AddPostButton from "../components/AddPostButton";
import * as SecureStore from "expo-secure-store";

const HomeScreen = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(SHOW_POSTS);

  const { setIsLoggedIn } = useContext(LoginContext);
  const [none, setNone] = useState(false);
  const [hideTweet, setHideTweet] = useState(false);

  const logoutOnPressHandler = async () => {
    await SecureStore.deleteItemAsync("token");
    setIsLoggedIn(false);
  };

  if (loading) {
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

  if (!loading && error) {
    return (
      <Text
        style={{
          marginTop: "50%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Error: {error.message}
      </Text>
    );
  }

  if (!loading && data) {
    return (
      <View style={styles.container}>
        {none ? (
          ""
        ) : (
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomColor: "#1DA1F2",
              borderBottomWidth: 3,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",

                paddingBottom: 5,
              }}
            >
              <XLogo style={styles.logo} size={30} />
            </View>

            <Pressable
              style={{
                alignItems: "center",
                backgroundColor: "red",
                padding: 10,
                width: "25%",
                borderRadius: 10,
              }}
              onPress={logoutOnPressHandler}
            >
              <Text style={{ fontSize: 15, color: "#fff" }}>Log-Out</Text>
            </Pressable>
          </View>
        )}

        <FlatList
          data={data.showPosts}
          renderItem={({ item }) => (
            <Tweet
              key={item._id.toString()}
              content={item.content}
              name={item.author.name}
              username={item.author.username}
              time={item.createdAt}
              imgUrl={item.imgUrl}
              likes={item?.likes?.length}
              postId={item._id}
              tags={item.tags}
              refetch={refetch}
            />
          )}
          keyExtractor={(item) => item._id}
          onScrollBeginDrag={() => {
            setHideTweet(true);
          }}
          onScrollEndDrag={() => {
            setHideTweet(false);
          }}
          onScroll={(event) => {
            if (event.nativeEvent.contentOffset.y <= 50) {
              setNone(false);
            } else {
              setNone(true);
            }
            refetch();
          }}
        />
        <AddPostButton refetch={refetch} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  row: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  headerText: {
    color: "#AAB8C2",
  },
  buttonContainer: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  button: {
    padding: 8,
    backgroundColor: "#fef08a",
    borderRadius: 5,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 20,
  },
  item: {
    backgroundColor: "#fef08a",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  logo: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export default HomeScreen;
