import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    unique: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);
