"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import React from "react";
import { useSession, signOut } from "next-auth/react"; // 👈 ADD THIS

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/public/tours", label: "TOURS" },
  { href: "/destinations", label: "DESTINATIONS" },
  { href: "/restaurants", label: "RESTAURANTS" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession(); // 👈 GET session data

  console.log("session: ", session);

  const isLoggedIn = !!session;

  return (
    <nav className="bg-[#0CAFB9] text-white py-5 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-lg font-bold tracking-wide uppercase">Brand</div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-8 text-sm font-bold tracking-wide uppercase">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "hover:text-orange-300 transition-colors",
                    isActive
                      ? "text-orange-400 border-b-2 border-orange-400 pb-1"
                      : "text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                href="/auth/signin"
                className="text-white border border-white px-4 py-1 rounded-full text-sm hover:bg-white hover:text-[#0CAFB9] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-orange-400 text-white px-4 py-1 rounded-full text-sm hover:bg-orange-500 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-white text-[#0CAFB9] px-4 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Hamburger Toggle for Mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 text-center">
          <ul className="flex flex-col gap-4 font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      "block text-lg",
                      isActive ? "text-orange-400" : "text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-3 items-center mt-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-40 text-white border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-[#0CAFB9] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-40 bg-orange-400 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-500 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-40 bg-white text-[#0CAFB9] px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
