
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/backend/auth";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  const session = verifySessionToken(
    request.cookies.get(COOKIE_NAME)?.value
  );

  const isAdminPage =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isCustomerProtectedPage =
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/cart" ||
    pathname.startsWith("/cart/") ||
    pathname === "/wishlist" ||
    pathname.startsWith("/wishlist/");

  // Always allow the account choice page to open.
  if (pathname === "/sign-in") {
    return NextResponse.next();
  }

  // Keep the admin login separate from customer login.
  if (pathname === "/admin/login") {
    if (session?.role === "admin") {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    return NextResponse.next();
  }

  // Customers who are already signed in can go to checkout.
  if (pathname === "/login") {
  return NextResponse.next();
}

  // Admin pages require an admin session.
  // The /admin/login exception is handled above.
  if (isAdminPage && session?.role !== "admin") {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  // Cart, wishlist, account and checkout require a customer.
  if (
    isCustomerProtectedPage &&
    session?.role !== "customer"
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const isWriteMethod = [
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ].includes(method);

  const isProductOrCategoryWrite =
    (
      pathname === "/api/product" ||
      pathname.startsWith("/api/product/") ||
      pathname === "/api/category" ||
      pathname.startsWith("/api/category/")
    ) && isWriteMethod;

  const isOrderEndpoint =
    pathname === "/api/order" ||
    pathname.startsWith("/api/order/");

  // Creating an order requires a customer.
  // Other order-management actions require an admin.
  if (isOrderEndpoint) {
    if (
      pathname === "/api/order" &&
      method === "POST"
    ) {
      if (session?.role !== "customer") {
        return NextResponse.json(
          {
            success: false,
            message: "Please sign in as a customer.",
          },
          { status: 401 }
        );
      }
    } else if (session?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }
  }

  // Product/category writes and admin APIs require an admin.
  const isAdminApi =
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/") ||
    isProductOrCategoryWrite;

  if (isAdminApi && session?.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Admin access required.",
      },
      { status: 403 }
    );
  }

  // Allow public browsing only on the intended pages.
  if (!pathname.startsWith("/api/")) {
    const isAllowedPublicPage =
      pathname === "/" ||
      pathname === "/shop" ||
      pathname.startsWith("/shop/") ||
      pathname.startsWith("/product/") ||
      pathname === "/sign-in" ||
      pathname === "/login" ||
      pathname === "/admin/login" ||
      isAdminPage ||
      isCustomerProtectedPage;

    if (!isAllowedPublicPage) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
