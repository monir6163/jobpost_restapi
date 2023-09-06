'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preparetion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Preparetion.init({
    title: DataTypes.STRING,
    source: DataTypes.STRING,
    content: DataTypes.STRING,
    image: DataTypes.STRING,
    catId: DataTypes.STRING,
    viewCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Preparetion',
  });
  return Preparetion;
};