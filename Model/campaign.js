const db = require("../Config/db.js");

class CampaignDAO {
  async readCampaignList(data) {
    const campaignDTO = data.map((campaign) => {
      return {
        id: campaign.campaignId,
        name: campaign.campaignName,
        // description: campaign.campaignDetail,
        start: campaign.campaignStart,
        end: campaign.campaignEnd,
        // type: campaign.campaignType,
        // userLimit: campaign.campaignUserLimit,
        // category: campaign.categoryName,
        // categoryTarget: campaign.categoryTarget,
      };
    });
    return campaignDTO;
  }
  async readCampaignById(data) {
    const campaignDTO = data.map((campaign) => {
      return {
        id: campaign.campaignId,
        name: campaign.campaignName,
        description: campaign.campaignDetail,
        start: campaign.campaignStart,
        end: campaign.campaignEnd,
        type: campaign.campaignType,
        image: campaign.campaignImage,
        userLimit: campaign.campaignUserLimit,
        category: campaign.categoryName,
        categoryTarget: campaign.categoryTarget,
        userOwner: campaign.userId,
      };
    });
    return campaignDTO;
  }
  // async createCampaign(campaignData) {
  //   await db("campaign").insert(campaignData);
  // }
  // async updateCampaign(campaignId, campaignData) {
  //   await db("campaign").where("campaignId", campaignId).update(campaignData);
  // }
  // async deleteCampaign(campaignId) {
  //   await db("campaign").where("campaignId", campaignId).del();
  // }
}
module.exports = new CampaignDAO();
