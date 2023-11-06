const { sequelize, QuizListModel } = require("../../models");
const { QueryTypes } = require("sequelize");
const excel = require("exceljs");
const moment = require("moment/moment");

exports.quiz_list = async (req, res) => {
  const quiz_data = await sequelize.query("SELECT * FROM quiz_list;", { type: QueryTypes.SELECT });

  res.render("quiz_result", { title: "Quiz Result", data: quiz_data });
};

exports.download = async (req, res, next) => {
  const quiz_id = req.body.quiz_id;
  const userDetails = req.session.user;

  console.log("+_+_+_+_+_+_+_+_+_+_+");
  console.log(quiz_id);
  console.log("+_+_+_+_+_+_+_+_+_+_+");

  // const quiz_log = await sequelize.query(`SELECT ul.*, uli.name FROM user_log ul INNER JOIN user_list uli ON ul.user_id=uli.work_area_t WHERE DATE(ul.log_time) BETWEEN '${formatStartDate}' AND '${formatEndDate}' AND ul.log_type != 'login';`, { type: QueryTypes.SELECT });

  // const workbook = new excel.Workbook();
  // const worksheet = workbook.addWorksheet("Users");

  // worksheet.columns = [
  //   { header: "SL", key: "sl", width: 5 },
  //   { header: "Name", key: "name", width: 20 },
  //   { header: "Employee Id", key: "user_id", width: 15 },
  //   { header: "Date", key: "date", width: 15 },
  //   { header: "Time", key: "time", width: 15 },
  //   { header: "Duration (M)", key: "duration", width: 15 },
  // ];

  // user_log.forEach((user, i) => {
  //   const dateTimeString = user.log_time;
  //   const stayTimeMinuties = user.stay_time / 60000;
  //   const dateTime = new Date(dateTimeString);

  //   const formattedDateString = dateTime.toLocaleDateString();
  //   const formattedTimeString = dateTime.toLocaleTimeString();

  //   worksheet.addRow({ sl: i + 1, date: formattedDateString, time: formattedTimeString, duration: stayTimeMinuties, ...user });
  // });

  // res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  // res.setHeader("Content-Disposition", "attachment; filename=jenphar-reporting-sheet.xlsx");

  // workbook.xlsx
  //   .write(res)
  //   .then(() => {
  //     res.end();
  //   })
  //   .catch((error) => {
  //     console.error("Error generating Excel file:", error);
  //     res.status(500).send("Error generating Excel file");
  //   });
};