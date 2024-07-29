"use server";

import connectDB from "@/utils/db";
import User from "@/models/User";
import UserTask from "@/models/UserTask";
import { TaskParams, TasksValues } from "@/lib/types";
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

const getTasks = async () => {
  try {
    const email = await getEmail();
    if (!email) return "no-email";

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
    if (!email) return "no-email";

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
    if (!email) return "no-email";

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
    if (!email) return "no-email";

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

interface UserTasks {
  email: string;
  tasks: TasksValues[];
}

const searchTasks = async ({ title }: { title: string }) => {
  if (!title.trim()) return { error: "no-title" };
  try {
    const email = await getEmail();
    if (!email) return { error: "no-email" };

    await connectDB();

    const userTasks = (await UserTask.findOne({
      email,
    }).lean()) as UserTasks | null;
    if (!userTasks) return { error: "doesn't-exist" };

    const regex = new RegExp(title, "i");

    const tasksList = userTasks.tasks
      .filter((task: TasksValues) => regex.test(task.title))
      .map((task: TasksValues) => ({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        datetime: new Date(task.datetime).toISOString(),
      }));

    // console.log(tasksList);
    return tasksList;
  } catch (error) {
    console.error("Error: ", error);
    return { error: "Error while searching tasks..." };
  }
};

export { getTasks, addTask, deleteTask, updateStatus, searchTasks };
