const campaignModel = require("../Model/campaign.js");
const db = require("../Config/db.js");

class CampaignService {
  async readCampaignList(query) {
    // let orderBy = {};
    // let join = {}
    if (query.listType === "latest") {
      const data = await db("campaign")
        .join(
          "campaignCategory",
          "campaign.campaignCategoryId",
          "=",
          "campaignCategory.campaignCategoryId"
        )
        .orderBy("campaign.campaignId", "desc")
        .select();
      return campaignModel.readCampaignList(data);
    } else if (query.listType === "popular") {
      const data = await db("campaign as c")
        .join(
          db("User_In_Campaign")
            .select("campaignId")
            .count("* as count")
            .groupBy("campaignId")
            .as("userInCampaign"),
          "userInCampaign.campaignId",
          "c.campaignId"
        )
        .join(
          "campaignCategory as cc",
          "c.campaignCategoryId",
          "cc.campaignCategoryId"
        )
        .orderBy("userInCampaign.count", "desc")
        .select();
      // return data;
      return campaignModel.readCampaignList(data);
    } else {
      const data = await db("campaign")
        .join(
          "User_In_Campaign",
          "campaign.campaignId",
          "User_In_Campaign.campaignId"
        )
        .where("User_In_Campaign.userId", query.userId)
        .select();
      return campaignModel.readCampaignList(data);
    }
  }
  async readCampaignById(campaignId) {
    const data = await db("campaign")
      .join(
        "campaignCategory",
        "campaign.campaignCategoryId",
        "=",
        "campaignCategory.campaignCategoryId"
      )
      .where("campaignId", campaignId)
      .select();
    return campaignModel.readCampaignById(data);
  }
  async createCampaign(campaignData) {
    return await db("campaign").insert(campaignData);
    // return campaignModel.createCampaign(campaignData);
  }
  async updateCampaign(campaignId, campaignData) {
    return await db("campaign")
      .where("campaignId", campaignId)
      .update(campaignData);
    // return campaignModel.updateCampaign(campaignId, campaignData);
  }
  async deleteCampaign(campaignId) {
    return await db("campaign").where("campaignId", campaignId).del();
    // return campaignModel.deleteCampaign(campaignId);
  }
}
module.exports = new CampaignService();
