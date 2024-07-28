"use server";

import connectDB from "@/utils/db";
import User from "@/models/User";
import UserTask from "@/models/UserTask";
import { TaskParams } from "@/lib/types";
import { getServerSession } from "next-auth";

const getEmail = async (): Promise<string> => {
  try {
    const session = await getServerSession();
    const email = session?.user?.email;

    if (!email) {
      console.log("No email found in session");
      return "";
    }
    return email;
  } catch (error) {
    console.error("Failed to get email from session:", error);
    return "";
  }
};

const getTasks = async ({ email }: { email: string }) => {
  try {
    await connectDB();
    const userTasks: any = await UserTask.findOne({ email }).lean();
    const tasksList = userTasks?.tasks.map(
      (task: { _id: { toString: () => any } }) => ({
        ...task,
        _id: task._id.toString(), // Convert _id to string
        // createdAt: project?.createdAt?.toISOString(), // Convert date to ISO string if exists
        // updatedAt: project?.updatedAt?.toISOString(), // Convert date to ISO string if exists
      })
    );
    return tasksList || [];
  } catch (error) {
    console.error("Fetching tasks error ->", error);
    return null;
  }
};

const addTask = async ({
  title,
  status,
  priority,
  deadline,
  description,
}: TaskParams) => {
  try {
    const email = await getEmail();
    if (!email) return "email-not-found";

    await connectDB();

    const existingUser = await User.findOne({ email }).exec();
    if (!existingUser) return "doesn't-exists";

    const userTasks = await UserTask.findOne({ email });
    const datetime = new Date();

    if (userTasks) {
      userTasks.tasks.push({
        title,
        description,
        status,
        priority,
        deadline,
        datetime,
      });
      await userTasks.save();
      console.log("New task added successfully!");
      return "added";
    } else {
      const newUserTasks = new UserTask({
        email,
        tasks: [
          {
            title,
            description,
            status,
            priority,
            deadline,
            datetime,
          },
        ],
      });
      await newUserTasks.save();
      console.log("Task created successfully!");
      return "created";
    }
  } catch (err) {
    console.error("Task creation failed:", err);
    return "err";
  }
};

const deleteTask = async ({ cardId }: { cardId: string }) => {
  try {
    const email = await getEmail();
    if (!email) return "email-not-found";

    await connectDB();

    const userTasks = await UserTask.findOne({ email });
    if (!userTasks) return "doesn't-exists";

    const result = await UserTask.updateOne(
      { email },
      { $pull: { tasks: { _id: cardId } } }
    );

    if (result.modifiedCount === 0) {
      return "not-found";
    }

    console.log("Task deleted successfully!");
    return "deleted";
  } catch (err) {
    console.error("Task deletion failed:", err);
    return "err";
  }
};

const updateStatus = async (cardId: string, newStatus: string) => {
  try {
    const email = await getEmail();
    if (!email) return "email-not-found";

    await connectDB();

    const userTasks = await UserTask.findOne({ email });
    if (!userTasks) return "doesn't-exists";

    const data = await UserTask.updateOne(
      { email, "tasks._id": cardId },
      { $set: { "tasks.$.status": newStatus } }
    );

    if (data.modifiedCount === 0) {
      return "task-not-updated";
    }

    return "task-updated";
  } catch (error) {
    console.error("Task status update failed:", error);
    return "task-status-update-error";
  }
};

// const searchTasks = async ({ title }: { title: string }) => {
//   try {
//     const email = await getEmail();
//     if (!email) return "email-not-found";

//     await connectDB();

//     const userTasks = await UserTask.findOne({ email });
//     if (!userTasks) return "doesn't-exists";

//     const tasks = await UserTask.find({ "tasks.title": title });
//     console.log(tasks);

//     // const tasksList = tasks?.tasks.map(
//     //   (task: { _id: { toString: () => any } }) => ({
//     //     ...task,
//     //     _id: task._id.toString(), // Convert _id to string
//     //     // createdAt: project?.createdAt?.toISOString(), // Convert date to ISO string if exists
//     //     // updatedAt: project?.updatedAt?.toISOString(), // Convert date to ISO string if exists
//     //   })
//     // );
//     // return tasksList || [];
//   } catch (error) {
//     console.log(error);
//   }
// };

export { getTasks, addTask, deleteTask, updateStatus };
