const { sequelize, QuizListModel, AnswerListModel } = require("../../models");
const { QueryTypes } = require("sequelize");
const CommonFunction = require("../common_function");

exports.add_quiz = [
  async (req, res, next) => {
    const errorHandler = async (err, _id) => {
      res.render("/admin/quiz/add-quiz", { title: "ISMAIL HOSSAIN" });
    };

    if (req.body.name === "") {
      req.flash("error", "Please enter question");
      res.redirect("/admin/quiz/add-quiz");
    }

    if (req.body.name !== "") {
      let insert_data = {
        name: req.body.name,
        time_duration: req.body.time_duration,
        category: req.body.category,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        status: req.body.status,
      };
      const save_date = await QuizListModel.create(insert_data).catch(errorHandler);
      req.flash("success", "Quiz added successfully!");
      res.redirect("/admin/quiz/quiz-list");
    }
  },
];

exports.data_list = async (req, res, next) => {
  let offset = req.body.start;
  let limit = req.body.length;
  let page_num = req.body.draw;
  let search = req.body["search[value]"];
  let query_str = "";
  if (search !== "") {
    query_str = " WHERE question like " + "%" + search + "%";
  }

  const query_data = await sequelize.query(`SELECT * FROM quiz_list ${query_str} ORDER BY id DESC LIMIT ${offset}, ${limit};`, { type: QueryTypes.SELECT });
  const query_data_count = await sequelize.query(`SELECT COUNT(*) AS num_of_row FROM quiz_list ${query_str};`, { type: QueryTypes.SELECT });

  query_data.forEach(function (e) {
    753;
    e.action = CommonFunction.action_menu_edit_del(e.id, "quiz-list");
  });
  let num_of_rows = query_data_count[0].num_of_row;

  if (query_data.length !== 0) {
    return res.status(200).json({
      success: true,
      recordsTotal: query_data.length,
      recordsFiltered: num_of_rows,
      data: query_data,
    });
  } else {
    return res.status(200).json({
      success: true,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: query_data,
    });
  }
};

exports._view = async (req, res) => {
  const category = req.query.category;

  const query_data = await sequelize.query(`SELECT * FROM quiz_list WHERE category = '${category}' ORDER BY id DESC;`, { type: QueryTypes.SELECT });

  res.render("quiz/user_quiz_list", { title: category, data: query_data });
};

exports._question = async (req, res) => {
  const errorHandler = (err) => {
    console.log(err);
  };

  let id = req.params.id;
  const userDetails = req.session.user;
  const user_id = userDetails.work_area_t;

  const query_data = await sequelize.query(`SELECT ql.*,q.time_duration FROM question_list ql INNER JOIN quiz_list q ON ql.quiz_id=q.id WHERE quiz_id = ${id} ORDER BY quiz_id ASC;`, { type: QueryTypes.SELECT });
  const already_answered = await sequelize.query(
    `SELECT * FROM answer_list al 
                INNER JOIN question_list ql ON al.quiz_id=ql.id 
                INNER JOIN quiz_list q ON ql.quiz_id=q.id WHERE al.user_id=${user_id} AND q.id = ${id};`,
    { type: QueryTypes.SELECT }
  );

  console.log("*", already_answered.length);
  console.log("**", already_answered.length === 0);
  console.log("***", user_id);

  if (already_answered.length === 0) {
    let insert_data = {
      quiz_id: query_data[0].id,
      user_id: user_id,
      answer: null,
    };
    const save_date = await AnswerListModel.create(insert_data).catch(errorHandler);

    res.render("quiz/user_quiz_question", { title: "Questions", data: query_data });
  } else {
    res.redirect("/already_answer");
  }
};

exports.save_quiz = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({ success: false, error: err.original.sqlMessage });
  };

  let userDetails = req.session.user;
  const user_id = userDetails.work_area_t;

  let insert_data = {
    quiz_id: req.body.quiz_id,
    user_id: user_id,
    answer: req.body.answer,
  };
  const save_date = await AnswerListModel.create(insert_data).catch(errorHandler);
  return res.status(200).json({
    success: true,
    message: "Answer save successfully !",
  });
};

// EDIT
exports.edit_from = async (req, res, next) => {
  let id = req.params.id;
  const errorHandler = (err) => {
    req.flash("error", err.original.sqlMessage);
    res.redirect("/admin/quiz/quiz-list");
  };
  let result = await QuizListModel.findOne({ where: { id: id }, order: [["id", "DESC"]] }).catch(errorHandler);
  res.render("quiz/admin_quiz_edit", {
    id: result.id,
    name: result.name,
    time_duration: result.time_duration,
    category: result.category,
    start_time: result.start_time,
    end_time: result.end_time,
    status: result.status,
    title: "Quiz Edit",
  });
};

exports.edit = [
  async (req, res, next) => {
    let id = req.params.id;

    const errorHandler = (err) => {
      req.flash("error", err.original.sqlMessage);
      res.redirect("/admin/quiz/quiz-list/edit/" + id);
    };

    if (req.body.name !== "") {
      let update_data = {
        name: req.body.name,
        time_duration: req.body.time_duration,
        category: req.body.category,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        status: req.body.status,
      };
      const update_date = await QuizListModel.update(update_data, { where: { id: req.body.id } }).catch(errorHandler);
      req.flash("success", "Data update successfully!");
      res.redirect("/admin/quiz/quiz-list/");
    }
  },
];
// EDIT

// DELETE
exports.delete = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({ success: false, error: err.original.sqlMessage });
  };
  const result = await QuizListModel.destroy({ where: { id: req.body.del_id } }).catch(errorHandler);
  return res.status(200).json({
    success: true,
    result: result,
  });
};
// DELETE
