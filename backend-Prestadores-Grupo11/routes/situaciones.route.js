const express = require('express');
const router = express.Router();
const controller = require('../db/controllers/situacionController');
const validateSituacion = require('../middlewares/validateSituacion');

router.get('/afiliado/:id', controller.getByAfiliado);
router.post('/situaciones', validateSituacion, controller.create);
router.put('/situaciones/:id', controller.update);
//router.delete('/situaciones/:id', controller.delete);

module.exports = router;
