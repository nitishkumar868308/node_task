'use client';

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const Signup = () => {
    const [loading, setLoading] = useState(false);
    // const router = useRouter();

    // Form validation schema using Yup
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        profileImage: Yup.mixed<File>()
            .required('Profile image is required')
            .test('fileSize', 'File too large (Max: 1MB)', (value) => {
                return value instanceof File && value.size <= 1024 * 1024; // Max 1MB file size
            }),
    });

    // Formik setup
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            profileImage: null as File | null,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Simulating API call
                console.log("Signing up with:", values);
                // await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake API delay
                // router.push("/dashboard"); // Redirect on success
            } catch (error) {
                console.error("Signup failed:", error);
            } finally {
                setLoading(false);
            }
        },
    });

    // Handling image file change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            formik.setFieldValue("profileImage", file);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg bg-white">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...formik.getFieldProps("email")}
                                className="mt-2"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formik.errors.email}
                                </div>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...formik.getFieldProps("password")}
                                className="mt-2"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formik.errors.password}
                                </div>
                            )}
                        </div>

                        {/* Profile Image Field */}
                        <div className="mb-4">
                            <Label htmlFor="profileImage">Profile Image</Label>
                            <input
                                id="profileImage"
                                name="profileImage"
                                type="file"
                                accept="image/*"
                                className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleImageChange}
                            />
                            {formik.touched.profileImage && formik.errors.profileImage && (
                                <div className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formik.errors.profileImage}
                                </div>
                            )}
                            {formik.values.profileImage && (
                                <div className="mt-2 text-sm text-gray-600">Selected file: {formik.values.profileImage.name}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;
