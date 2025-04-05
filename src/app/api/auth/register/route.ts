import User from "@/core/models/userModel";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/core/validators/user.schema";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { ConnectDB } from "@/core/configs/mongoDB";

export async function POST(req: NextRequest) {
  try {
    // Database connection
    await ConnectDB();

    const formData = await req.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const role = formData.get("role") as string;

    const reqBody = {
      firstName,
      lastName,
      username,
      email,
      password,
    };

    const result = registerSchema.safeParse(reqBody);
    if (!result.success) {
      return errorHandler(400, result.error.issues[0].message, result.error);
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return errorHandler(400, "User already exists", null);
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user with the URL string
    let newUser;
    if (role) { // Check if role is provided (empty string is falsy)
      newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: passwordHash,
        roles: role,
      });
    } else {
      newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: passwordHash,
        roles: "User", // Default role
      });
    }

    // Save the user to MongoDB
    await newUser.save();

    return apiResponse("User created successfully", 201, undefined);
  } catch (error) {
    return errorHandler(500, "Internal server error", error);
  }
}