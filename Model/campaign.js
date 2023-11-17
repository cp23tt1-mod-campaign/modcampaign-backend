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
}
module.exports = new CampaignDAO();
