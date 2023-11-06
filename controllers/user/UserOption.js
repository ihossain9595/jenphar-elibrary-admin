const { sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

exports._view = async (req, res) => {
  const brand_id = req.query.id;
  const brand_name = req.query.medicine_name;
  res.render("user_option", { title: brand_name, brand_id: brand_id });
};

exports._upload_media = async (req, res) => {
  const brand_id = req.query.brand_id;
  const brand_type = req.query.type;
  const query_data = await sequelize.query(`SELECT * FROM media_list WHERE brand_id = '${brand_id}' AND type = '${brand_type}' ORDER BY id DESC ;`, { type: QueryTypes.SELECT });
  res.render("user_upload", { title: brand_type, id: brand_id, data: query_data });
};
