const {sequelize,RankingModel} = require("../models");
const {QueryTypes} = require("sequelize");
const path = require("path");
const XLSX = require('xlsx');
const multer = require('multer');


exports.user_leaderboard = async (req, res, next) => {
  res.render("user_leaderboard", { title: "User Leaderboard" });
};

exports.UploadExcel = [(req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
  }).single('file');

  upload(req, res, async ( err ) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/user_leaderboard");
    }else{
      const file = req.file.filename;

      // Read the Excel file
      var filePath = path.resolve(__dirname,`../public/upload/${file}`);
      const workbook = XLSX.readFile(`${filePath}`);

      const errorHandler = (err) => {
        req.flash("error", "Upload error");
        res.redirect("/user_leaderboard");
      };

      try {
        let upload_error = false;
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        let insert = [];
        for(let i=0;i<data.length;i++){
          const item = data[i];
          insert.push({
            sap_id: item.ID,
            name: item.Name,
            address: item.Address,
            month: item.Month,
            written_exam_score: item.WrittenExamScore,
            exam_gm_score: item.ExamGmScore,
            detailing_score: item.DetailingScore,
            quiz_score: item.QuizScore,
            average: item.Average,
          })
        }

        const insertList = await RankingModel.bulkCreate(insert).catch(errorHandler);
        req.flash("success", "Excel upload successfully ");
        res.redirect("/user_leaderboard");

      } catch (error) {
        req.flash("error", error);
        res.redirect("/user_leaderboard");
      }
    }
  });
}];
