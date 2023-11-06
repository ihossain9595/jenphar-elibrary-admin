const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const QuestionListModel = sequelize.define(
    "QuestionListModel",
    {
      quiz_id: Sequelize.INTEGER,
      question: Sequelize.STRING(255),
      option_1: Sequelize.STRING(255),
      option_2: Sequelize.STRING(255),
      option_3: Sequelize.STRING(255),
      option_4: Sequelize.STRING(255),
      answer: {
        type: Sequelize.ENUM,
        values: ["op_1", "op_2", "op_3", "op_4"],
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
      tableName: "question_list",
      createdAt: false,
      updatedAt: false,
    }
  );
  return QuestionListModel;
};
