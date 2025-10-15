const express = require('express');
const router = express.Router();
const controller = require('../db/controllers/prestadorController');

router.post('/', controller.login);

module.exports = router;