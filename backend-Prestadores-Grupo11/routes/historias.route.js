const express = require("express");
const router = express.Router();

router.get('/afiliado/:id', (req, res) => {
  res.send(`Historia clínica para id ${req.params.id}`);
});

module.exports = router;