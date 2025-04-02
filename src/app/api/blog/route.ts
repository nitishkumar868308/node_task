/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/app/models/Blog"; // Blog model
import { UploadImage } from "@/lib/upload-image"; // Cloudinary Image Upload



// 🟢 CREATE BLOG (POST)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const image = formData.get("image") as File | null;
        console.log(title, description, image)

        if (!title || !description || !image) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Upload image to Cloudinary
        const imageUrl = await UploadImage(image, "blog_image");
        console.log("Uploaded Image URL:", imageUrl);

        const newBlog = new Blog({ title, description, image: imageUrl.secure_url });
        await newBlog.save();

        return NextResponse.json({ message: "Blog created", blog: newBlog }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// 🟡 GET ALL BLOGS
export async function GET() {
    try {
        await connectDB();
        const blogs = await Blog.find();
        return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

// 🔴 DELETE BLOG (BY ID)
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json(); // ✅ JSON body parse karo
        const blogId = body.id; // ✅ ID ab JSON body se milegi

        if (!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }

        await Blog.findByIdAndDelete(blogId);
        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const blogId = formData.get("id") as string; // ✅ ID yahan mil rahi hai

        if (!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const image = formData.get("image") as File | null;

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const updateData: any = { title, description };

        if (image) {
            updateData.image = await UploadImage(image, "blog_image");
        }

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });

        if (!updatedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Blog updated", blog: updatedBlog }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
    }
}


