require("dotenv").config();
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const {
  signUp,
  login,
  getMarkdowns,
  makeMarkdown,
  deleteMarkdown,
  editMarkdown,
} = require("../controllers/UserControllers");
const verifyJwt = require("../middlewares/VerifyJWT");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//db connection
const client = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log(err);
    });
};
client();

//signup
router.post("/signup", signUp);

//login
router.post("/login", login);

//get user markdowns
router.get("/markdowns", verifyJwt, getMarkdowns);

//make new markdown
router.post("/markdowns/new", verifyJwt, makeMarkdown);

//delete markdown
router.delete("/markdowns/:id", verifyJwt, deleteMarkdown);

//edit markdown
router.put("/markdowns/:id", verifyJwt, editMarkdown);

module.exports = router;
