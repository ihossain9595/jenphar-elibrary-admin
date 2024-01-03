const { DataTypes } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const PosterModel = sequelize.define(
    "PosterModel",
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
      poster_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "poster_image",
      },
      poster_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "poster_link",
      },
      poster_status: {
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
      tableName: "poster",
      createdAt: false,
      updatedAt: false,
    }
  );
  
  return PosterModel;
};
