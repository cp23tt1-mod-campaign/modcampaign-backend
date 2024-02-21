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
    const {
      firstName,
      lastName,
      email,
      profileImage,
      gender,
      age,
      height,
      weight,
      activityLevel,
      bmr,
    } = payload;
    const checkRequire = [];
    if (!firstName) {
      checkRequire.push("firstName");
    }
    if (!lastName) {
      checkRequire.push("lastName");
    }
    if (!email) {
      checkRequire.push("email");
    }
    if (!profileImage) {
      checkRequire.push("profileImage");
    }
    if (!gender) {
      checkRequire.push("gender");
    }
    if (!age) {
      checkRequire.push("age");
    }
    if (!height) {
      checkRequire.push("height");
    }
    if (!weight) {
      checkRequire.push("weight");
    }
    if (!activityLevel) {
      checkRequire.push("activityLevel");
    }
    if (!bmr) {
      checkRequire.push("bmr");
    }
    if (checkRequire.length > 0) {
      return {
        status: "error",
        message: "Field required",
        data: checkRequire.join(", "),
      };
    } else {
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
    }

    // console.log(data);
  }
  async getUserById(id) {
    const table = db("user");
    let data = await table.where("userId", id).first();
    const accessToken = TokenManager.getGenerateAccessToken(data);
    data = {
      ...data,
      accessToken,
    };
    return data;
  }
  async updateUser(id, payload) {
    const table = db("user");

    try {
      const existingUser = await table.where("userId", id).first();
      if (!existingUser) {
        return { status: "not found", message: "User not found" };
      }

      // Merge existing user data with the payload
      let updatedUser;
      if (existingUser.role === "Creator") {
        updatedUser = { ...existingUser, ...payload };
      } else {
        updatedUser = { ...existingUser, ...payload, role: "Attendees" };
      }
      console.log(updatedUser);
      // Update only the fields present in the payload
      await table.where("userId", id).update(updatedUser);

      return { status: "success", message: "Update user success" };
    } catch (error) {
      return { status: "error", message: "Error updating user", error };
    }
  }
}
module.exports = new UserService();
