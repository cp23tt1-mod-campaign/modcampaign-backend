const { dataMapper } = require("../Helper/datamapper.js");
const campaignListDTO = require("../DTO/campaignListDTO.js");
const campaignDetailDTO = require("../DTO/campaignDetailDTO.js");
class CampaignDAO {
  async readCampaignList(data) {
    return dataMapper(data, campaignListDTO);
  }
  async readCampaignById(data) {
    return dataMapper(data[0], campaignDetailDTO);
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
