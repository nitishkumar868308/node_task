'use client';

import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { registerUser } from "../redux/signup/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error } = useSelector((state: RootState) => state.auth); // Redux state

    // Form validation schema
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        profileImage: Yup.mixed<File>().required('Profile image is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            profileImage: null as File | null,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const result = await dispatch(registerUser(values)).unwrap();

                console.log("Signup Success:", result);
                if (result?.status === 400) {
                    toast.error(result?.message)
                }
                else {
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Signup failed:", error);
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

        <>
            <ToastContainer />
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

                            {/* Error Message */}
                            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>

    );
};

export default Signup;
