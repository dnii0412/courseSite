"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn(undefined, { callbackUrl: "/" })}
        className="px-3 py-1.5 rounded-lg border"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Image
        src={session.user.image ?? "/avatar.png"}
        alt="avatar"
        width={32}
        height={32}
        className="rounded-full"
      />
      <span className="text-sm">{session.user.name ?? session.user.email}</span>
      <button onClick={() => signOut({ callbackUrl: "/" })} className="px-2 py-1 rounded border">
        Sign out
      </button>
    </div>
  );
}
