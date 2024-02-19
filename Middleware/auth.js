const { handleError } = require("../Util/Error");
const TokenManager = require("../Util/TokenManager");

const auth = (req, res, next) => {
  // console.log(
  //   "🚀 ~ auth ~ req.headers.authorization",
  //   req.headers.authorization
  // );
  console.log("HTTP Method: ", req.method);
  console.log("URL", req.url);
  console.log("Query", req.query);
  const isTokenDefined = req.headers.authorization;
  if (isTokenDefined === undefined) {
    if (
      (req.url === "/api/sign-in" && req.method === "POST") ||
      (req.url === "/api/create-user" && req.method === "POST")
    ) {
      next();
    } else {
      res.status(401).send({
        message: "Token is required",
      });
    }
  } else {
    if (
      (req.url === "/api/campaign" && req.method === "POST") ||
      (req.url === "/api/campaign" &&
        req.method === "GET" &&
        (req.query.listType === "owned" ||
          req.query.status === "ongoing" ||
          req.query.status === "ended"))
    ) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const dataDecrypt = TokenManager.getVerifyToken(token);
        if (dataDecrypt.role === "Creator") {
          next();
        } else {
          res.status(403).send({
            message: "Permission denied",
          });
        }
      } catch (error) {
        return handleError(error, res);
      }
    } else {
      next();
    }
  }
};

module.exports = { auth };
