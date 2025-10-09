const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  res.send(`Dashboard para id ${req.params.id}`);
});

module.exports = router;