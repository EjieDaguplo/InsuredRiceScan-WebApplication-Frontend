import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/welcome", "/login"];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  // Get session data from cookies
  const userType = request.cookies.get("user_type")?.value;
  const userId = request.cookies.get("user_id")?.value;

  const isAuthenticated = !!(userType && userId);

  console.log("Middleware Check:", {
    pathname,
    userType,
    userId,
    isAuthenticated,
    isPublicPath,
  });

  // If trying to access protected route without session
  if (!isPublicPath && !isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If logged in and trying to access public paths, redirect to dashboard
  if (isPublicPath && isAuthenticated && pathname !== "/") {
    console.log("Already authenticated, redirecting to dashboard");
    const url = request.nextUrl.clone();

    if (userType === "farmer") {
      url.pathname = "/components/farmers/dashboard";
    } else if (userType === "admin" || userType === "super_admin") {
      url.pathname = "/admin/dashboard";
    }

    return NextResponse.redirect(url);
  }

  // Role-based access control - Farmer trying to access admin routes
  if (
    userType === "farmer" &&
    (pathname.startsWith("/admin") ||
      pathname === "/dashboard" ||
      pathname.startsWith("/farmers") ||
      pathname.startsWith("/add-farmer") ||
      pathname.startsWith("/claims") ||
      pathname.startsWith("/visits") ||
      pathname.startsWith("/check"))
  ) {
    console.log("Farmer trying to access admin route");
    const url = request.nextUrl.clone();
    url.pathname = "/components/farmers/dashboard";
    return NextResponse.redirect(url);
  }

  // Admin/SuperAdmin trying to access farmer routes
  if (
    (userType === "admin" || userType === "super_admin") &&
    (pathname.startsWith("/farmers") ||
      pathname.startsWith("/components/farmers"))
  ) {
    console.log("Admin trying to access farmer route");
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files (images, fonts, etc)
     */
    "/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
