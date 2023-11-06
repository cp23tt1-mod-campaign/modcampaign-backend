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
  async readCampaignById(id) {
      const data = await db('campaign').where('campaignId', id).select()
      // const campaignDAO = {
      //   id: data[0].campaignId,
      //   name: data[0].campaignName,
      // }
      
      return data
  }
  async createCampaign(campaign) {
    console.log(campaign);
    // console.log("🚀 ~ file: campaign.js:24 ~ CampaignDAO ~ createCampaign ~ campaign:", campaign)
    const data = await db('campaign').insert(campaign)
    console.log("🚀 ~ file: campaign.js:27 ~ CampaignDAO ~ createCampaign ~ data:", data)

    // return campaign
    // return data
  }
}
module.exports = new CampaignDAO();
