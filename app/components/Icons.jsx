import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmarksLines } from "@fortawesome/free-solid-svg-icons/faXmarksLines";
import { faRetweet } from "@fortawesome/free-solid-svg-icons/faRetweet";
import { faComment } from "@fortawesome/free-regular-svg-icons/faComment";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons/faCircleUser";

export const XLogo = ({ style, size }) => {
  return <FontAwesomeIcon style={style} icon={faXmarksLines} size={size} />;
};

export const RetweetIcon = ({ size }) => {
  return (
    <FontAwesomeIcon
      icon={faRetweet}
      style={{ color: "#657786" }}
      size={size}
    />
  );
};

export const CommentIcon = ({ size }) => {
  return (
    <FontAwesomeIcon
      icon={faComment}
      style={{ color: "#657786" }}
      size={size}
    />
  );
};

export const HeartIcon = ({ size }) => {
  return (
    <FontAwesomeIcon icon={faHeart} style={{ color: "#657786" }} size={size} />
  );
};

export const LikedHeartIcon = ({ size }) => {
  return (
    <FontAwesomeIcon icon={faHeartSolid} style={{ color: "red" }} size={size} />
  );
};

export const AvatarIcon = ({ size }) => {
  return (
    <FontAwesomeIcon
      style={[
        {
          marginLeft: 5,
          marginTop: 6,
          paddingBottom: 10,
          borderRadius: size / 2,
          backgroundColor: "#E1E8ED",
        },
      ]}
      resizeMode={"contain"}
      icon={faCircleUser}
      size={size}
    />
  );
};
