"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  { href: "/operator/dashboard", label: "Dashboard" },
  { href: "/operator/tours", label: "Tours" },
  { href: "/operator/bookings", label: "Bookings" },
  { href: "/operator/customers", label: "Customers" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-slate-900 text-white h-screen w-60 p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8 flex items-center gap-2">
        🚤 Boat Tours
      </h1>

      <nav className="flex flex-col gap-4 text-gray-300">
        <ul className="hidden md:flex gap-8 text-sm font-bold tracking-wide uppercase flex-col">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "hover:text-orange-300 transition-colors",
                    isActive ? "text-white font-semibold" : "text-gray-300"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
