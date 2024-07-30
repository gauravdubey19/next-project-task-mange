"use server";

import connectDB from "@/utils/db";
import User from "@/models/User";
import Admin from "@/components/Admin";

export const getUsers = async () => {
  try {
    await connectDB();
    const users: any = await User.find({});

    const usersList = users.map((user: any) => ({
      ...user.toObject(), // Converting Mongoose document to plain object
      _id: user._id.toString(), // Converting _id to string
    }));

    // return usersList;
    return <Admin users={usersList} />;
  } catch (error) {
    console.error("Fetching tasks error ->", error);
    return null;
  }
};
