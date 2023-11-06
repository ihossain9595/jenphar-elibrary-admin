const { sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

exports._view = async (req, res) => {
  const category = req.query.category;
  console.log("ISMAIL HOSSAIN", category);

  const query_data = await sequelize.query(`SELECT * FROM quiz_list WHERE category = '${category}' ORDER BY id DESC;`, { type: QueryTypes.SELECT });

  res.render("quiz/user_quiz_category", { title: category, data: query_data });
};
