const { sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

exports.get_brand_list = async (req, res) => {
  const category = req.query.category_name;

  const query_data = await sequelize.query(`SELECT * FROM medicine_list WHERE category = '${category}' ORDER BY medicine_name ASC;`, { type: QueryTypes.SELECT });

  res.render("elibrary/brands", { title: category, data: query_data });
};
