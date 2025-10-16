const express = require("express");
const router = express.Router();
const controller = require('../db/controllers/afiliadoController');

router.get('/afiliado/:id', controller.getHistoriaClinica);

module.exports = router;