const { sequelize, MediaListModel } = require("../../models");
const { QueryTypes } = require("sequelize");

exports.get_options = async (req, res) => {
  const brand_id = req.query.id;
  const brand_name = req.query.medicine_name;
  res.render("elibrary/options", { title: brand_name, brand_id: brand_id });
};

exports._upload_media = async (req, res) => {
  const brand_id = req.query.brand_id;
  const type = req.query.type;

  const query_data = await sequelize.query(`SELECT * FROM media_list WHERE brand_id = '${brand_id}' AND type = '${type}'order by id DESC ;`, { type: QueryTypes.SELECT });

  res.render("admin_upload", { title: type, brand_id: brand_id, type: type, data: query_data });
};

exports.delete = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({ success: false, error: err.original.sqlMessage });
  };
  const results = await MediaListModel.destroy({ where: { id: req.body.del_id } }).catch(errorHandler);
  return res.status(200).json({
    success: true,
    result: results,
  });
};
