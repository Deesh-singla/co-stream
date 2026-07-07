"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Upload, Play } from "lucide-react";

const Navbar = () => {
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);

    const isLoading = status === "loading";
    const isSignedIn = status === "authenticated";
    const username = session?.user?.name ?? session?.user?.email ?? "Account";

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white shadow-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-sm group-hover:bg-orange-600 transition-colors">
                        <Play size={14} fill="white" className="text-white translate-x-px" />
                    </div>
                    <span className="text-base font-bold tracking-tight text-gray-900">
                        co<span className="text-orange-500">stream</span>
                    </span>
                </Link>

                {/* Desktop menu */}
                <div className="hidden items-center gap-3 sm:flex">
                    {isLoading ? null : isSignedIn ? (
                        <>
                            <Link
                                href="/upload"
                                className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                            >
                                <Upload size={15} />
                                Upload
                            </Link>
                            <span className="text-sm text-gray-500 max-w-30 truncate">
                                {username}
                            </span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/signin" })}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/signin"
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 sm:hidden"
                    aria-label="Toggle menu"
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="flex flex-col gap-2 border-t border-orange-100 bg-white px-4 py-3 sm:hidden">
                    {isLoading ? null : isSignedIn ? (
                        <>
                            <span className="py-1 text-sm text-gray-500 truncate">{username}</span>
                            <Link
                                href="/upload"
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white"
                            >
                                <Upload size={15} />
                                Upload
                            </Link>
                            <button
                                onClick={() => { setOpen(false); signOut({ callbackUrl: "/signin" }); }}
                                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/signin"
                                onClick={() => setOpen(false)}
                                className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setOpen(false)}
                                className="rounded-lg bg-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
