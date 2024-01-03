const multer = require("multer");
const path = require("path");
const { sequelize, PosterModel } = require("../../models");
const { QueryTypes } = require("sequelize");

exports.get_poster = async (req, res, next) => {
  const errorHandler = (err) => {
    req.flash("error", err.original.sqlMessage);
    res.redirect("/poster");
  };

  let result = await PosterModel.findOne({ where: { id: 1 } }).catch(errorHandler);

  res.render("poster", {
    title: "Poster",
    id: result.id,
    poster_image: result.poster_image,
    poster_link: result.poster_link,
    poster_status: result.poster_status,
  });
};

exports.post_poster = [
  async (req, res, next) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/images/posters/");
      },
      filename: (req, file, cb) => {
        cb(null, "poster_" + Date.now() + path.extname(file.originalname));
      },
    });

    const upload = multer({
      storage: storage,
    }).single("poster_image");

    upload(req, res, async (err) => {
      let poster_image;
      let poster_link = req.body.poster_link;
      let poster_status = req.body.poster_status;

      if (!req.file?.filename) {
        poster_image = "poster.png";
      } else {
        poster_image = req.file.filename;
      }
      
      const errorHandler = (err) => {
        req.flash("error", err);
        res.redirect("/poster");
      };

      let data = [];

      data.push({
        poster_image: poster_image,
        poster_link: poster_link,
        poster_status: poster_status,
      });

      const update_data = await PosterModel.update(data[0], { where: { id: 1 } }).catch(errorHandler);

      req.flash("success", "Poster upload successfully.");
      res.redirect("/poster");
    });
  },
];