import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
    title: string;
    image: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        image: { type: String, required: true }, 
        description: { type: String, required: true },
    },
    { timestamps: true } // Auto createdAt & updatedAt fields
);

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
