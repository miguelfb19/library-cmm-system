import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  try {
    /* ------------------------------------------ */
    // GET TOKEN
    /* ------------------------------------------ */
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      cookieName:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
    });

    /* ------------------------------------------ */
    // AVOID MULRIPLE REDIRECTION BY AUTH ERROR
    /* ------------------------------------------ */
    if (!token) {
      // Get tries counter
      const redirectCount = parseInt(
        req.cookies.get("redirect_count")?.value || "0"
      );

      // Create redirection response
      const response = NextResponse.redirect(new URL("/auth/login", req.url));

      // If there is more than 2 tries, redirect with error message
      if (redirectCount >= 2) {
        return NextResponse.redirect(
          new URL("/auth/login?error=three_times", req.url)
        );
      }

      // Increment count with redirections
      response.cookies.set("redirect_count", (redirectCount + 1).toString(), {
        maxAge: 60 * 5, // 5 minutos
        path: "/",
      });

      return response;
    }

    const response = NextResponse.next();
    // Clean counter if token is valid
    response.cookies.delete("redirect_count");

    /* eslint-disable */
    const { data }: any = token;
    /* eslint-enable */

    /* ------------------------------------------ */
    // CHECK ADMIN ROUTES
    /* ------------------------------------------ */

    // Obtain actual route
    const path = req.nextUrl.pathname;

    // Rutes only admins
    const adminOnlyPaths = ["/dashboard/admin"];

    // Rutes only leaders
    const leaderOnlyPaths = ["/dashboard/leader"];

    // Rutes only productors
    const productorOnlyPaths = ["/dashboard/productor"];


    // Check actual route is only to leaders
    if (leaderOnlyPaths.some((route) => path.startsWith(route))) {
      // If not leader, redirect to dashboard
      if (data.role !== "leader" && data.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Check actual route is only to admins
    if (adminOnlyPaths.some((route) => path.startsWith(route))) {
      // If not admin, redirect to dashboard
      if (data.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Check actual route is only to productors
    if (productorOnlyPaths.some((route) => path.startsWith(route))) {
      // If not productor, redirect to dashboard
      if (data.role !== "productor" && data.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    /* ------------------------------------------ */
    // CHECK PROTECTED DASHBOARD
    /* ------------------------------------------ */
    if (data.role === "admin" || data.role === "productor" || data.role === "leader") {
      return response;
    }

    return NextResponse.redirect(new URL("/auth/login", req.url));
  } catch (error) {
    console.error(error);
    throw new Error("Error in middleware: " + error);
  }
}

export const config = {
  matcher: [
    // specific protected routes first
    "/dashboard/admin/:path*",
    "/dashboard/leader/:path*",
    "/dashboard/productor/:path*",
    // general dashboard route
    "/dashboard/:path*",
  ],
};
