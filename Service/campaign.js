const campaignModel = require("../Model/campaign.js");
const db = require("../Config/db.js");
const { google } = require("googleapis");
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
      table.whereNotExists((notExist) => {
        notExist
          .select("*")
          .from("UserInCampaign")
          .whereRaw("UserInCampaign.campaignId = campaign.campaignId")
          .andWhere("UserInCampaign.userId", userId);
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
      table.whereNotExists((notExist) => {
        notExist
          .select("*")
          .from("UserInCampaign")
          .whereRaw("UserInCampaign.campaignId = campaign.campaignId")
          .andWhere("UserInCampaign.userId", userId);
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
    const table = db("campaign");
    let data;
    table.join(
      "campaignCategory",
      "campaign.campaignCategoryId",
      "=",
      "campaignCategory.campaignCategoryId"
    );
    table.join("user", "campaign.userId", "=", "user.userId");
    table.where("campaignId", campaignId);
    data = await table.select();
    if (data.length === 0) {
      return { status: "notFound", message: "Campaign not found" };
    } else {
      return campaignModel.readCampaignById(data);
    }
    // return data;
  }
  async createCampaign(campaignData) {
    const table = db("campaign");
    return table.insert(campaignData);
    // return await db("campaign").insert(campaignData);
    // return campaignModel.createCampaign(campaignData);
  }
  async updateCampaign(campaignId, campaignData) {
    const table = db("campaign");
    table.where("campaignId", campaignId);
    return table.update(campaignData);
    // return await db("campaign")
    //   .where("campaignId", campaignId)
    //   .update(campaignData);
    // return campaignModel.updateCampaign(campaignId, campaignData);
  }
  async deleteCampaign(campaignId) {
    const table = db("campaign");
    // return await
    const isExist = await table.where("campaignId", campaignId);
    // const isExist = await db("campaign").where("campaignId", campaignId);
    if (isExist.length === 0) {
      return { status: "notFound", message: "Campaign not found" };
    } else {
      table.where("campaignId", "=", campaignId);
      table.where("campaignEnd", "<", new Date());
      const rowAffected = table.del();

      // const rowAffected = await db("campaign")
      //   .where("campaignId", "=", campaignId)
      //   .where("campaignEnd", "<", new Date())
      //   .del();
      if (rowAffected === 0) {
        return { status: "error", message: "Campaign is not ended yet" };
      } else {
        return { status: "success", message: "Campaign is deleted" };
      }
    }
  }
  async uploadImage(imgData) {
    const CLIENT_ID =
      "111856545179-m9ptsndmdagfhgov9ni0rd5i1f9osbc0.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN =
      "1//041mpcewaEiyzCgYIARAAGAQSNwF-L9Irn0udX6xXveJbwgisnksyRDvW4byTXy8ddGxrgXaiwwufjnRVJcY9qMrjyd90nYcKqMU";
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const filePath = path.join(imgData.path);
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });
    try {
      const res = await drive.files.create({
        requestBody: {
          name: imgData.filename,
          mimeType: "image/jpg",
          parents: ["1L5oH1YIVKlXpZJZwdLtLDc5JozoWCiBM"],
        },
        media: {
          mimeType: "image/jpg",
          body: fs.createReadStream(filePath),
        },
      });
      fs.unlink(filePath, (err) => {
        if (err) console.log(err);
      });

      return res.data;
    } catch (error) {
      return error.message;
    }
  }
  async joinCampaign(data) {
    const { userId, campaignId } = data;

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
          await tableUserInCampaign.insert(userId, campaignId);
          return { status: "success", message: "Join campaign success" };
        }
      }
    } else {
      return { status: "error", message: "You already joined this campaign" };
    }
  }
}
module.exports = new CampaignService();
