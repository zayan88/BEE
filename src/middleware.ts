export { default } from "next-auth/middleware";

// Protect the admin dashboard. NextAuth redirects unauthenticated users to
// the sign-in page configured in authOptions.pages.signIn.
export const config = {
  matcher: ["/admin/:path*"],
};
