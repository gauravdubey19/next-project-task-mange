import mongoose, { Schema } from "mongoose";

const userTaskSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    tasks: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, required: true },
        priority: { type: String, required: true },
        deadline: { type: String, required: true },
        datetime: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.UserTask ||
  mongoose.model("UserTask", userTaskSchema);
