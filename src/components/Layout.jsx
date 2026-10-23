
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AdminSidebar from "@/components/AdminSidebar";
import { WishlistProvider } from "@/context/WishlistContext";

export default function Layout({ children }) {
  const pathname = usePathname();

  const isAdmin =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const isHome = pathname === "/";

  // Admin layout: keep the sidebar on every admin route.
  if (isAdmin) {
    return (
      <div className="flex min-h-screen w-full bg-[#f5f1ea]">
        <AdminSidebar />

        <div className="min-h-screen min-w-0 flex-1">
          {children}
        </div>
      </div>
    );
  }

  // Public layout: provide wishlist context to the Navbar and pages.
  return (
    <WishlistProvider>
      <>
        <Navbar />

        {isHome && <Hero />}

        <main className="min-h-screen">{children}</main>

        <Footer />
      </>
    </WishlistProvider>
  );
}