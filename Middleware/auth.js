const { handleError } = require("../Util/Error");
const TokenManager = require("../Util/TokenManager");

const auth = (req, res, next) => {
  // console.log(
  //   "🚀 ~ auth ~ req.headers.authorization",
  //   req.headers.authorization
  // );
  console.log("HTTP Method: ", req.method);
  console.log("URL", req._parsedUrl.pathname);
  console.log("Query", req.query);
  const isTokenDefined = req.headers.authorization;
  if (isTokenDefined === undefined) {
    if (
      (req._parsedUrl.pathname === "/api/sign-in" && req.method === "POST") ||
      (req._parsedUrl.pathname === "/api/create-user" &&
        req.method === "POST") ||
      (req._parsedUrl.pathname === "/api/discover" && req.method === "GET")
    ) {
      next();
    } else {
      res.status(401).send({
        message: "Token is required",
      });
    }
  } else {
    const token = req.headers.authorization.split(" ")[1];
    const dataDecrypt = TokenManager.getVerifyToken(token);
    // console.log(req._parsedUrl.pathname);
    const regex = /^\/api\/user-role(?:\/\d+)?$/;
    if (dataDecrypt.message === "Token is not valid") {
      res.status(400).send({
        message: dataDecrypt.message,
      });
    } else {
      if (
        (regex.test(req._parsedUrl.pathname) && req.method === "PATCH") ||
        (req._parsedUrl.pathname === "/api/users" && req.method === "GET")
      ) {
        try {
          if (dataDecrypt.role === "Admin") {
            next();
          } else {
            res.status(403).send({
              message: "Permission denied",
            });
          }
        } catch (error) {
          return handleError(error, res);
        }
      } else if (
        (req._parsedUrl.pathname === "/api/campaign" &&
          req.method === "POST") ||
        (req._parsedUrl.pathname === "/api/campaign" &&
          req.method === "GET" &&
          (req.query.status === "ongoing" ||
            req.query.listType === "ended" ||
            req.query.listType === "owned"))
      ) {
        try {
          if (dataDecrypt.role === "Creator" || dataDecrypt.role === "Admin") {
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
  }
};

module.exports = { auth };
