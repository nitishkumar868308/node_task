"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState("");

    // Form validation schema using Yup
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    // Formik setup
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            try {
                const res = await signIn("credentials", {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                });
                if (res?.error) {
                    setError("Invalid email or password");
                } else {
                    router.push("/dashboard");
                }
                setLoading(false);
            } catch (error) {
                console.error("Login failed:", error);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg bg-white">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
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
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formik.errors.password}
                                </div>
                            )}
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        {/* Submit Button */}
                        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>

                {/* Footer */}
                <CardFooter className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;

