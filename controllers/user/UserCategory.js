const { sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

exports._view = async (req, res) => {
  const category = req.query.category_name;

  const query_data = await sequelize.query(`SELECT * FROM medicine_list WHERE category = '${category}' ORDER BY medicine_name ASC;`, { type: QueryTypes.SELECT });

  res.render("user_category", { title: category, data: query_data });
};
