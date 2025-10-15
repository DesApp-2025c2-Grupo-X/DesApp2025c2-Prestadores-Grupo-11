'use strict';

const { Afiliado, Integrante, Situacion } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const afiliadosData = [
      {
        apellido: "Perez",
        integrantes: [
          {
            nombre: "Juancito Perez",
            edad: 35,
            dni: "25097345",
            situaciones: [
              { titulo: "Terapia Cognitiva", estado: "En proceso" },
              { titulo: "Sesiones Familiares", estado: "Terminada" },
              { titulo: "Apoyo Escolar", estado: "Terminada" }
            ]
          },
          {
            nombre: "Maria Perez",
            edad: 33,
            dni: "23001224",
            situaciones: [
              { titulo: "Tratamiento Ansiedad", estado: "Terminada" },
              { titulo: "Terapia de Pareja", estado: "Terminada" }
            ]
          }
        ]
      },
      {
        apellido: "Gonzalez",
        integrantes: [
          {
            nombre: "Carlos Gonzalez",
            edad: 45,
            dni: "28011452",
            situaciones: [
              { titulo: "Tratamiento de estrés", estado: "Terminada" }
            ]
          }
        ]
      }
    ];

    for (const afiliado of afiliadosData) {
      try {
        await Afiliado.create(
          {
            apellido: afiliado.apellido,
            integrantes: afiliado.integrantes.map(i => ({
              nombre: i.nombre,
              edad: i.edad,
              dni: i.dni,
              situaciones: i.situaciones
            }))
          },
          {
            include: [
              {
                model: Integrante,
                as: 'integrantes',
                include: [
                  { model: Situacion, as: 'situaciones' }
                ]
              }
            ]
          }
        );
        console.log(`Afiliado ${afiliado.apellido} insertado correctamente`);
      } catch (err) {
        console.error(`Error insertando afiliado ${afiliado.apellido}:`, err);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await Situacion.destroy({ where: {} });
    await Integrante.destroy({ where: {} });
    await Afiliado.destroy({ where: {} });
  }
};