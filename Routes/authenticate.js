const express = require('express');
const router = express.Router();
const ldapAuth = require('ldapauth-fork');
// const ldapAuth = require('ldapjs')

router.post('/login', async (req, res) => {
  // const resLdap = await authenticate(req.body.userName, req.body.passWord, req.body.role)
  // if (resLdap) {
    res.status(200).send({ 
      message: 'Login success',
      // data: resLdap
    })
  // }else{
  //   res.status(401).send({
  //     message: 'Login fail',
  //     data: resLdap
  //   })
  // }

}
)
// const client = ldapAuth.createClient({
//   url: 'ldaps://ld0620.sit.kmutt.ac.th',
// })
// client.bind('uid=' + username + ',ou=People,ou=' + role + ',dc=sit,dc=kmutt,dc=ac,dc=th', password, 
// (err,user) => {
//   if (err) {
//     console.log(err);
//   }
//   resolve(user)
// })
// const authenticate = async (username, password, role) => {
//   return new Promise((resolve) => {
//     const options = {
//       url: 'ldaps://ld0620.sit.kmutt.ac.th',
//       bindDN: 'uid=' + username + ',ou=People,ou=' + role + ',dc=sit,dc=kmutt,dc=ac,dc=th',
//       bindCredentials: password,
//       searchBase: 'ou=People,ou=' + role + ',dc=sit,dc=kmutt,dc=ac,dc=th',
//       searchFilter: 'uid={{username}}',
//     }
//     console.log(options);
//     const client = new ldapAuth(options)
//     client.authenticate(username, password, (err, user) => {
//       if (err) {
//         resolve(err)
//       }
//       resolve(user)
//     })
//   })
// }

module.exports = router;