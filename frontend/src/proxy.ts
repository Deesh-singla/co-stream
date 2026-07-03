import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("next-auth.session-token")?.value;

    const { pathname } = req.nextUrl;

    const publicRoutes = ["/signin", "/signup"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/signin",
        "/signup",
        "/dashboard",
        "/profile/:path*",
    ],
};