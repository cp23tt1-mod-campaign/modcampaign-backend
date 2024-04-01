const db = require("../Config/db.js");
const campaignListDTO = require("../DTO/campaignListDTO.js");
const campaignDetailDTO = require("../DTO/campaignDetailDTO.js");
const { dataMapper } = require("../Helper/datamapper.js");
class CampaignDAO {
  async readCampaignList(data) {
    const dataDTO = dataMapper(data, campaignListDTO);
    // console.log(dataDTO);
    // const campaignDTO = data.map((campaign) => {
    //   return {
    //     id: campaign.campaignId,
    //     name: campaign.campaignName,
    //     // description: campaign.campaignDetail,
    //     start: campaign.campaignStart,
    //     end: campaign.campaignEnd,
    //     image: campaign.campaignImageUrl,
    //     // type: campaign.campaignType,
    //     // userLimit: campaign.campaignUserLimit,
    //     // category: campaign.categoryName,
    //     // categoryTarget: campaign.categoryTarget,
    //   };
    // });
    // return campaignDTO;
    return dataDTO;
  }
  async readCampaignById(data) {
    const dataDTO = dataMapper(data, campaignDetailDTO);
    // console.log(dataDTO);
    // const campaignDTO = data.map((campaign) => {
    //   return {
    //     id: campaign.campaignId,
    //     name: campaign.campaignName,
    //     description: campaign.campaignDetail,
    //     start: campaign.campaignStart,
    //     end: campaign.campaignEnd,
    //     type: campaign.campaignType,
    //     image: campaign.campaignImageUrl,
    //     userLimit: campaign.campaignUserLimit,
    //     category: campaign.categoryName,
    //     categoryTarget: campaign.categoryTarget,
    //     user: { name: campaign.username },
    //   };
    // });
    // return campaignDTO;
    return dataDTO;
  }
}
module.exports = new CampaignDAO();
