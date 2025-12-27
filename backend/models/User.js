import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true },
    name: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
