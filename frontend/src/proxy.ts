import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const publicRoutes = ["/signin", "/signup"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // NextAuth sets different cookie names depending on environment:
    // - HTTP (dev):   next-auth.session-token
    // - HTTPS (prod): __Secure-next-auth.session-token
    const token =
        req.cookies.get("next-auth.session-token")?.value ??
        req.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [ "/signin", "/signup", "/profile/:path*"],
};
