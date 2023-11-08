var express = require("express");
var router = express.Router();

const Login = require("../controllers/login/Login");

const UserCategory = require("../controllers/user/UserCategory");
const UserOption = require("../controllers/user/UserOption");
const UserUpload = require("../controllers/user/UserUpload");

const AdminMedicineUpload = require("../controllers/admin/AdminMedicineUpload");
const AdminCategory = require("../controllers/admin/AdminCategory");
const AdminDownload = require("../controllers/admin/AdminDownload");
const AdminOption = require("../controllers/admin/AdminOption");
const AdminUpload = require("../controllers/admin/AdminUpload");

const LoginAccess = require("../controllers/login_access/LoginAccess");

const QuizResult = require("../controllers/quiz/QuizResult");
const QuizList = require("../controllers/quiz/QuizList");
const QuestionList = require("../controllers/quiz/QuestionList");
const QuizCategory = require("../controllers/quiz/QuizCategory");

const { UserLogModel, UserLoginStatus } = require("../models");
const moment = require("moment/moment");

// isAdminLogin
function isAdminLogin(req, res) {
  if (req.session.user && req.cookies.radiant) {
    return true;
  } else {
    res.redirect("/");
  }
}
// isAdminLogin
//
//
//
// Home
router.get("/", function (req, res) {
  res.render("index", { title: "Jenphar E-Library" });
});
// Home
//
//
//
// Login - Logout
router.post("/login", Login.login_form_submit);

router.get("/logout-admin", (req, res) => {
  if (req.session.user && req.cookies.radiant) {
    res.clearCookie("radiant");
    res.redirect("/login-admin");
  } else {
    res.redirect("/login-admin");
  }
});
// Login - Logout
//
//
//
// Dashboard
router.get("/dashboard", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("dashboard", { title: "Dashboard" });
  }
});
// Dashboard
//
//
//
// Quiz Result
router.get("/quiz_result", function (req, res) {
  if (isAdminLogin(req, res)) {
    QuizResult.quiz_list(req, res);
  }
});

router.post("/download/quiz_result", QuizResult.download);
// Quiz Result
//
//
//
// Quiz List
router.get("/quiz-list", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("quiz/quiz_list", { title: "Quiz List" });
  }
});
// Quiz List
//
//
//
// Add Quiz
router.get("/add-quiz", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("quiz/quiz_add", { title: "Add New Quiz" });
  }
});
router.post("/quiz/add-quiz", QuizList.add_quiz);
// Add Quiz
//
//
//
// ! USER
router.get("/home", async function (req, res) {
  if (await isUserLogin(req, res)) {
    res.render("user_home", { title: "Home" });
  }
});

router.get("/e-library", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    res.render("user_e_library", { title: "E-Library" });
  }
});

router.get("/e-library/category", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    UserCategory._view(req, res, next);
  }
});

router.get("/e-library/option", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    UserOption._view(req, res, next);
  }
});

router.get("/e-library/upload", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    UserOption._upload_media(req, res, next);
  }
});

router.get("/e-library/upload/:file_url", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    UserUpload._upload(req, res, next);
  }
});
// ! USER
//
//
//
//
//
// ! ADMIN
router.get("/admin/reports", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("admin_reports", { title: "Reports" });
  }
});

router.post("/admin/download/reports", AdminDownload.download);

router.get("/admin/e-library", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("admin_e_library", { title: "E-Library" });
  }
});

router.get("/admin/e-library/category", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    AdminCategory._view(req, res, next);
  }
});

router.get("/admin/add-medicine", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("admin_add_medicine", { title: "Add Medicine" });
  }
});

router.get("/admin/e-library/option", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    AdminOption._view(req, res, next);
  }
});

router.get("/admin/e-library/upload", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    AdminOption._upload_media(req, res, next);
  }
});

router.post("/admin/upload", AdminUpload.uploads);

router.post("/admin/add-medicine/upload", AdminMedicineUpload.upload);

router.post("/file/del", AdminOption.delete);

// ! ADMIN

// ! TRACK
router.post("/track-time", async function (req, res, next) {
  const { timeSpent, currentURL } = req.body;

  const errorHandler = (error) => {
    console.log(error);
  };
  const insert_data = {
    user_id: req.session.user.work_area_t,
    stay_time: timeSpent,
    log_time: moment().format(),
    log_type: "duration",
    url: currentURL,
  };

  const data_insert = await UserLogModel.create(insert_data).catch(errorHandler);

  res.sendStatus(200);
});
// ! TRACK

// ! USER ACCESS
router.get("/admin/user-access", async function (req, res, next) {
  const errorHandler = (error) => {
    req.flash("error", error);
    res.redirect("/login-user");
  };

  let status = await UserLoginStatus.findOne({ where: { id: 1 } }).catch(errorHandler);
  res.render("user_access", { title: "User Access", data: status });
});

router.post("/admin/user-access/save", async function (req, res, next) {
  LoginAccess.update(req, res, next);
});
// ! USER ACCESS

// ! QUIZ


router.post("/admin/quiz-list/data-list", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuizList.data_list(req, res, next);
  }
});

router.get("/admin/quiz/quiz-list/edit/:id", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuizList.edit_from(req, res, next);
  }
});
router.post("/admin/quiz/quiz-list/edit/:id", QuizList.edit);

router.post("/admin/quiz-list/del", function (req, res, next) {
  QuizList.delete(req, res, next);
});

router.post("/admin/question-list/data-list", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuestionList.data_list(req, res, next);
  }
});

router.get("/admin/quiz/question-list/edit/:id", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuizList.edit_from(req, res, next);
  }
});
router.post("/admin/quiz/question-list/edit/:id", QuizList.edit);

router.post("/admin/question-list/del", function (req, res, next) {
  QuestionList.delete(req, res, next);
});

// router.get("/admin/quiz/quiz-list/:id", function (req, res) {
//   if (isAdminLogin(req, res)) {
//     QuestionList.question_list(req, res, next);
//   }
// });

router.get("/admin/quiz/question-list/:id", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuestionList.question_list(req, res, next);
  }
});

router.get("/admin/quiz/add-question/:id", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuestionList.question_form(req, res, next);
  }
});
router.post("/admin/quiz/add-question/:id", QuestionList.add_question);

//
//
//

router.get("/quizes", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    res.render("quiz/user_quiz_category", { title: "Quiz Topics" });
  }
});

router.get("/quizes/quiz-list", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    QuizList._view(req, res, next);
  }
});

router.get("/quizes/quiz/:id", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    QuizList._question(req, res, next);
  }
});

router.get("/quizes/thank-you", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    res.render("quiz/user_quiz_thank", { title: "E-Library" });
  }
});

router.get("/quizes/message", async function (req, res, next) {
  if (await isUserLogin(req, res)) {
    res.render("quiz/user_quiz_message", { title: "E-Library" });
  }
});
// ! QUIZ

router.get("/temporary-off", function (req, res, next) {
  res.render("temporary_off", { title: "Temporary Off", layout: false });
});

router.post("/quizes/quiz/save_quiz", function (req, res, next) {
  QuizList.save_quiz(req, res, next);
});

router.get("/thank_you", function (req, res, next) {
  res.render("quiz/user_thank_you", { title: "Thank You" });
});

router.get("/already_answer", function (req, res, next) {
  res.render("quiz/user_already_answer", { title: "Already Answer" });
});

module.exports = router;
