'use strict';

const { Turno } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Turno.bulkCreate([
        {
          fechaHora: new Date('2025-10-20T09:00:00'),
          estado: 'solicitado',
          notas: 'Primera evaluación',
          afiliadoId: 1,
          integranteId: null,
          prestadorId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          fechaHora: new Date('2025-10-21T10:30:00'),
          estado: 'confirmado',
          notas: 'Sesión de seguimiento',
          afiliadoId: 1,
          integranteId: 2,
          prestadorId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          fechaHora: new Date('2025-10-22T14:00:00'),
          estado: 'realizado',
          notas: 'Control de terapia',
          afiliadoId: 2,
          integranteId: null,
          prestadorId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      console.log('Turnos insertados correctamente');
    } catch (err) {
      console.error('Error insertando turnos:', err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query('TRUNCATE "Turnos" CASCADE;');
      console.log('Turnos eliminados correctamente');
    } catch (err) {
      console.error('Error eliminando turnos:', err);
    }
  }
};