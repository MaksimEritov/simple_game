/**
 * Chat message schema for mongoouse
 * 
 * @exports Chat model
 */

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String
    },
    sender: {
      type: String
    },
    room: {
      type: String
    }
  },
  {
    timestamps: true
  }
);


const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
