const { GraphQLError } = require("graphql");
const { verifyToken } = require("./jwt");
const { findOneById } = require("../model/user");

const authentication = async (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new GraphQLError("Invalid Token", {
      extensions: {
        code: "Unauthorized",
        http: { status: 401 },
      },
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new GraphQLError("Invalid Token", {
      extensions: {
        code: "Unauthorized",
        http: { status: 401 },
      },
    });
  }

  const decodedToken = verifyToken(token);

  const user = await findOneById(decodedToken.id);

  if (!user) {
    throw new GraphQLError("Invalid Token", {
      extensions: {
        code: "Unauthorized",
        http: { status: 401 },
      },
    });
  }

  return {
    authorId: user._id,
    username: user.username,
    userEmail: user.email,
  };
};

module.exports = authentication;
