const multer = require("multer");

const { MedicineListModel } = require("../../models");
const { QueryTypes } = require("sequelize");

exports.upload = [
  async (req, res, next) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/images/medicines/");
      },
      filename: function (req, file, cb) {
        const temp_file_arr = file.originalname.split(".");
        const temp_file_name = temp_file_arr[0];
        const temp_file_extension = temp_file_arr[1];

        const filename = temp_file_name + "_" + Date.now() + "." + temp_file_extension;

        cb(null, filename);
      },
    });

    const upload = multer({
      storage: storage,
    }).single("brand_logo");

    upload(req, res, async (err) => {
      let medicine_name = req.body.medicine_name;
      let category = req.body.category;

      console.log(category);

      let data = [];

      const errorHandler = (err) => {
        req.flash("error", err);
        res.redirect("/elibrary/add_medicine");
      };

      data.push({
        category: category,
        medicine_name: medicine_name,
        brand_logo: req.file.filename,
        status: 1,
      });

      const insertDataList = await MedicineListModel.create(data[0]).catch(errorHandler);

      req.flash("success", "Data upload successfully.");
      res.redirect("/elibrary/add_medicine");
    });
  },
];
