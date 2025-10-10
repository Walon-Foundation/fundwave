"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-4">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={
              "text-sm px-3 py-1 rounded-md " +
              (active ? "bg-black text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200")
            }
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
