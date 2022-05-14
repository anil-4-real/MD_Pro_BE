const mongoose = require("mongoose");

//user schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  markdowns: {
    type: [
      {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        markdownId: {
          type: String,
        },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
