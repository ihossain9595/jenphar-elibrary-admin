const excel = require("exceljs");
const { sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");
const moment = require("moment/moment");

exports.download = async (req, res, next) => {
  const start = req.body.dateStart;
  const end = req.body.dateEnd;

  // console.log("+_+_+_+_+_+_+_+_+_+_+_+_+_+_+");
  // console.log("+_+_+_+_+_+_+_+_+_+");
  // console.log("+_+_+_+_+");
  // console.log(`START: ${start}`);
  // console.log(`END: ${end}`);
  // console.log("+_+_+_+_+");
  // console.log("+_+_+_+_+_+_+_+_+_+");
  // console.log("+_+_+_+_+_+_+_+_+_+_+_+_+_+_+");

  const user_log = await sequelize.query(`SELECT ul.*, uli.name FROM user_log ul INNER JOIN user_list uli ON ul.user_id=uli.work_area_t WHERE DATE(ul.log_time) BETWEEN '${start}' AND '${end}' AND ul.log_type NOT IN ('login', 'logout');`, { type: QueryTypes.SELECT });

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("Users");

  worksheet.columns = [
    { header: "SL", key: "sl", width: 10 },
    { header: "Name", key: "name", width: 20 },
    { header: "Employee Id", key: "user_id", width: 15 },
    { header: "Date", key: "date", width: 15 },
    { header: "Time", key: "time", width: 15 },
    { header: "Duration (M)", key: "duration", width: 15 },
  ];

  user_log.forEach((user, i) => {
    const dateTimeString = user.log_time;

    const stayTimeMinuties = Number((user.stay_time / 60000).toFixed(2));
    const formattedDateString = moment(dateTimeString).utcOffset(0).format('DD-MM-YYYY');
    const formattedTimeString = moment(dateTimeString).utcOffset(0).format('hh:mm:ss A');
    
    worksheet.addRow({ sl: i + 1, date: formattedDateString, time: formattedTimeString, duration: stayTimeMinuties, ...user });
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=jenphar-reporting-sheet.xlsx");

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
