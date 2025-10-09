const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Listar todas las solicitudes")
});

router.get("/:id",(req, res) => {
    res.send(`detalle de solicitud para id ${req.params.id}`)
});

router.put("/:id/estado", (req,res) => {
    res.send(`cambiar estado de solicitud para id ${req.params.id}`)
});

module.exports = router;