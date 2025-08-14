import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NavUser from "./nav-user";

const links = [
    { href: "/courses", label: "Courses" },
    { href: "/gallery", label: "Gallery" },
];

export default async function Navbar() {
    const session = await getServerSession(authOptions);

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                {/* Brand */}
                <Link href="/" className="text-xl font-semibold">New Era</Link>

                {/* Desktop nav */}
                <nav className="hidden gap-8 md:flex">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 data-[active=true]:text-gray-900"
                            data-active={l.href === (typeof window === "undefined" ? "" : window.location?.pathname)}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side: user/auth (client) */}
                <NavUser session={session} />

                {/* Mobile menu trigger (client will handle) */}
                <div className="md:hidden">
                    <NavUser.MobileMenu links={links} session={session} />
                </div>
            </div>
        </header>
    );
}
