const db = require("../Config/db.js");
const TokenManager = require("../Util/TokenManager.js");
class UserService {
  async validateUserExists(email) {
    console.log(email);
    const table = db("user");
    const isExist = await table.where("email", email);

    if (isExist.length === 0) {
      return { status: "notFound", message: "User is not exist" };
    } else {
      let data = isExist[0];
      const accessToken = TokenManager.getGenerateAccessToken(data);
      data = {
        ...data,
        accessToken,
      };
      console.log(data);
      return { status: "found", message: "User is exist", data };
    }
  }
  async createUser(payload) {
    const { email } = payload;

    const table = db("user");
    const isExist = await table.where("email", email);
    if (isExist.length === 0) {
      let data = {
        ...payload,
        role: "Attendees",
      };
      const table = db("user");
      const idData = await table.insert(data);
      data = {
        ...data,
        userId: idData[0],
      };
      const accessToken = TokenManager.getGenerateAccessToken(data);

      // Prepare the response object
      const responseData = {
        ...data,
        accessToken,
      };

      return {
        status: "success",
        message: "Create user success",
        data: responseData,
      };
    } else {
      return { status: "found", message: "User is exist" };
    }
    // console.log(data);
  }
  async getUserById(id) {
    const table = db("user");
    const data = await table.where("userId", id);
    return data;
  }
  async updateUser(id, payload) {
    const table = db("user");

    try {
      const existingUser = await table.where("userId", id).first();
      if (!existingUser) {
        return { status: "error", message: "User not found" };
      }

      // Merge existing user data with the payload
      const updatedUser = { ...existingUser, ...payload };
      // Update only the fields present in the payload
      await table.where("userId", id).update(updatedUser);

      return { status: "success", message: "Update user success" };
    } catch (error) {
      return { status: "error", message: "Error updating user", error };
    }
  }
}
module.exports = new UserService();
