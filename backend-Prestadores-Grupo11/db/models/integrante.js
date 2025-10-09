'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Integrante extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Cada integrante pertenece a un afiliado
      Integrante.belongsTo(models.Afiliado, { 
        foreignKey: 'afiliadoId',
        as: 'afiliado'
      });

      // Cada integrante tiene muchas situaciones
        Integrante.hasMany(models.Situacion, {
          foreignKey: 'integranteId',
          as: 'situaciones'
        });
      }
  }
  Integrante.init({
    nombre: {type: DataTypes.STRING, allowNull: false},
    edad: {type: DataTypes.INTEGER, allowNull: false},
    dni: {type: DataTypes.STRING, allowNull: false},
    afiliadoId: {type: DataTypes.INTEGER}
  }, {
    sequelize,
    modelName: 'Integrante',
  });
  return Integrante;
};