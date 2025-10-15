const express = require('express');
const router = express.Router();
const controller = require('../db/controllers/prestadorController');
const validarCredenciales = require('../db/middlewares/authMiddleware');

router.post('/', validarCredenciales, controller.login);

module.exports = router;
