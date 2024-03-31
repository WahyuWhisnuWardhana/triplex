import { useRef } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons/faCircleUser";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";

function generateTweets(limit) {
  return new Array(limit).fill(0).map((_, index) => {
    const repetitions = Math.floor(Math.random() * 3) + 1;

    return {
      key: index.toString(),
      text: "Lorem ipsum dolor amet ".repeat(repetitions),
    };
  });
}

const TWEETS = generateTweets(25);
const HEADER_HEIGHT_EXPANDED = 35;
const HEADER_HEIGHT_NARROWED = 90;

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function ProfileScreen({ route }) {
  const navigation = useNavigation();
  const { userData } = route.params;
  const { email, follower, username, following, name } = userData;

  console.log(userData);
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View
          style={{
            zIndex: 2,
            position: "absolute",
            top: insets.top + 10,
            left: 10,
            backgroundColor: "black",
            height: 40,
            width: 40,
            borderRadius: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather
            name="chevron-left"
            color="white"
            size={30}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>

        {/* Refresh arrow */}
        <Animated.View
          style={{
            zIndex: 2,
            position: "absolute",
            top: insets.top + 13,
            left: 0,
            right: 0,
            alignItems: "center",
            opacity: scrollY.interpolate({
              inputRange: [-20, 0],
              outputRange: [1, 0],
            }),
            transform: [
              {
                rotate: scrollY.interpolate({
                  inputRange: [-45, -35],
                  outputRange: ["180deg", "0deg"],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <Feather name="arrow-down" color="black" size={25} />
        </Animated.View>

        {/* Name + tweets count */}
        <Animated.View
          style={{
            zIndex: 2,
            position: "absolute",
            top: insets.top + 6,
            left: 0,
            right: 0,
            alignItems: "center",
            opacity: scrollY.interpolate({
              inputRange: [90, 110],
              outputRange: [0, 1],
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [90, 120],
                  outputRange: [30, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <Text style={[styles.text, styles.username]}>Arnaud</Text>

          <Text style={[styles.text, styles.tweetsCount]}>379 tweets</Text>
        </Animated.View>

        <AnimatedImageBackground
          source={{
            uri: "https://c02.purpledshub.com/uploads/sites/41/2021/08/mountains-7ddde89.jpg?w=1029&webp=1",
          }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_NARROWED,
            transform: [
              {
                scale: scrollY.interpolate({
                  inputRange: [-200, 0],
                  outputRange: [5, 1],
                  extrapolateLeft: "extend",
                  extrapolateRight: "clamp",
                }),
              },
            ],
          }}
        >
          <AnimatedBlurView
            tint="dark"
            intensity={96}
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 2,
              opacity: scrollY.interpolate({
                inputRange: [-50, 0, 50, 100],
                outputRange: [1, 0, 0, 1],
              }),
            }}
          />
        </AnimatedImageBackground>

        {/* Tweets/profile */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: scrollY },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={{
            zIndex: 3,
            marginTop: HEADER_HEIGHT_NARROWED,
            paddingTop: HEADER_HEIGHT_EXPANDED,
          }}
        >
          <View style={[styles.container, { backgroundColor: "#fff" }]}>
            <View
              style={[
                styles.container,
                {
                  paddingHorizontal: 20,
                },
              ]}
            >
              <FontAwesomeIcon
                style={[
                  {
                    marginTop: 6,
                    marginLeft: -10,
                    paddingBottom: 10,
                    borderRadius: 80 / 2,
                    backgroundColor: "#E1E8ED",
                  },
                ]}
                resizeMode={"contain"}
                icon={faCircleUser}
                size={80}
              />
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 24,
                    fontWeight: "bold",
                    marginTop: 10,
                  },
                ]}
              >
                {name}
              </Text>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 15,
                    color: "gray",
                    marginBottom: 15,
                  },
                ]}
              >
                @{username}
              </Text>
              <Text style={[styles.text, { marginBottom: 15, fontSize: 15 }]}>
                Lores Ipsum
              </Text>
              {/* Profile stats */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 15,
                }}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: "bold",
                      marginRight: 10,
                    },
                  ]}
                >
                  {following.length + " "}
                  <Text
                    style={{
                      color: "gray",
                      fontWeight: "normal",
                    }}
                  >
                    Following
                  </Text>
                </Text>

                <Text style={[styles.text, { fontWeight: "bold" }]}>
                  {follower.length + " "}
                  <Text
                    style={{
                      color: "gray",
                      fontWeight: "normal",
                    }}
                  >
                    Followers
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.container}>
              {TWEETS.map((item, index) => (
                <View key={item.key} style={styles.tweet}>
                  <FontAwesomeIcon
                    style={[
                      {
                        height: 50,
                        width: 50,
                        marginRight: 10,
                        paddingBottom: 10,
                        borderRadius: 50 / 2,
                        backgroundColor: "#E1E8ED",
                      },
                    ]}
                    resizeMode={"contain"}
                    icon={faCircleUser}
                    size={50}
                  />

                  <View style={styles.container}>
                    <Text
                      style={[
                        styles.text,
                        {
                          fontWeight: "bold",
                          fontSize: 15,
                        },
                      ]}
                    >
                      {name}{" "}
                      <Text
                        style={{
                          color: "gray",
                          fontWeight: "normal",
                        }}
                      >
                        @{username} · {index + 1}d
                      </Text>
                    </Text>

                    <Text style={[styles.text, { fontSize: 15 }]}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: "black",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: -3,
  },
  tweetsCount: {
    fontSize: 13,
  },
  tweet: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.25)",
  },
});
