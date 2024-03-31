const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const { createToken } = require("../utils/jwt");
const { comparePassword } = require("../utils/bcrypt");
const {
  getUserCollection,
  getAllUsers,
  findOneById,
  getFollowerByUserId,
  searchUserByUsername,
  addUser,
} = require("../model/user");

const typeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String!
        email: String!
        password: String
        follower: [Follow]
        following: [Follow]
        userFollower: [User]
        userFollowing: [User] 
    }

    input RegisterInput {
        name: String
        username: String!
        email: String!
        password: String
    }

    type LoginOutput {
        token: String
    }
    
    type Query {
        getUsers: [User]
        userDetail(userId: ID): User
        searchUsername(username: String): [User]
    }

    type Mutation {
        register(payload: RegisterInput): User
        login(username: String!, password: String!): LoginOutput
    }
    `;

const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await getAllUsers();

      return users;
    },
    userDetail: async (_parent, args) => {
      const { userId } = args;
      const userFound = await findOneById(userId);
      if (!userFound) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "Not Found",
            http: { status: 404 },
          },
        });
      }
      console.log(userFound);
      const user = await getFollowerByUserId(userId);

      return user;
    },
    searchUsername: async (_parent, args) => {
      if (args.username) {
        args.username = args.username.toLowerCase();
      }
      const users = await searchUserByUsername(args.username);

      return users;
    },
  },
  Mutation: {
    register: async (_parent, args) => {
      const { payload } = args;
      const { username, name, email, password } = payload;

      if (!username) {
        throw new GraphQLError("Username is required", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      if (!email) {
        throw new GraphQLError("Email is required", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        email
      );
      if (regex === false) {
        throw new GraphQLError("Email address is not valid", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      if (!password) {
        throw new GraphQLError("Password is required", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      } else if (password.length < 5) {
        throw new GraphQLError("Password must contain at least 5 words", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      const duplicateName = await getUserCollection().findOne({ username });
      if (duplicateName) {
        throw new GraphQLError("Username is already taken", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      const duplicateMail = await getUserCollection().findOne({ email });
      if (duplicateMail) {
        throw new GraphQLError("Email is already taken", {
          extensions: {
            code: "Bad Request",
            http: { status: 400 },
          },
        });
      }

      const newUser = await addUser(payload);

      return newUser;
    },

    login: async (_parent, args) => {
      const { username, password } = args;
      const user = await getUserCollection().findOne({ username });
      if (!user) {
        throw new GraphQLError("Invalid username/password", {
          extensions: {
            code: "Unauthorized",
            http: { status: 401 },
          },
        });
      }

      const isValidPassword = comparePassword(password, user.password);

      if (!isValidPassword) {
        throw new GraphQLError("Invalid username/password", {
          extensions: {
            code: "Unauthorized",
            http: { status: 401 },
          },
        });
      }

      const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
      };

      const token = createToken(payload);

      return {
        token,
      };
    },
  },
};

module.exports = {
  userTypeDefs: typeDefs,
  userResolvers: resolvers,
};
