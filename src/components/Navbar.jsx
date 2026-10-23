"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import {
  Menu,
  X,
  Search,
  Contact,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { wishlist = [] } = useWishlist();

  const wishlistCount = wishlist.length;

  // Fetch products once when the navbar loads.
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/product");

        setProducts(
          Array.isArray(response.data.res) ? response.data.res : []
        );
      } catch (error) {
        console.error("Failed to load search products:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter live search results.
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return products
      .filter((product) => {
        const title = String(product.title || "").toLowerCase();

        const category =
          typeof product.category === "object"
            ? String(product.category?.title || "").toLowerCase()
            : "";

        return title.includes(query) || category.includes(query);
      })
      .slice(0, 6);
  }, [search, products]);

  function handleSearch(e) {
    e?.preventDefault();

    const query = search.trim();

    if (!query) return;

    setMenuOpen(false);
    window.location.href = `/shop?search=${encodeURIComponent(query)}`;
  }

  function getProductImage(product) {
    return (
      (typeof product.image === "string" && product.image) ||
      (typeof product.images?.[0] === "string"
        ? product.images[0]
        : product.images?.[0]?.url) ||
      product.imageUrl ||
      product.thumbnail ||
      ""
    );
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  }

  return (
    <header className="absolute left-0 top-0 z-50 w-full bg-transparent">
      <nav
        className={`mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-4 py-5 transition-colors duration-300 sm:px-5 md:gap-6 md:px-10 lg:gap-8 lg:px-4 ${
          isHomePage ? "bg-transparent" : "bg-[#E8DCC8]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="mr-2 shrink-0 text-2xl font-black tracking-[-1.5px] text-white transition-colors duration-300 hover:text-yellow-400 sm:mr-6 sm:text-3xl lg:mr-10"
        >
          minicom<span className="text-yellow-400">.</span>
        </Link>

        {/* Menu and search */}
        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
          {/* Menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex shrink-0 items-center gap-2 border border-white px-2 py-3 text-white transition-colors duration-300 hover:text-yellow-400 sm:px-3"
          >
            {menuOpen ? (
              <X size={22} strokeWidth={1.8} />
            ) : (
              <Menu size={22} strokeWidth={1.8} />
            )}

            <span className="hidden text-xs tracking-wider sm:inline">
              MENU
            </span>
          </button>

          {/* Search input and live results */}
          <div className="relative min-w-0 max-w-[420px] flex-1">
            <form
              onSubmit={handleSearch}
              className="flex min-w-0 items-center overflow-hidden rounded-sm border border-white bg-white transition-all duration-300 focus-within:border-yellow-400"
            >
              <Search
                size={19}
                className="ml-3 shrink-0 text-neutral-500 sm:ml-4"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                autoComplete="off"
                className="w-full min-w-0 bg-transparent px-2 py-3 text-sm text-black outline-none placeholder:text-black/60 sm:px-3"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="mr-3 text-neutral-500 transition-colors hover:text-black"
                >
                  <X size={17} />
                </button>
              )}
            </form>

            {/* Live search dropdown */}
            {search.trim() && (
              <div className="absolute left-0 top-full z-[100] mt-2 max-h-[420px] w-full min-w-[260px] overflow-y-auto rounded-md border border-neutral-200 bg-white text-neutral-900 shadow-2xl sm:min-w-[340px]">
                {loadingProducts ? (
                  <p className="p-4 text-sm text-neutral-500">
                    Loading products...
                  </p>
                ) : filteredProducts.length > 0 ? (
                  <>
                    <p className="border-b border-neutral-100 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Matching products ({filteredProducts.length})
                    </p>

                    {filteredProducts.map((product) => {
                      const image = getProductImage(product);

                      const categoryTitle =
                        typeof product.category === "object"
                          ? product.category?.title
                          : "";

                      return (
                        <Link
                          key={product._id}
                          href={`/shop/${product._id}`}
                          onClick={() => {
                            setSearch("");
                            setMenuOpen(false);
                          }}
                          className="flex items-center gap-3 border-b border-neutral-100 p-3 transition-colors last:border-b-0 hover:bg-neutral-50"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-neutral-100">
                            {image ? (
                              <img
                                src={image}
                                alt={product.title || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-semibold text-neutral-900">
                              {product.title}
                            </p>

                            {categoryTitle && (
                              <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                                {categoryTitle}
                              </p>
                            )}

                            <p className="mt-1 text-sm font-bold text-neutral-900">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <span className="shrink-0 text-neutral-400">
                            →
                          </span>
                        </Link>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleSearch}
                      className="w-full bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-yellow-400"
                    >
                      View all results for "{search.trim()}"
                    </button>
                  </>
                ) : (
                  <div className="p-5">
                    <p className="text-sm font-semibold text-neutral-800">
                      No matching products found
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Try another product title or category.
                    </p>

                    <button
                      type="button"
                      onClick={handleSearch}
                      className="mt-3 text-sm font-semibold text-neutral-800 underline hover:text-yellow-600"
                    >
                      Search the shop anyway
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop search button */}
          <button
            type="button"
            onClick={handleSearch}
            className="hidden shrink-0 items-center gap-2 rounded-sm bg-yellow-400 px-5 py-3 text-xs font-bold text-black transition-all duration-300 ease-in-out hover:bg-black hover:text-white active:scale-95 sm:flex"
          >
            <Search size={17} />
            Search
          </button>
        </div>

        {/* Account, wishlist and shopping bag */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5 lg:gap-7">
          <Link
            href="/admin"
            aria-label="Account"
            className="group flex items-center gap-2 text-white transition-colors duration-300 hover:text-yellow-400"
          >
            <Contact size={23} strokeWidth={1.7} />

            <span className="hidden text-sm font-medium lg:inline">
              Account
            </span>
          </Link>

          {/* Wishlist with live count */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} saved ${
              wishlistCount === 1 ? "product" : "products"
            }`}
            className="group relative flex items-center gap-2 text-white transition-colors duration-300 hover:text-yellow-400"
          >
            <span className="relative inline-flex">
              <Heart
                size={23}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-bold leading-none text-black">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </span>

            <span className="hidden text-sm font-medium sm:inline">
              Wishlist
            </span>
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping bag"
            className="group flex items-center gap-2 text-white transition-colors duration-300 hover:text-yellow-400"
          >
            <ShoppingBag
              size={24}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </nav>

      {/* Mobile search button */}
      <div className="flex items-center gap-3 px-5 pb-4 sm:hidden">
        <button
          type="button"
          onClick={handleSearch}
          className="flex shrink-0 items-center gap-2 rounded-full bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition-all duration-300 hover:bg-black hover:text-white"
        >
          <Search size={16} />
          Search
        </button>

        <p className="truncate text-xs text-white/60">
          Find your next favorite
        </p>
      </div>

      {/* Dropdown menu */}
      <div
        className={`absolute left-0 top-full w-full border-t border-white/10 bg-neutral-950/95 backdrop-blur-xl transition-all duration-300 ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] flex-col gap-1 px-8 py-5 md:flex-row md:gap-8 md:px-14">
          {[
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            { name: "Categories", href: "/categories" },
            { name: "Wishlist", href: "/wishlist" },
            { name: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3 text-sm font-medium text-white transition-colors duration-300 hover:text-yellow-400"
            >
              <span>{item.name}</span>

              {item.name === "Wishlist" && wishlistCount > 0 && (
                <span className="ml-3 rounded-full bg-yellow-400 px-2 py-1 text-[10px] font-bold text-black">
                  {wishlistCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}