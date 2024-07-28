"use server";

import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { RegisterParams } from "@/lib/types";

const register = async ({ fullname, email, password }: RegisterParams) => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) return "exists";

    const hashPswd = await bcrypt.hash(password, 5); // hashing pasword

    const user = new User({ fullname, email, password: hashPswd });
    await user.save();

    console.log("Registration successful!");
    return "ok";
  } catch (err) {
    console.error("Registration failed: ", err);
    return "err";
  }
};

// will continue
const forgotPassword = async ({
  fullname,
  email,
  password,
}: RegisterParams) => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) return "exists";

    // const hashPswd = await bcrypt.hash(password, 5); // hashing pasword

    // const user = new User({ fullname, email, password: hashPswd });
    // await user.save();

    console.log("Registration successful!");
    return "ok";
  } catch (err) {
    console.error("Registration failed: ", err);
    return "err";
  }
};

export { register, forgotPassword };
