const { QueryTypes } = require("sequelize");
const { sequelize, UserLoginStatus } = require("../../models");

exports.get_user_access = async (req, res, next) => {
  const errorHandler = (error) => {
    req.flash("error", error);
    res.redirect("/user_access");
  };

  let data = await UserLoginStatus.findOne({ where: { id: 1 } }).catch(errorHandler);
  res.render("user_access", { title: "User Access", data: data });
};

exports.update_user_access = async (req, res, next) => {
  const errorHandler = (error) => {
    req.flash("error", error);
    return res.redirect("/user_access");
  };

  const data = await UserLoginStatus.update({ can_login: req.body.user_access }, { where: { id: req.body.id } }).catch(errorHandler);

  if (data !== null) {
    req.flash("success", "Success! Your users can't login right now.");
    return res.redirect("/user_access");
  }
};
