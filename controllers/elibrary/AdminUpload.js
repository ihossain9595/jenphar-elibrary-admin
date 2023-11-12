const path = require("path");
const multer = require("multer");

const { sequelize, MediaListModel } = require("../../models");
const { QueryTypes } = require("sequelize");

exports.uploads = [
  async (req, res, next) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads/");
      },
      filename: function (req, file, cb) {
        const originalnameWithoutExtension = path.parse(file.originalname).name;
        const filename = originalnameWithoutExtension + "_" + Date.now() + path.extname(file.originalname);
        cb(null, filename);
      },
    });

    const uploads = multer({
      storage: storage,
      limits: { fileSize: 100 * 1024 * 1024 },
    }).array("files", 30);

    uploads(req, res, async (err) => {
      console.log(req.files);

      const brand_id = req.body.brand_id;
      const type = req.body.type;

      const errorHandler = (err) => {
        req.flash("error", err.original.sqlMessage);
        res.redirect(`/admin/e-library/upload?type='${getType}'&brand_id='${getBrandId}'`);
      };

      let data = [];
      for (let i = 0; i < req.files.length; i++) {
        let text = req.files[i].mimetype;
        const splitText = text.split("/");
        let word = splitText[0];
        let file_type;

        switch (word) {
          case "image":
            file_type = "img";
            break;
          case "video":
            file_type = "video";
            break;
          case "application":
            file_type = "pdf";
        }

        data.push({
          brand_id: brand_id,
          file: req.files[i].filename,
          file_type: file_type,
          type: type,
        });
        console.log("FILENAME 2: ", req.files[i].filename);
      }
      console.log("DATA: ", data);

      const insertDataList = await MediaListModel.bulkCreate(data).catch(errorHandler);

      req.flash("success", "Data upload successfully.");
      res.redirect("/admin/e-library/upload?type=" + type + "&brand_id=" + brand_id);
    });
  },
];
