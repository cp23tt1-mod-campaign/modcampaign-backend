const db = require("../Config/db.js");

class CampaignCategoriesService {
  async readCampaignCategories() {
    const table = db("campaignCategory");
    const data = await table.select();
    return data;
  }
}
module.exports = new CampaignCategoriesService();
