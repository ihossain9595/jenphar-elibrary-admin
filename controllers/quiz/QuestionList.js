const { sequelize, QuizListModel, QuestionListModel } = require("../../models");
const { QueryTypes } = require("sequelize");
const CommonFunction = require("../common_function");

exports.data_list = async (req, res, next) => {
  let id = req.body.id;
  let offset = req.body.start;
  let limit = req.body.length;
  let page_num = req.body.draw;
  let search = req.body["search[value]"];
  let query_str = "";
  if (search !== "") {
    query_str = " WHERE question like " + "%" + search + "%";
  }

  const query_data = await sequelize.query(`SELECT * FROM question_list WHERE quiz_id = ${id} ORDER BY id DESC LIMIT ${offset}, ${limit};`, { type: QueryTypes.SELECT });
  const query_data_count = await sequelize.query(`SELECT COUNT(*) AS num_of_row FROM question_list WHERE quiz_id = ${id};`, { type: QueryTypes.SELECT });

  query_data.forEach(function (e) {
    e.action = CommonFunction.action_menu_edit_del_question(e.id, `question_list/${id}`);
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

exports.get_question_list = async (req, res, next) => {
  let id = req.params.id;

  const errorHandler = (err) => {
    req.flash("error", err.original.sqlMessage);
    res.redirect("/quiz_list");
  };

  let result = await QuizListModel.findOne({ where: { id: id }, order: [["id", "DESC"]] }).catch(errorHandler);

  res.render("quiz/question_list", {
    id: result.id,
    title: result.name,
  });
};

exports.get_add_question = async (req, res, next) => {
  let id = req.params.id;

  const errorHandler = (err) => {
    req.flash("error", err.original.sqlMessage);
    res.redirect("/quiz_list");
  };

  let result = await QuizListModel.findOne({ where: { id: id }, order: [["id", "DESC"]] }).catch(errorHandler);

  res.render("quiz/question_add", {
    id: result.id,
    title: result.name,
  });
};

exports.post_add_question = async (req, res, next) => {
  let id = req.params.id;

  const errorHandler = async (err) => {
    req.flash("error", err.original.sqlMessage);
    res.redirect("/add_question/" + id);
  };

  if (req.body.question === "") {
    req.flash("error", "Please write your question");
    res.redirect("/add_question/" + id);
  }

  if (req.body.question !== "") {
    let insert_data = {
      quiz_id: id,
      question: req.body.question,
      option_1: req.body.option_1,
      option_2: req.body.option_2,
      option_3: req.body.option_3,
      option_4: req.body.option_4,
      answer: req.body.answer,
    };
    
    const save_data = await QuestionListModel.create(insert_data).catch(errorHandler);
    req.flash("success", "Question added successfully!");
    res.redirect("/add_question/" + id);
  }
};

exports.delete_question = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({ success: false, error: err.original.sqlMessage });
  };
  const result = await QuestionListModel.destroy({ where: { id: req.body.del_id } }).catch(errorHandler);
  return res.status(200).json({
    success: true,
    result: result,
  });
};
