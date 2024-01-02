const { DataTypes } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const QuizListModel = sequelize.define(
    "QuizListModel",
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: true,
        comment: null,
        field: "id",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "name",
      },
      time_duration: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "time_duration",
      },
      total_points: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "total_points",
      },
      category: {
        type: Sequelize.ENUM,
        values: ["Hematology", "Oncology", "Virology", "Combined"],
      },
      start_time: {
        type: "DATETIME",
        allowNull: true,
        defaultValue: Sequelize.literal("NULL"),
      },
      end_time: {
        type: "DATETIME",
        allowNull: true,
        defaultValue: Sequelize.literal("NULL"),
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Published", "Unpublished"],
      },
      created_at: {
        type: "TIMESTAMP",
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: "DATETIME",
        allowNull: true,
        defaultValue: Sequelize.literal("NULL"),
      },
    },
    {
      tableName: "quiz_list",
      createdAt: false,
      updatedAt: false,
    }
  );
  
  return QuizListModel;
};
