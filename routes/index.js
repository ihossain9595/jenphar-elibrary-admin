var express = require("express");
var router = express.Router();

const Login = require("../controllers/login/Login");

const BrandList = require("../controllers/elibrary/BrandList");
const OptionList = require("../controllers/elibrary/OptionList");
const UploadContent = require("../controllers/elibrary/UploadContent");
const UploadMedicine = require("../controllers/elibrary/UploadMedicine");


const UserAccess = require("../controllers/login_access/UserAccess");
const ReportDownload = require("../controllers/elibrary/ReportDownload");
const Poster = require("../controllers/poster/Poster");

const QuizList = require("../controllers/quiz/QuizList");
const QuestionList = require("../controllers/quiz/QuestionList");
const QuizResult = require("../controllers/quiz/QuizResult");
const UserLeaderboard = require("../controllers/UserLeaderboard");

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

router.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.radiant) {
    res.clearCookie("radiant");
    res.redirect("/");
  } else {
    res.redirect("/");
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
// E-Library - Brands - Options - Upload - Add Medicine
router.get("/elibrary", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("elibrary/elibrary", { title: "E-Library" });
  }
});

router.get("/elibrary/brands", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    BrandList.get_brand_list(req, res, next);
  }
});

router.get("/elibrary/options", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    OptionList.get_options(req, res, next);
  }
});

router.get("/elibrary/upload", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    UploadContent.get_upload_content(req, res, next);
  }
});

router.post("/elibrary/upload", UploadContent.uploads);

router.post("/elibrary/delete", UploadContent.delete);

router.get("/elibrary/add_medicine", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("elibrary/medicine_add", { title: "Add Medicine" });
  }
});

router.post("/elibrary/add_medicine/upload", UploadMedicine.upload);
// E-Library - Brands - Options - Upload - Add Medicine
//
//
//
// Show Quiz - Add Quiz - Edit Quiz - Delete Quiz
router.get("/quiz_list", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("quiz/quiz_list", { title: "Quiz List" });
  }
});

router.post("/quiz_list/data_list", QuizList.data_list);

router.get("/add_quiz", function (req, res) {
  if (isAdminLogin(req, res)) {
    res.render("quiz/quiz_add", { title: "Add Quiz" });
  }
});

router.post("/quiz/add_quiz", QuizList.post_add_quiz);

router.get("/quiz_list/edit/:id", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuizList.get_edit_quiz(req, res, next);
  }
});

router.post("/quiz_list/edit/:id", QuizList.post_edit_quiz);

router.post("/quiz_list/delete", QuizList.delete_quiz);
// Show Quiz - Add Quiz - Edit Quiz - Delete Quiz
//
//
//
// Show Question - Add Question - Edit Question - Delete Question
router.get("/question_list/:id", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuestionList.get_question_list(req, res, next);
  }
});

router.post("/question_list/data_list", QuestionList.data_list);

router.get("/add_question/:id", function (req, res, next) {
  if (isAdminLogin(req, res)) {
    QuestionList.get_add_question(req, res, next);
  }
});

router.post("/quiz/add_question/:id", QuestionList.post_add_question);

router.post("/question_list/delete", QuestionList.delete_question);
// Show Question - Add Question - Edit Question - Delete Question
//
//
//
// User Access
router.get("/user_access", async function (req, res, next) {
  if (isAdminLogin(req, res)) {
    UserAccess.get_user_access(req, res, next);
  }
});

router.post("/user_access/update", UserAccess.update_user_access);
// User Access
//
//
//
// Reports
router.get("/reports", function (req, res, next) {
  if (isAdminLogin(req, res, next)) {
    res.render("reports", { title: "Reports" });
  }
});

router.post("/reports/download", ReportDownload.download);
// Reports
//
//
//
// Poster
router.get("/poster", function (req, res, next) {
  if (isAdminLogin(req, res, next)) {
    Poster.get_poster(req, res, next);
  }
});

router.post("/poster/upload", Poster.post_poster);
// Poster
//
//
//
// Quiz Result
router.get("/quiz_result", function (req, res, next) {
  if (isAdminLogin(req, res, next)) {
    QuizResult.quiz_list(req, res, next);
  }
});

router.post("/quiz_result/download", QuizResult.download_result);
// Quiz Result

router.get("/user_leaderboard", function (req, res, next) {
  if (isAdminLogin(req, res, next)) {
    UserLeaderboard.user_leaderboard(req, res, next);
  }
});
router.post('/user_leaderboard/upload_excel', UserLeaderboard.UploadExcel);

module.exports = router;
