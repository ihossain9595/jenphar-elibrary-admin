const { AdminListModel } = require("../../models");

exports.login_form_submit = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const errorHandler = (error) => {
    req.flash("error", error);
    res.redirect("/");
  };

  if (username === "" && password === "") {
    req.flash("error", "Please enter your username and password.");
    res.redirect("/");
  } else if (username === "") {
    req.flash("error", "Please enter your username.");
    res.redirect("/");
  } else if (password === "") {
    req.flash("error", "Please enter your password.");
    res.redirect("/");
  } else {
    let result = await AdminListModel.findOne({ where: { username: username, password: password } }).catch(errorHandler);

    if (result === null) {
      req.flash("error", "Please check your username and password.");
      res.redirect("/");
    } else {
      req.session.user = result;
      res.redirect("/dashboard");
    }
  }
};
