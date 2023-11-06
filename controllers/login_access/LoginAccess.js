const { QueryTypes } = require("sequelize");
const { sequelize, UserLoginStatus } = require("../../models");

exports.update = async (req, res, next) => {
  const errorHandler = (err) => {
    req.flash("error", "Sorry! You can't login right now. Please try later.");
    return res.redirect("/admin/user-access");
  };

  const data = await UserLoginStatus.update({ can_login: req.body.user_access }, { where: { id: req.body.id } }).catch(errorHandler);

  if (data !== null) {
    req.flash("success", "Success! You users can't login right now.");
    return res.redirect("/admin/user-access");
  }
};
