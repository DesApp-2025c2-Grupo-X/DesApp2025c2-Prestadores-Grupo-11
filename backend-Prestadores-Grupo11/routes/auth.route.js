const express = require('express');
const router = express.Router();
const prestadorController = require('../db/controllers/prestadorController');

router.get('/', prestadorController.getPrestadores)
//router.post('/', controller.login);

module.exports = router;