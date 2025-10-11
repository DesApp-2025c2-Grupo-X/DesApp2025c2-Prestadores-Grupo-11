const { Situacion, Integrante } = require('../models');

module.exports = {
  async getByAfiliado(req, res) {
    try {
      const { id } = req.params;
      const integrantes = await Integrante.findAll({
        where: { afiliadoId: id },
        include: { model: Situacion, as: 'situaciones' }
      });

      const situaciones = integrantes.flatMap(i => i.situaciones);
      res.status(200).json(situaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener situaciones' });
    }
  },

  async create(req, res) {
    try {
      const nueva = await Situacion.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear situación' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Situacion.update(req.body, { where: { id } });
      if (!updated) return res.status(404).json({ error: 'Situación no encontrada' });
      res.status(200).json({ message: 'Situación actualizada' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar situación' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Situacion.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ error: 'Situación no encontrada' });
      res.status(200).json({ message: 'Situación eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar situación' });
    }
  }
};