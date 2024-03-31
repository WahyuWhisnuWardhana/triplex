const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");
const { hashPassword } = require("../utils/bcrypt");

const getUserCollection = () => {
  const db = getDatabase();
  const userCollection = db.collection("users");
  return userCollection;
};

const getAllUsers = async () => {
  const users = await getUserCollection()
    .find(
      {},
      {
        projection: {
          password: 0,
        },
      }
    )
    .toArray();
  return users;
};

const findOneById = async (id) => {
  const user = await getUserCollection().findOne(
    {
      _id: new ObjectId(id),
    },
    {
      projection: {
        password: 0,
      },
    }
  );

  return user;
};

const getFollowerByUserId = async (id) => {
  const agg = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "followingId",
        as: "follower",
      },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followerId",
        as: "following",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "follower.followerId",
        foreignField: "_id",
        as: "userFollower",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "following.followingId",
        foreignField: "_id",
        as: "userFollowing",
      },
    },
    {
      $project: {
        password: 0,
        "userFollower.password": 0,
        "userFollowing.password": 0,
      },
    },
  ];

  const user = await getUserCollection().aggregate(agg).toArray();
  console.log(user);
  return user[0];
};

const searchUserByUsername = async (username) => {
  let regex = new RegExp(username);
  const users = await getUserCollection()
    .find(
      {
        username: { $regex: regex },
      },
      {
        projection: {
          password: 0,
        },
      }
    )
    .toArray();

  return users;
};

const addUser = async (payload) => {
  payload.password = hashPassword(payload.password);
  const newUser = await getUserCollection().insertOne(payload);

  const user = await getUserCollection().findOne(
    {
      _id: new ObjectId(newUser.insertedId),
    },
    {
      projection: {
        password: 0,
      },
    }
  );
  return user;
};
module.exports = {
  getUserCollection,
  getAllUsers,
  findOneById,
  getFollowerByUserId,
  searchUserByUsername,
  addUser,
};
