const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const AnswerListModel = sequelize.define(
    "AnswerListModel",
    {
      user_id: Sequelize.INTEGER,
      quiz_id: Sequelize.INTEGER,
      answer: Sequelize.STRING(255),
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
      tableName: "answer_list",
      createdAt: false,
      updatedAt: false,
    }
  );
  return AnswerListModel;
};
