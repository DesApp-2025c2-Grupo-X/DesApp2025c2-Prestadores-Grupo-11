'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Afiliado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Afiliado.hasMany(models.Integrante, {  // Un afiliado tiene muchos integrantes
        foreignKey: 'afiliadoId',
        as: 'integrantes'                   // Alias para incluirlos en queries
      });
    }
  }
  Afiliado.init({
    apellido: {type: DataTypes.STRING, allowNull: false}
  }, {
    sequelize,
    modelName: 'Afiliado',
  });
  return Afiliado;
};