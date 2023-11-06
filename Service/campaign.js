const campaignDAO = require('../Dao/campaign.js');

class CampaignService {
  readCampaignList() {
    return campaignDAO.readCampaignList()
  }
  readCampaignById(id) {
    return campaignDAO.readCampaignById(id)
  }
  createCampaign(campaign) {
    return campaignDAO.createCampaign(campaign)
  }
}
module.exports = new CampaignService();