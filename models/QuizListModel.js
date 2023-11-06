const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const QuizListModel = sequelize.define(
    "QuizListModel",
    {
      name: Sequelize.STRING(255),
      time_duration: Sequelize.INTEGER,
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
