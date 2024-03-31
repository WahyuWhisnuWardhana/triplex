const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const {
  addPost,
  getAllPosts,
  getPostById,
  addComment,
  likeChekcer,
} = require("../model/post");
const Redis = require("ioredis");
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const typeDefs = `#graphql
    type Comment {
        content: String!
        username: String!
        createdAt: String
        updatedAt: String
    }

    type Post {
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
        author: User
    }

    type Like {
        username: String
        createdAt: String
        updatedAt: String
    }

    input AddPostInput {
        content: String!
        tags: [String]
        imgUrl: String
        authorId: ID
        createdAt: String
        updatedAt: String
    }
    
    input commentInput {
        content: String!
        username: String
        createdAt: String
        updatedAt: String
    }
    
    input likeInput {
        username: String
        createdAt: String
        updatedAt: String
    }

    
    type likeOutput {
        message: String
    }

    type Query {
        showPosts: [Post]
    }

    type Mutation {
        addPost(content: String, tags: [String], imgUrl: String): Post
        commentPost(postId: ID, payload: commentInput): Post
        checkLike(postId: ID): likeOutput
    }
    `;

const resolvers = {
  Query: {
    showPosts: async (_parent, _args, contextValue) => {
      const loginInfo = await contextValue.auth();
      const postsCache = await redis.get("data:posts");
      if (postsCache) {
        return JSON.parse(postsCache);
      }

      const posts = await getAllPosts();
      redis.set("data:posts", JSON.stringify(posts));

      return posts;
    },
  },
  Mutation: {
    addPost: async (_parent, args, contextValue) => {
      const loginInfo = await contextValue.auth();
      const { content, tags, imgUrl } = args;
      const { authorId } = loginInfo;
      const payload = {
        content: content,
        tags: tags,
        imgUrl: imgUrl,
        authorId: authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (!content) {
        throw new GraphQLError("Content is required", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      const newPost = await addPost(payload);
      redis.del("data:posts");
      return newPost;
    },
    commentPost: async (_parent, args, contextValue) => {
      const loginInfo = await contextValue.auth();
      const { postId, payload } = args;
      payload.username = loginInfo.username;
      if (!payload.content) {
        throw new GraphQLError("Content is required", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      const post = await getPostById(postId);

      if (!post) {
        throw new GraphQLError("Post not found", {
          extensions: {
            code: "Not Found",
            http: { status: 404 },
          },
        });
      }
      const postWithComment = await addComment(postId, payload);
      redis.del("data:posts");
      return postWithComment;
    },
    checkLike: async (_parent, args, contextValue) => {
      const loginInfo = await contextValue.auth();
      const { username } = loginInfo;
      const { postId } = args;
      const payload = {
        username: username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const post = await getPostById(postId);
      if (!post) {
        throw new GraphQLError("Post not found", {
          extensions: {
            code: "Not Found",
            http: { status: 404 },
          },
        });
      }
      const likedPost = await likeChekcer(postId, payload);
      redis.del("data:posts");
      return likedPost;
    },
  },
};

module.exports = {
  postTypeDefs: typeDefs,
  postResolvers: resolvers,
};
