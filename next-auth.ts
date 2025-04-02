

declare module "next-auth" {
  interface User {
    id: string;
    profileImage?: string; // Add profileImage field
  }

  interface Session {
    user: User; // Ensure session.user has the updated User type
  }
}
