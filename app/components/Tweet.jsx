import { useState } from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { View, Text, Image, Pressable } from "react-native";
import {
  CommentIcon,
  RetweetIcon,
  HeartIcon,
  LikedHeartIcon,
  AvatarIcon,
} from "./Icons";
import { Icon } from "@fortawesome/fontawesome-svg-core";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CHECK_LIKE } from "../queries";
export default function Tweet({
  content,
  name,
  username,
  time,
  imgUrl,
  likes,
  postId,
  tags,
  refetch,
}) {
  const [like, setLike] = useState(false);
  const [dispatchLike, { data, loading, error }] = useMutation(CHECK_LIKE);

  const onLikePress = async (postId) => {
    await dispatchLike({
      variables: {
        postId,
      },
    });
    if (data?.checkLike?.message === "Liked Successfully") {
      setLike(true);
    } else if (data?.checkLike?.message === "Unliked Successfully") {
      setLike(false);
    }
    refetch();
  };

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderBottomColor: "#AAB8C2",
        borderBottomWidth: 1,
        paddingBottom: 3,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <AvatarIcon size={30} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>{name}</Text>
              <Text style={{ paddingLeft: 5, color: "#657786" }}>
                {"@" + username}
              </Text>
              <View
                style={{
                  backgroundColor: "#657786",
                  marginHorizontal: 4,
                  width: 1.5,
                  height: 1.5,
                  borderRadius: 3,
                }}
              />
              <Text style={{ color: "#657786" }}>{time.split("T")[0]}</Text>
            </View>
            <SimpleLineIcons name={"arrow-down"} size={10} color={"#657786"} />
          </View>
          <View style={{ flex: 1, marginRight: "12%" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
              }}
            >
              {content}
            </Text>

            {tags?.length > 0 ? (
              <Text>
                {tags.map((tag) => (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#1DA1F2",
                    }}
                  >
                    #{tag + " "}
                  </Text>
                ))}
              </Text>
            ) : (
              ""
            )}

            {imgUrl ? (
              <Image
                style={{
                  width: "100%",
                  height: 450,
                  resizeMode: "stretch",
                }}
                source={{ uri: imgUrl }}
              />
            ) : (
              ""
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "88%",
              marginTop: 15,
              marginBottom: 5,
            }}
          >
            <CommentIcon size={20} />
            <RetweetIcon size={20} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Pressable onPress={() => onLikePress(postId)}>
                {like ? <HeartIcon size={20} /> : <LikedHeartIcon size={20} />}
              </Pressable>
              {likes ? (
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                    paddingLeft: 5,
                  }}
                >
                  {likes}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                  }}
                ></Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
