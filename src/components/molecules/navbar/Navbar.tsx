"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { logOut } from "@/auth/nextjs/actions";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Navbar({ user }: any) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user?.name);

  console.log("i18n language:", i18n.language);
  console.log("i18n", i18n);
  console.log("tttttt", t);
  console.log("Test HOME:", t("HOME"));
  console.log("SIGN_UP:", t("SIGN_UP"));

  const navLinks = [
    { href: "/", label: t("HOME") },
    { href: "/tours", label: t("TOURS") },
    { href: "/destinations", label: t("DESTINATIONS") },
    { href: "/restaurants", label: t("RESTAURANT") },
    ...(user?.role === "operator"
      ? [{ href: "/operator/dashboard", label: t("OPERATOR") }]
      : []),
    ...(user?.role === "user"
      ? [{ href: "/profile", label: t("PROFILE") }]
      : []),
  ];

  return (
    <nav className="bg-[#0CAFB9] text-white py-0 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className=" font-bold tracking-wide uppercase">
          <Link href="/" className="text-white hover:text-orange-300">
            <img
              className="w-36 h-26 rounded-b-full"
              src="/logo.png"
              alt="logo"
            />
          </Link>
        </div>

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
                href="/sign-in"
                className="text-white border border-white px-4 py-1 rounded-full text-sm hover:bg-white hover:text-[#0CAFB9] transition-colors"
              >
                {t("SIGN_IN")}
              </Link>
              <Link
                href="/sign-up"
                className="bg-orange-400 text-white px-4 py-1 rounded-full text-sm hover:bg-orange-500 transition-colors"
              >
                {t("SIGN_UP")}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={
                  user?.role === "client" ? "/profile" : "/operator/dashboard"
                }
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-700"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={`${user.name}'s profile`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span>👤</span>
                )}
              </Link>

              <span className="text-lg font-medium">Hi {user?.name}!</span>
              <button
                onClick={() => {
                  logOut();
                  setIsLoggedIn(false);
                }}
                className="bg-white text-[#0CAFB9] px-4 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors"
              >
                {t("LOG_OUT")}
              </button>
            </div>
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
                  {t("SIGN_IN")}{" "}
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-40 bg-orange-400 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-500 transition-colors"
                >
                  {t("SIGN_UP")}{" "}
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {user?.image && (
                  <img
                    src={user?.image}
                    alt={`${user?.name}'s profile`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-lg font-medium">Hi {user?.name}! </span>
                <button
                  onClick={() => {
                    logOut();
                    setIsOpen(false);
                  }}
                  className="bg-white text-[#0CAFB9] px-4 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors"
                >
                  {t("LOG_OUT")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
