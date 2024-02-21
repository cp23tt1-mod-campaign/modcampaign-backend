const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwt-secret.json");
class TokenManager {
  static getGenerateAccessToken(payload) {
    const token = jwt.sign(payload, jwtSecret.JWT_SECRET, {
      // expiresIn: "24h",
    });
    return token;
  }
  static getGenerateRefreshToken(payload) {
    const token = jwt.sign(payload, jwtSecret.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  }
  static getVerifyToken(token) {
    try {
      const data = jwt.verify(token, jwtSecret.JWT_SECRET);
      return data;
    } catch (error) {
      if (error.message === "jwt expired") {
        return { error: error, message: "Token is expired" };
      } else {
        return { error: error, message: "Token is not valid" };
      }
    }
  }
}
module.exports = TokenManager;
