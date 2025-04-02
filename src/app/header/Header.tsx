"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface DashboardProps {
    children: ReactNode;
}

const Header = ({ children }: DashboardProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    console.log("session", session)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="w-full bg-gray-900 text-white p-5 flex justify-between items-center">
                <h2 className="text-xl font-bold">Dashboard</h2>
                <h1 className="text-2xl font-semibold">Welcome, {session?.user?.email}</h1>
                {/* Profile Image & Logout */}
                <div className="flex items-center gap-4">
                    {session?.user?.profileImage && (
                        <Image
                            src={session.user.profileImage}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full border border-gray-300"
                        />
                    )}
                    <Button
                        variant="destructive"
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100">
                {children}
            </main>
        </div>
    );
};

export default Header;
