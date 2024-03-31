const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { mongoConnect } = require("./config/mongoConnection");
const { userTypeDefs, userResolvers } = require("./schemas/users");
const { postTypeDefs, postResolvers } = require("./schemas/posts");
const { followTypeDefs, followResolvers } = require("./schemas/follow");
const authentication = require("./utils/authentication");
const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true,
});

(async () => {
  try {
    await mongoConnect();
    const { url } = await startStandaloneServer(server, {
      listen: {
        port: PORT,
      },
      context: async ({ req, res }) => {
        return {
          auth: async () => {
            return await authentication(req);
          },
        };
      },
    });
    console.log(`Server deployed at: ${url}`);
  } catch (error) {
    console.log(error);
  }
})();
