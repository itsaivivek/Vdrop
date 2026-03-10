const express = require('express');
const router = express.Router();


/* /user/test */
router.get('/test', (req, res) => {
  res.send('user Test route')
}
)


module.exports = router;