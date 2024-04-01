const campaignModel = require("../Model/campaign.js");
const db = require("../Config/db.js");
const { google } = require("googleapis");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");

class CampaignService {
  async readCampaignList(query) {
    const { listType, status, userId } = query;
    const table = db("campaign");
    let data;
    if (listType === "latest") {
      table.join(
        "campaignCategory",
        "campaign.campaignCategoryId",
        "=",
        "campaignCategory.campaignCategoryId"
      );
      table.andWhere("campaign.campaignEnd", ">", new Date().toISOString());
      table.whereNotExists((notExist) => {
        notExist
          .select("*")
          .from("userInCampaign")
          .whereRaw("userInCampaign.campaignId = campaign.campaignId")
          .andWhere("userInCampaign.userId", userId);
      });
      table.orderBy("campaign.campaignId", "desc");
      data = await table.select();
    } else if (listType === "popular") {
      table
        .join(
          db("userInCampaign")
            .select("campaignId")
            .count("* as count")
            .groupBy("campaignId")
            .as("uic"),
          "uic.campaignId",
          "campaign.campaignId"
        )
        .join(
          "campaignCategory as cc",
          "campaign.campaignCategoryId",
          "cc.campaignCategoryId"
        );
      table.andWhere("campaign.campaignEnd", ">", new Date().toISOString());
      table.whereNotExists((notExist) => {
        notExist
          .select("*")
          .from("userInCampaign")
          .whereRaw("userInCampaign.campaignId = campaign.campaignId")
          .andWhere("userInCampaign.userId", userId);
      });
      table.orderBy("uic.count", "desc");
      data = await table.select();
    } else if (listType === "joined") {
      table.join(
        "userInCampaign",
        "campaign.campaignId",
        "userInCampaign.campaignId"
      );
      table.where("userInCampaign.userId", userId);
      // table.andWhere("campaign.campaignEnd", ">", new Date().toISOString());
      // table.orderBy("campaign.campaignId", "desc");
      table.orderBy("campaign.campaignEnd", "desc");
      data = await table.select();
    } else if (listType === "owned") {
      table.where("userId", userId);
      table.andWhere("campaignEnd", ">", new Date().toISOString());
      data = await table.select();
    }

    if (status === "ongoing") {
      table.join(
        "campaignCategory",
        "campaign.campaignCategoryId",
        "=",
        "campaignCategory.campaignCategoryId"
      );
      table.where("userId", userId);
      table.andWhere("campaignEnd", ">", new Date().toISOString());
      data = await table.select();
    } else if (status === "ended") {
      table.join(
        "campaignCategory",
        "campaign.campaignCategoryId",
        "=",
        "campaignCategory.campaignCategoryId"
      );
      table.where("userId", userId);
      table.andWhere("campaignEnd", "<", new Date().toISOString());
      data = await table.select();
    }
    return campaignModel.readCampaignList(data);
  }
  async readCampaignById(campaignId) {
    const campaignTable = db("campaign");
    const userInCampaignTable = db("userInCampaign");
    let data;
    campaignTable.join(
      "campaignCategory",
      "campaign.campaignCategoryId",
      "=",
      "campaignCategory.campaignCategoryId"
    );
    campaignTable.join("user", "campaign.userId", "=", "user.userId");
    campaignTable.where("campaignId", campaignId);
    data = await campaignTable.select().first();

    // userInCampaignTable.join(
    //   "user",
    //   "userInCampaign.userId",
    //   "=",
    //   "user.userId"
    // );
    // userInCampaignTable
    //   .where("campaignId", campaignId)
    //   .orderBy("targetValue", "desc");

    // const data2 = await userInCampaignTable.select(
    //   "userInCampaign.userId",
    //   "campaignId",
    //   "targetValue",
    //   "displayName"
    // );
    // console.log(data2);
    // data.leaderBoard = data2;
    if (data) {
      return campaignModel.readCampaignById(data);
    } else {
      return { status: "notFound", message: "Campaign not found" };
    }
    // return data;
  }
  async getLeaderBoard(campaignId, userId, limit) {
    const checkRequire = [];
    if (!campaignId) {
      checkRequire.push("campaignId");
    }
    if (!userId) {
      checkRequire.push("userId");
    }
    if (!limit) {
      checkRequire.push("limit");
    }

    if (checkRequire.length > 0) {
      return {
        status: "error",
        message: "Field required",
        data: checkRequire.join(", "),
      };
    } else {
      const table = db("userInCampaign");
      table.join("user", "userInCampaign.userId", "=", "user.userId");
      table.where("campaignId", campaignId);
      table.orderBy("targetValue", "desc");
      let currentUserData = {};

      const data = await table.select(
        "userInCampaign.userId",
        "profileImage",
        "campaignId",
        "targetValue",
        "displayName",
        "userInCampaign.joinedDate"
      );
      data.map((user, index) => {
        if (user.userId === +userId) {
          currentUserData.profileImage = user.profileImage;
          currentUserData.displayName = user.displayName;
          currentUserData.targetValue = user.targetValue;
          currentUserData.rank = data.indexOf(user) + 1;
          currentUserData.joinedDate = user.joinedDate;
        }
        data[index].rank = data.indexOf(user) + 1;
      });
      // console.log(data.slice(0, limit));
      let dataReturn;
      if (parseInt(limit)) {
        // table.limit(limit);
        dataReturn = data.slice(0, limit);
      } else {
        dataReturn = data;
      }
      const returnData = {
        leaderBoard: dataReturn,
        currentUserData,
      };

      // console.log(currentUserData);
      // return returnData;
      return {
        status: "success",
        message: "Get leader board success ",
        data: returnData,
      };
    }
  }
  async updateLeaderBoard(campaignId, userId, targetValue) {
    console.log(campaignId, userId, targetValue);
    const table = db("userInCampaign");
    table.where("campaignId", campaignId);
    table.andWhere("userId", userId);
    const isExist = await table.select();
    if (isExist.length === 0) {
      return { status: "error", message: "User is not joined this campaign" };
    } else {
      table.where("campaignId", campaignId);
      table.andWhere("userId", userId);
      const res = await table.update({ targetValue });
      console.log(res);

      return { status: "success", message: "Update leader board success" };
    }
  }
  async createCampaign(campaignData) {
    // console.log(campaignData.campaignName);
    const checkRequire = [];
    if (!campaignData.campaignName) {
      return { status: "error", message: "Campaign name is required" };
    }
    if (!campaignData.campaignDetail) {
      return { status: "error", message: "Campaign detail is required" };
    }
    if (!campaignData.campaignStart) {
      return { status: "error", message: "Campaign start is required" };
    }
    if (!campaignData.campaignEnd) {
      return { status: "error", message: "Campaign end is required" };
    }
    if (!campaignData.campaignType) {
      return { status: "error", message: "Campaign type is required" };
    }
    if (!campaignData.campaignImageUrl) {
      return { status: "error", message: "Campaign image is required" };
    }
    if (!campaignData.campaignReward) {
      return { status: "error", message: "Campaign reward is required" };
    }
    if (!campaignData.campaignCategoryId) {
      return { status: "error", message: "Campaign category is required" };
    }
    if (!campaignData.userId) {
      return { status: "error", message: "User id is required" };
    }

    const table = db("campaign");

    table.where("campaignName", campaignData.campaignName);
    const uniqueNameValidate = await table.select();
    console.log(uniqueNameValidate);
    if (uniqueNameValidate.length > 0) {
      return { status: "error", message: "Campaign name must be unique" };
    } else {
      await table.insert(campaignData);
      return { status: "success", message: "Create campaign success" };
    }
  }
  async updateCampaign(campaignId, campaignData) {
    const table = db("campaign");
    table.where("campaignId", campaignId);
    return table.update(campaignData);
  }
  async deleteCampaign(campaignId, userId) {
    const table = db("campaign");
    // return await
    const isExist = await table.where("campaignId", campaignId);
    // const isExist = await db("campaign").where("campaignId", campaignId);
    if (isExist.length === 0) {
      return { status: "notFound", message: "Campaign not found" };
    } else {
      table.where("campaignId", "=", campaignId);
      const result = await table.select();
      const campaignEndDate = result[0].campaignEnd;
      const ownedUserId = result[0].userId;
      const currentDate = new Date();
      if (ownedUserId === parseInt(userId)) {
        if (campaignEndDate < currentDate) {
          return { status: "error", message: "Campaign is ended" };
        } else {
          table.where("campaignId", campaignId);
          await table.del();
          return { status: "success", message: "Campaign is deleted" };
        }
      } else {
        return {
          status: "error",
          message: "You are not the owner of this campaign",
        };
      }
      // const rowAffected = await db("campaign")
      //   .where("campaignId", "=", campaignId)
      //   .where("campaignEnd", "<", new Date())
      //   .del();
    }
  }
  async uploadImage(imgData) {
    let projectId = "modcampaign";
    let keyFilename = "adminKey.json";
    const storage = new Storage({ projectId, keyFilename });
    const bucket = storage.bucket("modcampaign-images");
    // });
    try {
      console.log("Try to upload");
      // const filePath = path.join(imgData.path);
      // console.log(imgData.originalname);
      // const filePath = path.join(
      //   __dirname,
      //   `../Service/fileUploads/${imgData.originalname}}`
      // );
      const filePath = path.join(
        __dirname,
        `../Service/fileUploads/${imgData.originalname}`
      );
      console.log(filePath);
      const bucketFile = bucket.file(imgData.originalname);

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(
            bucketFile.createWriteStream({
              metadata: {
                contentType: imgData.mimetype,
              },
              resumable: false,
            })
          )
          .on("error", (error) => {
            console.log(error);
            reject(error);
          })
          .on("finish", async () => {
            try {
              // Make the file public
              // await bucketFile.makePublic();

              // Construct the public URL
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${imgData.filename}`;

              console.log("File uploaded successfully. Public URL:", publicUrl);

              // Clean up: delete the local file

              // Resolve the promise with the image file name
              resolve(imgData.filename);
              fs.unlink(filePath, (err) => {
                if (err) console.log(err);
              });
            } catch (error) {
              console.log("Error making file public:", error.message);
              // Reject the promise with the error
              reject(error);
            }
          });
      });

      // Return the image file name in the response
      return {
        success: true,
        fileName: imgData.filename,
        message: "Upload campaign image success",
      };
    } catch (error) {
      console.log("Error during file upload:", error.message);
      // Return an error response
      return {
        success: false,
        message: "Upload campaign image failed",
        error: error.message,
      };
    }
  }
  async joinCampaign(data) {
    console.log(data);
    const { userId, campaignId, targetValue, joinedDate } = data;

    const tableUserInCampaign = db("userInCampaign");
    const tableCampaign = db("campaign");

    tableUserInCampaign.where("userId", userId);
    tableUserInCampaign.andWhere("campaignId", campaignId);
    const isExist = await tableUserInCampaign.select();

    if (isExist.length === 0) {
      tableCampaign.where("campaignId", campaignId);
      const resCampaign = await tableCampaign.select("campaignUserLimit");
      const campaignLimit = resCampaign[0].campaignUserLimit;

      tableUserInCampaign.count("* as userCount");
      tableUserInCampaign.where("campaignId", campaignId);
      const resUserInCampaign = await tableUserInCampaign.select();
      const userCount = resUserInCampaign[0].userCount;

      if (campaignLimit) {
        if (userCount >= campaignLimit) {
          return { status: "error", message: "Campaign is full" };
        } else {
          await tableUserInCampaign.insert({
            campaignId,
            userId,
          });

          return { status: "success", message: "Join campaign success" };
        }
      } else {
        await tableUserInCampaign.insert({
          campaignId,
          userId,
          targetValue,
          joinedDate,
        });
        return { status: "success", message: "Join campaign success" };
      }
    } else {
      return { status: "error", message: "You already joined this campaign" };
    }
  }
}
module.exports = new CampaignService();
