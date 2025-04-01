import User from "@/core/models/userModel";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/core/validators/user.schema";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { ConnectDB } from "@/core/configs/mongoDB";
import { supabase } from "@/core/configs/supabase";

export async function POST(req: NextRequest) {
  try {
    // Database connection
    await ConnectDB();

    const formData = await req.formData();
    const profilePicture = formData.get("profilePicture") as File;
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

    if (!profilePicture) {
      return errorHandler(400, "Profile picture is required", null);
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return errorHandler(400, "User already exists", null);
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Convert file to buffer for Supabase upload
    const buffer = await profilePicture.arrayBuffer();
    const bytes = Buffer.from(buffer);

    //filname
    const filename = `${Date.now()} - ${username} - ${profilePicture.name}`;
    // Upload file to Supabase Storage
    const { error } = await supabase.storage
      .from('files')
      .upload(filename, bytes, {
        cacheControl: '3600',
        upsert: false,
        contentType: profilePicture.type, // Use the file's MIME type
      });

    if (error) {
      return errorHandler(500, "Failed to upload profile picture", error.message);
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from("files").getPublicUrl(filename);
    const profilePictureUrl = urlData.publicUrl; // Extract the string URL

    // Create new user with the URL string
    let newUser;
    if (role) { // Check if role is provided (empty string is falsy)
      newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: passwordHash,
        profilePicture: profilePictureUrl, // Use the string URL
        roles: role,
      });
    } else {
      newUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: passwordHash,
        profilePicture: profilePictureUrl, // Use the string URL
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