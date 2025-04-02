import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/app/models/User";
import { UploadImage } from "@/lib/upload-image";

interface CloudinaryUploadResponse {
    secure_url: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // FormData Parsing
        const formData = await req.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const profileImage = formData.get("profileImage") as File;

        if (!email || !password || !profileImage) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists", status: 400 });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload Image
        const uploadedImage = await UploadImage(profileImage, "profile_pictures") as CloudinaryUploadResponse;

        const uploadedImageURL = uploadedImage.secure_url;

        // Create User
        const newUser = await User.create({
            email,
            password: hashedPassword,
            profileImage: uploadedImageURL,
        });

        return NextResponse.json({
            message: "User created successfully",
            status: 201,
            user: { id: newUser._id, email: newUser.email, profileImage: uploadedImageURL }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
