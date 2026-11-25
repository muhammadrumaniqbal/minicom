
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AdminSidebar from "@/components/AdminSidebar";

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const hasCheckedSession = useRef(false);

  const isAdminLogin = pathname === "/admin/login";

  const isAdmin =
    !isAdminLogin &&
    (pathname === "/admin" || pathname.startsWith("/admin/"));

  const isHome = pathname === "/";

  useEffect(() => {
    if (hasCheckedSession.current) return;

    hasCheckedSession.current = true;

    const wasPageReloaded =
      typeof window !== "undefined" &&
      window.performance
        ?.getEntriesByType("navigation")
        ?.some((entry) => entry.type === "reload");

    if (!wasPageReloaded) return;

    let cancelled = false;

    async function logoutCustomerOnRefresh() {
      try {
        const sessionResponse = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!sessionResponse.ok) return;

        const session = await sessionResponse.json();

        // Admin sessions remain active after a page refresh.
        if (session.authenticated && session.role === "customer") {
          await fetch("/api/auth/logout", {
            method: "POST",
            cache: "no-store",
          });

          if (!cancelled) {
            router.replace("/sign-in");
            router.refresh();
          }
        }
      } catch (error) {
        console.error("Could not check the session:", error);
      }
    }

    logoutCustomerOnRefresh();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Admin login page
  if (isAdminLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1ea] px-5 py-12">
        {children}
      </main>
    );
  }

  // Admin layout
  if (isAdmin) {
    return (
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f5f1ea] md:flex-row">
        <AdminSidebar />

        <main className="min-h-screen w-full min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    );
  }

  // Customer storefront layout
  return (
    <>
      <Navbar />

      {isHome && <Hero />}

      <main className="min-h-screen">{children}</main>

      <Footer />
    </>
  );
}
