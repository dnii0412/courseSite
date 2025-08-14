"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

type Props = { session: Session | null };

export default function NavUser({ session }: Props) {
    if (!session?.user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/auth/login"
                    className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                    Sign In
                </Link>
                <Link
                    href="/auth/register"
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Sign Up
                </Link>
            </div>
        );
    }

    return <UserDropdown name={session.user.name} image={session.user.image} />;
}

function UserDropdown({ name, image }: { name?: string | null; image?: string | null }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-50"
            >
                <Image
                    src={image || "/placeholder-user.jpg"}
                    alt="avatar"
                    width={28}
                    height={28}
                    className="rounded-full"
                />
                <span className="hidden text-sm md:inline">{name || "Account"}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border bg-white shadow-lg">
                    <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50">
                        Profile
                    </Link>
                    <Link href="/dashboard" className="block px-3 py-2 text-sm hover:bg-gray-50">
                        Dashboard
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

export function MobileMenu({
    links,
    session,
}: {
    links: { href: string; label: string }[];
    session: Session | null;
}) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <button
                aria-label="Menu"
                onClick={() => setOpen((v) => !v)}
                className="rounded-lg border p-2"
            >
                ☰
            </button>
            {open && (
                <div className="absolute left-0 right-0 top-16 z-50 border-b bg-white p-4 shadow md:hidden">
                    <nav className="flex flex-col gap-3">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`text-base ${pathname === l.href ? "font-semibold text-gray-900" : "text-gray-600"}`}
                                onClick={() => setOpen(false)}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-4 border-t pt-4">
                        {!session?.user ? (
                            <div className="flex gap-2">
                                <Link href="/auth/login" onClick={() => setOpen(false)} className="rounded-lg border px-3 py-1.5 text-sm">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" onClick={() => setOpen(false)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                                className="w-full rounded-lg border px-3 py-1.5 text-sm text-left hover:bg-gray-50"
                            >
                                Sign out
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
