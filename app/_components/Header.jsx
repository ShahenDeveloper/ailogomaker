"use client";
import { Button } from "../../components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const { user } = useUser();

  return (
    <div className="px-4 sm:px-10 lg:px-32 xl:px-48 2xl:px-56 py-4 flex justify-between items-center shadow-sm bg-white z-50">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={140}
          height={100}
          className="w-14 h-14"
        />
      </Link>

      <div className="hidden md:flex items-center gap-3">
        <Link href="/pricing" className="hover:text-primary transition">
          <Button variant="ghost">Pricing</Button>
        </Link>

        {user ? (
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <SignInButton>
            <Button>Get Started</Button>
          </SignInButton>
        )}
        <UserButton />
      </div>

      <div className="md:hidden flex items-center gap-2">
        <Link href="/pricing">
          <Button variant="ghost" size="sm">
            Pricing
          </Button>
        </Link>

        {user ? (
          <Link href="/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>
        ) : (
          <SignInButton>
            <Button size="sm">Get Started</Button>
          </SignInButton>
        )}
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
