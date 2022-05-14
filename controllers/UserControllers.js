const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

//signup controller
const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({
        statusCode: 400,
        message: "User already exists",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      const result = await newUser.save();
      if (result) {
        res.json({
          statusCode: 201,
          message: "User created successfully",
        });
      } else {
        res.json({
          statusCode: 400,
          message: "User creation failed",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  }
};

//login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "User does not exist",
      });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: user._id, email: user.email, name: user.name },
          process.env.TOKEN_SECRET_KEY
        );
        if (token) {
          res.status(200).json({
            message: "User logged in successfully",
            token,
          });
        } else {
          res.status(400).json({
            message: "User login failed",
          });
        }
      } else {
        res.status(400).json({
          message: "password is incorrect",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

//get user markdowns
const getMarkdowns = async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({
        message: "User markdowns retrieved successfully",
        markdowns: user.markdowns,
        name: user.name,
      });
    } else {
      res.status(400).json({
        message: "User does not exist",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

//make a new markdown
const makeMarkdown = async (req, res) => {
  const { userId } = req;
  const { title, content } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      const markdown = {
        title,
        content,
        markdownId: uuidv4(),
      };
      user.markdowns.push(markdown);
      const result = await user.save();
      if (result) {
        res.status(200).json({
          message: "Markdown created successfully",
        });
      } else {
        res.status(400).json({
          message: "Markdown creation failed",
        });
      }
    } else {
      res.status(400).json({
        message: "User does not exist",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

//delete a markdown
const deleteMarkdown = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { markdowns: { markdownId: id } } }
    );
    if (user) {
      res.status(200).json({
        message: "Markdown deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

//edit a markdown and update it in the markdowns array
const editMarkdown = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  const { content } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, "markdowns.markdownId": id },
      { $set: { "markdowns.$.content": content } }
    );
    if (user) {
      res.status(200).json({
        message: "Markdown updated successfully",
      });
    } else {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  signUp,
  login,
  getMarkdowns,
  makeMarkdown,
  deleteMarkdown,
  editMarkdown,
};
