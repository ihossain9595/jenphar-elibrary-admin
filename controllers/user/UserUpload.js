const { sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

exports._upload = async (req, res) => {
  const file_url = req.params.file_url;
  res.render("user_file", { title: "PDF", file_url: file_url });
};
