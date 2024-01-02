const { sequelize, QuizListModel, AnswerListModel } = require("../../models");
const { QueryTypes } = require("sequelize");
const CommonFunction = require("../common_function");

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
    e.action = CommonFunction.action_menu_edit_del(e.id, "quiz_list");
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

exports.post_add_quiz = async (req, res, next) => {
  const errorHandler = async (err, _id) => {
    req.flash("error", err.original.sqlMessage);
    res.render("/add_quiz", { title: "Add Quiz" });
  };

  if (req.body.name === "") {
    req.flash("error", "Please enter question");
    res.redirect("/add_quiz");
  }

  if (req.body.name !== "") {
    let insert_data = {
      name: req.body.name,
      time_duration: req.body.time_duration,
      total_points: req.body.total_points,
      category: req.body.category,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      status: req.body.status,
    };
    
    const save_date = await QuizListModel.create(insert_data).catch(errorHandler);
    req.flash("success", "Quiz added successfully!");
    res.redirect("/quiz_list");
  }
};

exports.get_edit_quiz = async (req, res, next) => {
  let id = req.params.id;

  const errorHandler = (err) => {
    req.flash("error", err.original.sqlMessage);
    res.redirect("/quiz-list");
  };

  let result = await QuizListModel.findOne({ where: { id: id }, order: [["id", "DESC"]] }).catch(errorHandler);
  
  res.render("quiz/quiz_edit", {
    id: result.id,
    name: result.name,
    time_duration: result.time_duration,
    total_points: result.total_points,
    category: result.category,
    start_time: result.start_time,
    end_time: result.end_time,
    status: result.status,
    title: "Edit Quiz",
  });
};

exports.post_edit_quiz = async (req, res, next) => {
  let id = req.params.id;

  const errorHandler = (err) => {
    req.flash("error", err.original.sqlMessage);
    res.redirect("/quiz_list/edit/" + id);
  };

  if (req.body.name !== "") {
    let update_data = {
      name: req.body.name,
      time_duration: req.body.time_duration,
      total_points: req.body.total_points,
      category: req.body.category,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      status: req.body.status,
    };
    const update_date = await QuizListModel.update(update_data, { where: { id: req.body.id } }).catch(errorHandler);
    req.flash("success", "Data update successfully!");
    res.redirect("/quiz_list");
  }
};

exports.delete_quiz = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({ success: false, error: err.original.sqlMessage });
  };
  const result = await QuizListModel.destroy({ where: { id: req.body.del_id } }).catch(errorHandler);
  return res.status(200).json({
    success: true,
    result: result,
  });
};
