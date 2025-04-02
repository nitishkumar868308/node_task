/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Blog {
    id: string;
    title: string;
    description: string;
    image?: string;
}

interface BlogState {
    blogs: Blog[];
    loading: boolean;
    error: string | null;
}

// Fetch all blogs
export const fetchBlogs = createAsyncThunk<Blog[], void, { rejectValue: string }>(
    "blog/fetchBlogs",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch("/api/blog");
            if (!res.ok) throw new Error("Failed to fetch blogs");
            const data = await res.json();
            console.log("data", data)
            return data
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Add a new blog
export const addBlog = createAsyncThunk<Blog, FormData, { rejectValue: string }>(
    "blog/addBlog",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to add blog");
            return await res.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBlog = createAsyncThunk<
    Blog, // ✅ Expected return type
    { id: string; formData: FormData }, // ✅ Payload structure
    { rejectValue: string } // ✅ Error handling
>(
    "blog/updateBlog",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            if (!id) throw new Error("Blog ID is required for updating."); // ✅ ID check

            formData.append("id", id); // ✅ ID ko FormData me add karna zaroori hai

            const res = await fetch(`/api/blog`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update blog");
            }

            return await res.json();
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);




export const deleteBlog = createAsyncThunk<
    string, // ✅ Expected return type (deleted blog ID)
    string, // ✅ Payload: Blog ID
    { rejectValue: string } // ✅ Error handling
>(
    "blog/deleteBlog",
    async (id, { rejectWithValue }) => {
        try {
            if (!id) throw new Error("Blog ID is required for deletion."); // ✅ ID check

            const res = await fetch(`/api/blog`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }), // ✅ ID ko JSON body me send karo
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete blog");
            }

            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);


// Blog slice
const blogSlice = createSlice({
    name: "blog",
    initialState: { blogs: [], loading: false, error: null } as BlogState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(addBlog.fulfilled, (state, action) => {
                state.blogs.push(action.payload);
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
                if (index !== -1) state.blogs[index] = action.payload;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
            });
    },
});

export default blogSlice.reducer;