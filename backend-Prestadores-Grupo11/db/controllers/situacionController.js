const { Situacion, Integrante } = require('../../models');

module.exports = {
  // Obtener todas las situaciones del grupo familiar de un afiliado
  async getByAfiliado(req, res) {
    try {
      const afiliadoId = req.params.id;

      const integrantes = await Integrante.findAll({
        where: { afiliadoId },
        include: [{ model: Situacion, as: 'situaciones' }]
      });

      if (!integrantes.length) {
        return res.status(404).json({ message: 'No se encontraron integrantes para este afiliado.' });
      }

      res.status(200).json(integrantes);
    } catch (error) {
      console.error('Error en getByAfiliado:', error);
      res.status(500).json({ message: 'Error al obtener las situaciones.' });
    }
  },

  //Crear (dar de alta) una situación terapéutica
  async create(req, res) {
    try {

      const { titulo, estado, integranteId, fechaFin } = req.body;

      const nuevaSituacion = await Situacion.create({
        titulo,
        estado,
        integranteId,
        fechaFin: fechaFin || null
      });

      res.status(201).json({
        message: 'Situación creada correctamente.',
        situacion: nuevaSituacion
      });
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({ message: 'Error al crear la situación.' });
    }
  },

  //Modificar fecha de finalización o estado de una situación
  async update(req, res) {
    try {
      const { id } = req.params;
      const { fechaFin, estado } = req.body;

      const situacion = await Situacion.findByPk(id);
      if (!situacion) {
        return res.status(404).json({ message: 'Situación no encontrada.' });
      }

      if (fechaFin !== undefined) situacion.fechaFin = fechaFin;
      if (estado !== undefined) situacion.estado = estado;

      await situacion.save();

      res.status(200).json({
        message: 'Situación actualizada correctamente.',
        situacion
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({ message: 'Error al actualizar la situación.' });
    }
  }
};
