const { sequelize, MediaListModel } = require("../../models");
const { QueryTypes } = require("sequelize");

exports.get_options = async (req, res) => {
  const brand_id = req.query.id;
  const brand_name = req.query.medicine_name;
  res.render("elibrary/options", { title: brand_name, brand_id: brand_id });
};
