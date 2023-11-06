const db = require('../Config/db.js');

class CampaignDAO {
  async readCampaignList() {
      const data = await db('campaign').select()
      // const campaignDAO = data.map((campaign) => {
      //   return {
      //     id: campaign.campaignId,
      //     name: campaign.campaignName,
      //   }
      // })
      return data
  }
  async readCampaignById(campaignId) {
      const data = await db('campaign').where('campaignId', campaignId).select()
      // const campaignDAO = {
      //   id: data[0].campaignId,
      //   name: data[0].campaignName,
      // }
      
      return data
  }
  async createCampaign(campaignData) {
    await db('campaign').insert(campaignData)
  }
  async updateCampaign(campaignId, campaignData) {
    await db('campaign').where('campaignId', campaignId).update(campaignData)
  }
  async deleteCampaign(campaignId) {
    await db('campaign').where('campaignId', campaignId).del()
  }
}
module.exports = new CampaignDAO();
