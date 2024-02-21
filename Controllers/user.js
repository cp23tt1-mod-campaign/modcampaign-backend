const UserService = require("../Service/user.js");
const { ErrorHandler, handleError } = require("../Util/Error.js");
const { auth } = require("../Middleware/auth.js");
const TokenManager = require("../Util/TokenManager.js");

class UserController {
  async validateUserExists(req, res) {
    const { email } = req.body;
    try {
      const data = await UserService.validateUserExists(email);
      res.status(200).send({
        message: "Validate user success",
        data: data,
      });
    } catch (error) {
      return handleError(error, res);
    }
  }
  async createUser(req, res) {
    // console.log("🚀 ~ UserController ~ createUser ~ next:", next);

    // const token = req.headers.authorization.split(" ")[1];
    // auth(req, res, next);
    try {
      const data = await UserService.createUser(req.body);
      // console.log(data);
      if (data.status === "found") {
        throw new ErrorHandler(400, data.message);
      } else if (data.status === "success") {
        res.status(200).send({
          statusCode: 200,
          message: data.message,
          data: data.data,
        });
      } else {
        res.status(400).send({
          statusCode: 400,
          message: data.message,
          data: data.data,
        });
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
  async getUserById(req, res) {
    const { id } = req.query;
    try {
      if (id === undefined) {
        throw new ErrorHandler(400, "User id is required");
      }
      const data = await UserService.getUserById(id);
      if (data.length === 0) {
        throw new ErrorHandler(404, "User is not found");
      } else {
        res.status(200).send({
          message: "Get user success",
          data: data,
        });
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
  async updateUser(req, res) {
    const { id } = req.query;
    try {
      if (id === undefined) {
        throw new ErrorHandler(400, "User id is required");
      } else {
        const token = req.headers.authorization.split(" ")[1];
        const dataDecrypt = TokenManager.getVerifyToken(token);
        if (dataDecrypt.userId !== parseInt(id)) {
          throw new ErrorHandler(
            403,
            "User is not authorized to update this user data"
          );
        } else {
          const data = await UserService.updateUser(id, req.body);
          console.log(data);
          if (data.status === "error") {
            throw new ErrorHandler(400, data.message);
          } else if (data.status === "notFound") {
            throw new ErrorHandler(404, data.message);
          } else if (data.status === "success") {
            res.status(200).send({
              status: data.status,
              statusCode: 200,
              message: data.message,
              data: data.data,
            });
          }
        }
      }
    } catch (error) {
      return handleError(error, res);
    }
  }
}
module.exports = new UserController();
