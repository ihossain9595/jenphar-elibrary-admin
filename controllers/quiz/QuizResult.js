const { sequelize, QuizListModel } = require("../../models");
const { QueryTypes } = require("sequelize");
const excel = require("exceljs");
const moment = require("moment/moment");

exports.quiz_list = async (req, res) => {
  const quiz_data = await sequelize.query("SELECT * FROM quiz_list ORDER BY id DESC;", { type: QueryTypes.SELECT });
  res.render("quiz_result", { title: "Quiz Result", data: quiz_data });
};

exports.download_result = async (req, res, next) => {
  const quiz_id = req.body.quiz_id;

  const quiz_log = await sequelize.query(`SELECT ul.work_area_t, ul.name, qul.quiz_id, qzl.name AS quiz_name, al.question_id, qul.question, qul.answer, al.user_answer, qul.option_1, qul.option_2, qul.option_3, qul.option_4 FROM user_list ul INNER JOIN answer_list al ON ul.work_area_t = al.user_id INNER JOIN question_list qul ON al.question_id = qul.id INNER JOIN quiz_list qzl ON qul.quiz_id = qzl.id WHERE qul.quiz_id = ${quiz_id} ORDER BY ul.work_area_t DESC;`, { type: QueryTypes.SELECT });

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("Users");

  worksheet.columns = [
    { header: "Sl", key: "sl", width: 5 },
    { header: "Employee Id", key: "work_area_t", width: 10 },
    { header: "Name", key: "name", width: 20 },
    { header: "Quiz Name", key: "quiz_name", width: 20 },
    { header: "Question", key: "question", width: 50 },
    { header: "Answer", key: "answer", width: 5 },
    { header: "Answer by Employee", key: "answer_employee", width: 5 },
    { header: "Mark", key: "mark", width: 5 },
    { header: "Option 1", key: "option_1", width: 15 },
    { header: "Option 2", key: "option_2", width: 15 },
    { header: "Option 3", key: "option_3", width: 15 },
    { header: "Option 4", key: "option_4", width: 15 },
    { header: "Total Mark", key: "total_mark", width: 10 },
  ];

  const markCount = new Map();

  quiz_log.forEach((quiz, i) => {
    let isCorrect;
    if (quiz.answer === quiz.user_answer) {
      isCorrect = 1;
    } else {
      isCorrect = 0;
    }

    const currentMark = markCount.get(quiz.work_area_t) || 0;
    markCount.set(quiz.work_area_t, currentMark + isCorrect);

    worksheet.addRow({ sl: 1, work_area_t: quiz.work_area_t, name: quiz.name, quiz_name: quiz.quiz_name, question: quiz.question, answer: quiz.answer, answer_employee: quiz.user_answer, mark: isCorrect, option_1: quiz.option_1, option_2: quiz.option_2, option_3: quiz.option_3, option_4: quiz.option_4, total_mark: currentMark + isCorrect });
  });

  let serial = 0;
  let lastEmployeeId = null;
  let lastEmployeeIdRowIndex = null;

  worksheet.eachRow((row, rowNumber) => {
    const employeeId = row.getCell("work_area_t").value;

    if (employeeId !== lastEmployeeId) {
      if (lastEmployeeIdRowIndex !== null && lastEmployeeIdRowIndex !== rowNumber - 1) {
        const totalMarkFormula = `SUM(M${lastEmployeeIdRowIndex}:M${rowNumber - 1})`;
        worksheet.mergeCells(`A${lastEmployeeIdRowIndex}:A${rowNumber - 1}`);
        worksheet.mergeCells(`B${lastEmployeeIdRowIndex}:B${rowNumber - 1}`);
        worksheet.mergeCells(`C${lastEmployeeIdRowIndex}:C${rowNumber - 1}`);
        worksheet.mergeCells(`D${lastEmployeeIdRowIndex}:D${rowNumber - 1}`);
        worksheet.mergeCells(`M${lastEmployeeIdRowIndex}:M${rowNumber - 1}`);
        worksheet.getCell(`M${lastEmployeeIdRowIndex}`).value = { formula: totalMarkFormula, result: markCount.get(lastEmployeeId) };
        worksheet.getCell(`A${lastEmployeeIdRowIndex}`).value = ++serial;
      }
      lastEmployeeId = employeeId;
      lastEmployeeIdRowIndex = rowNumber;
    }
  });

  if (lastEmployeeIdRowIndex !== null) {
    const totalMarkFormula = `SUM(M${lastEmployeeIdRowIndex}:M${worksheet.rowCount})`;
    worksheet.mergeCells(`A${lastEmployeeIdRowIndex}:A${worksheet.rowCount}`);
    worksheet.mergeCells(`B${lastEmployeeIdRowIndex}:B${worksheet.rowCount}`);
    worksheet.mergeCells(`C${lastEmployeeIdRowIndex}:C${worksheet.rowCount}`);
    worksheet.mergeCells(`D${lastEmployeeIdRowIndex}:D${worksheet.rowCount}`);
    worksheet.mergeCells(`M${lastEmployeeIdRowIndex}:M${worksheet.rowCount}`);
    worksheet.getCell(`M${lastEmployeeIdRowIndex}`).value = { formula: totalMarkFormula, result: markCount.get(lastEmployeeId) };
    worksheet.getCell(`A${lastEmployeeIdRowIndex}`).value = ++serial;
  }

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=jenphar-quiz-result.xlsx`);

  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      console.error("Error generating Excel file:", error);
      res.status(500).send("Error generating Excel file");
    });
};
