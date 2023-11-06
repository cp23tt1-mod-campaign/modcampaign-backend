const express = require('express');
const router = express.Router();
// const db = require('../Config/db.js');
// const { readCampaignList, readCampaignId } = require('../Controllers/campaign');
const CampaignController = require('../Controllers/campaign');

// router.get('/getAttendList', read );
// router.route('/getAttendList')
//   .get(read);

// router.get('/campaign', readCampaignList)
// router.get('/campaign', (req, res) => {
//   // console.log(req.query);
//   // console.log(req.headers.authorization);
//   db('campaign').then(data => {
//     res.status(200).send({
//       message: 'Get campaign success',
//       data: data
//     })
//   }).catch(err => {
//     res.status(500).send({
//       message: 'Get campaign fail',
//       data: err
//     })
//   })
// })

router.route('/campaign')
  .get(CampaignController.readCampaignList)
  .post(CampaignController.createCampaign)

router.route('/campaign/:id')
  .get(CampaignController.readCampaignById)
  .patch(CampaignController.updateCampaign)
  .delete(CampaignController.deleteCampaign)


// router.get('/campaign/:id', readCampaignId)
// router.get('/campaign/:id', (req, res) => {
//   const { id } = req.params;
//   db('campaign').where('campaignId', id).then(data => { 
//     res.status(200).send({
//       message: 'Get campaign success',
//       data: data
//     })
//    }
//   ).catch(err => {  
//     res.status(500).send({
//       message: 'Get campaign fail',
//       data: err
//     })
//   })
// })


router.get('/getPersonalHealth/:id', (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  res.send(`Your personal health id is: ${id}`);

});

router.post('/createCampaign', (req, res) => {
  // const body = req.body;
  const jsonBody = JSON.stringify(req.body);
  console.log(jsonBody);
  console.log(req.body);

  res.status(201)
  res.send(`Your campaign is created`);
});


module.exports = router;