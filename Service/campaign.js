const campaignDAO = require("../Model/campaign.js");
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
      return campaignDAO.readCampaignList(data);
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
      return campaignDAO.readCampaignList(data);
    } else {
      const data = await db("campaign")
        .join(
          "User_In_Campaign",
          "campaign.campaignId",
          "User_In_Campaign.campaignId"
        )
        .where("User_In_Campaign.userId", query.userId)
        .select();
      return campaignDAO.readCampaignList(data);
    }

    // const data = await db("campaign")
    //   // .join(join)
    //   .orderBy(orderBy.column, orderBy.direction)
    //   // .where((builder)=>{
    //   //   if(query.listType === "popular") {
    //   //     builder.where('campaign.campaignCategory', query.category)
    //   //   }
    //   // })
    //   .select();

    // return campaignDAO.readCampaignList(data);
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
    return campaignDAO.readCampaignById(data);
  }
  createCampaign(campaignData) {
    return campaignDAO.createCampaign(campaignData);
  }
  updateCampaign(campaignId, campaignData) {
    return campaignDAO.updateCampaign(campaignId, campaignData);
  }
  deleteCampaign(campaignId) {
    return campaignDAO.deleteCampaign(campaignId);
  }
}
module.exports = new CampaignService();
