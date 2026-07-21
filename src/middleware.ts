import { withAuth } from "next-auth/middleware";

// Protect the admin dashboard; send unauthenticated users to /login.
export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/admin/:path*"],
};
