const { deleteCampaign } = require('../Controllers/campaign.js');
const campaignDAO = require('../Dao/campaign.js');

class CampaignService {
  readCampaignList() {
    return campaignDAO.readCampaignList()
  }
  readCampaignById(campaignId) {
    return campaignDAO.readCampaignById(campaignId)
  }
  createCampaign(campaignData) {
    return campaignDAO.createCampaign(campaignData)
  }
  updateCampaign(campaignId, campaignData) {
    return campaignDAO.updateCampaign(campaignId, campaignData)
  } 
  deleteCampaign(campaignId) {
    return campaignDAO.deleteCampaign(campaignId)
  }
}
module.exports = new CampaignService();