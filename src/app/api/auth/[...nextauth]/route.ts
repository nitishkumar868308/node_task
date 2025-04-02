import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ Correct Import

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // ✅ NextAuth v4 ke liye yeh syntax hai
