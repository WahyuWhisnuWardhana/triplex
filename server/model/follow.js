const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");

const getFollowCollection = () => {
  const db = getDatabase();
  const followCollection = db.collection("follows");
  return followCollection;
};

const getAllFollows = async () => {
  const follows = await getFollowCollection().find().toArray();

  return follows;
};

const followChecker = async (payload) => {
  const duplicate = await getFollowCollection().findOne({
    followerId: payload.followerId,
    followingId: payload.followingId,
  });

  if (duplicate) {
    const pull = await getFollowCollection().deleteOne({
      followerId: payload.followerId,
      followingId: payload.followingId,
    });

    return { message: `Unfollowed` };
  }

  const added = await getFollowCollection().insertOne(payload);
  const follow = await getFollowCollection().findOne({
    _id: new ObjectId(added.insertedId),
  });
  return { message: `Followed` };
};
module.exports = {
  getAllFollows,
  followChecker,
};
