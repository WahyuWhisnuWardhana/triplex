const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const { followChecker, getAllFollows } = require("../model/follow");
const { findOneById } = require("../model/user");

const typeDefs = `#graphql
    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type FollowOutput {
        message: String
    }

    type Query {
        showAllFollow: [Follow]
    }

    type Mutation {
        checkFollow(userId: ID): FollowOutput
    }
    `;

const resolvers = {
  Query: {
    showAllFollow: async (_parent, args, contextValue) => {
      const loginInfo = await contextValue.auth();
      const follows = await getAllFollows();

      return follows;
    },
  },
  Mutation: {
    checkFollow: async (_parent, args, contextValue) => {
      const loginInfo = await contextValue.auth();
      const { userId } = args;
      const { authorId } = loginInfo;

      if (!userId) {
        throw new GraphQLError("User Id is required", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      if (userId === authorId.toString()) {
        throw new GraphQLError("You can't follow your own account!", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }
      const user = await findOneById(userId);
      if (!user) {
        throw new GraphQLError("User with that id is not found", {
          extensions: {
            code: "Not Found",
            http: { status: 404 },
          },
        });
      }

      const payload = {
        followingId: user._id,
        followerId: authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const follower = await followChecker(payload);

      return follower;
    },
  },
};

module.exports = {
  followTypeDefs: typeDefs,
  followResolvers: resolvers,
};
