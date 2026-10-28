"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Store,
  X,
  Menu,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function SidebarContent({ mobile = false }) {
    const isCollapsed = collapsed && !mobile;

    return (
      <div className="flex h-full min-h-0 flex-col bg-[#302c25] text-[#fffaf1]">
        {/* Header and desktop collapse control */}
        <div
          className={`flex h-[82px] shrink-0 items-center border-b border-white/10 ${
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {!isCollapsed && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex min-w-0 items-center gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d6bd96] text-[#302c25]">
                <Store size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-xl font-semibold tracking-wide">minicom</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Admin studio
                </p>
              </div>
            </Link>
          )}

          {mobile ? (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCollapsed((previous) => !previous)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/75 transition hover:border-[#d6bd96]/50 hover:bg-white/10 hover:text-[#d6bd96]"
            >
              {collapsed ? (
                <PanelLeftOpen size={19} />
              ) : (
                <PanelLeftClose size={19} />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className={`min-h-0 flex-1 overflow-y-auto py-7 ${isCollapsed ? "px-2" : "px-4"}`}>
          {!isCollapsed && (
            <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Workspace
            </p>
          )}

          <nav className="space-y-1.5">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  title={isCollapsed ? label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center rounded-xl py-3.5 text-sm transition duration-200 ${
                    isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
                  } ${
                    active
                      ? "bg-[#d6bd96] font-semibold text-[#302c25]"
                      : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.8} className="shrink-0" />

                  {!isCollapsed && <span>{label}</span>}

                  {!isCollapsed && active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#655039]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Storefront link */}
        <div className={`shrink-0 border-t border-white/10 ${isCollapsed ? "p-2" : "p-4"}`}>
          <Link
            href="/"
            title={isCollapsed ? "Visit storefront" : undefined}
            className={`flex items-center rounded-xl py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-[#d6bd96] ${
              isCollapsed ? "justify-center" : "justify-between px-3"
            }`}
          >
            {isCollapsed ? (
              <Store size={19} />
            ) : (
              <>
                <span className="flex items-center gap-3">
                  <Store size={18} />
                  Visit storefront
                </span>
                <ArrowUpRight size={16} />
              </>
            )}
          </Link>

          {!isCollapsed && (
            <p className="mt-3 px-3 text-[10px] tracking-wide text-white/30">
              MINICOM Admin Studio
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#e6dfd3] bg-[#fffdf9] px-4 md:hidden">
        <Link href="/admin" className="font-semibold tracking-wide text-[#302c25]">
          minicom <span className="font-normal text-[#a58b61]">/ Admin</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open admin menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#302c25] text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-in-out md:flex ${
          collapsed ? "w-[78px]" : "w-[260px]"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50"
          />
          <LogoutButton className="w-full justify-center bg-[#493728] text-white hover:bg-[#30251e]" />

          <aside className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] shadow-2xl">
            <SidebarContent mobile />
          </aside>
        </div>
      )}
    </>
  );
}