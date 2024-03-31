const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConnection");

const getPostCollection = () => {
  const db = getDatabase();
  const postCollection = db.collection("posts");
  return postCollection;
};

const getAllPosts = async () => {
  const agg = [
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $project: { "author.password": 0 } },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  const posts = await getPostCollection().aggregate(agg).toArray();

  return posts;
};

const getPostById = async (id) => {
  const post = await getPostCollection().findOne({
    _id: new ObjectId(id),
  });

  return post;
};

const addComment = async (id, payload) => {
  payload.createdAt = new Date();
  payload.updatedAt = new Date();

  const updatedPost = await getPostCollection().updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $push: {
        comments: payload,
      },
    }
  );

  const post = await getPostCollection().findOne({
    _id: new ObjectId(id),
  });
  return post;
};

const addPost = async (payload) => {
  const newPost = await getPostCollection().insertOne(payload);

  const post = await getPostCollection().findOne({
    _id: new ObjectId(newPost.insertedId),
  });
  return post;
};

const likeChekcer = async (id, payload) => {
  const duplicate = await getPostCollection().findOne({
    _id: new ObjectId(id),
    "likes.username": payload.username,
  });

  if (duplicate) {
    const removed = await getPostCollection().updateMany(
      {
        _id: new ObjectId(id),
      },
      { $pull: { likes: { username: payload.username } } }
    );
    return { message: "Unliked Successfully" };
  } else {
    const liked = await getPostCollection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $push: {
          likes: payload,
        },
      }
    );
    return { message: "Liked Successfully" };
  }
};
module.exports = {
  getPostCollection,
  getPostById,
  getAllPosts,
  addPost,
  addComment,
  likeChekcer,
};
