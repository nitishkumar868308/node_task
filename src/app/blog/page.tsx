
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, addBlog, updateBlog, deleteBlog } from "@/app/redux/blog/blogSlice"; // ✅ Correct path
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash, Plus, Upload } from "lucide-react";
import { AppDispatch, RootState } from "@/app/redux/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../loading";

const BlogPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { blogs, loading } = useSelector((state: RootState) => state.blog);

    const [openModal, setOpenModal] = useState(false);
    const [editBlog, setEditBlog] = useState<any>(null);
    const [newBlog, setNewBlog] = useState({ title: "", image: "", description: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [deleteModal, setDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

    const [viewModal, setViewModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    const handleAddOrEdit = async () => {
        const formData = new FormData();
        formData.append("title", newBlog.title);
        formData.append("description", newBlog.description);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (editBlog) {
            console.log("Updating Blog ID:", editBlog); 
            formData.append("id", editBlog); 
            await dispatch(updateBlog({ id: editBlog, formData }));
            toast.success("Blog updated successfully!");
        } else {
            await dispatch(addBlog(formData));
            toast.success("Blog added successfully!");
        }

        resetForm();
        dispatch(fetchBlogs());
    };

    const handleDelete = async () => {
        if (blogToDelete) {
            console.log("Deleting Blog ID:", blogToDelete);
            await dispatch(deleteBlog(blogToDelete));
            toast.success("Blog deleted successfully!");
            dispatch(fetchBlogs()); 
        }
        setDeleteModal(false);
    };


    const resetForm = () => {
        setOpenModal(false);
        setEditBlog(null);
        setNewBlog({ title: "", image: "", description: "" });
        setImageFile(null);
    };

    return (
        <>
            <ToastContainer />
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Blog Management</h2>
                    <Button onClick={() => { setOpenModal(true); setEditBlog(null); }} className="flex items-center gap-2 cursor-pointer">
                        <Plus className="w-5 h-5" />
                        Add Blog
                    </Button>
                </div>

                {loading ? (
                    <Loading />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogs.map((blog) => (
                                <TableRow key={blog._id}>
                                    <TableCell>{blog.title}</TableCell>
                                    <TableCell>
                                        <img src={blog.image} alt={blog.title} className="w-16 h-16 object-cover rounded" />
                                    </TableCell>
                                    <TableCell>{blog.description?.slice(0, 50) || "No description available"}...</TableCell>

                                    <TableCell >
                                        <Button variant="secondary" className="cursor-pointer" onClick={() => {
                                            setSelectedBlog(blog);
                                            setViewModal(true);

                                        }}>
                                            View
                                        </Button>
                                        <Button variant="ghost" className="cursor-pointer" onClick={() => {
                                            setEditBlog(blog._id);
                                            setNewBlog({ title: blog.title, image: blog.image, description: blog.description });
                                            setOpenModal(true);
                                        }}>
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                        <Button variant="destructive" className="cursor-pointer" onClick={() => { setBlogToDelete(blog._id); setDeleteModal(true); }}>
                                            <Trash className="w-5 h-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Add/Edit Blog Modal */}
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editBlog ? "Edit Blog" : "Add Blog"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                placeholder="Blog Title"
                                value={newBlog.title}
                                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                            />
                            <Textarea
                                placeholder="Blog Description"
                                value={newBlog.description}
                                onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                            />
                            {/* File Upload */}
                            <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-md">
                                <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer">
                                    <Upload className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-600">Upload Image</span>
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            setNewBlog({ ...newBlog, image: URL.createObjectURL(file) });
                                        }
                                    }}
                                />
                            </div>
                            {newBlog.image && (
                                <img src={newBlog.image} alt="Blog Preview" className="w-32 h-32 object-cover rounded-md mt-2" />
                            )}
                        </div>
                        <DialogFooter>
                            <Button className="cursor-pointer" onClick={handleAddOrEdit}>{editBlog ? "Update Blog" : "Add Blog"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                        </DialogHeader>
                        <p>This action cannot be undone. Do you really want to delete this blog?</p>
                        <DialogFooter>
                            <Button className="cursor-pointer" variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
                            <Button className="cursor-pointer" variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


                {/* View Blog Modal */}
                <Dialog open={viewModal} onOpenChange={setViewModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedBlog?.title}</DialogTitle>
                        </DialogHeader>
                        {selectedBlog && (
                            <div className="space-y-4">
                                <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-64 object-cover rounded-sm" />
                                <p className="text-gray-700">{selectedBlog.description}</p>
                            </div>
                        )}
                        <DialogFooter>
                            <Button className="cursor-pointer" variant="ghost" onClick={() => setViewModal(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </>

    );
};

export default BlogPage;
