const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String
    },
    sender: {
      type: String
    }
  },
  {
    timestamps: true
  }
);




let Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
