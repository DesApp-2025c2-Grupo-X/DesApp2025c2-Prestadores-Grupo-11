const express = require('express');
const router = express.Router();

router.get('/afiliado/:id', (req, res) => {
  res.send(`Listar situaciones para id ${req.params.id}`);
});

router.post('/situaciones', (req, res) => {
  res.send('Crear situación');
});

router.put('/situaciones/:id', (req, res) => {
  res.send(`Actualizar situación ${req.params.id}`);
});

router.delete('/situaciones/:id', (req, res) => {
  res.send(`Eliminar situación ${req.params.id}`);
});


module.exports = router;