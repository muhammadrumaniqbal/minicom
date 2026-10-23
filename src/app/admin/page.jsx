
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  AlertTriangle,
  Plus,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Users,
  ClipboardList,
  Menu,
  X,
  Settings,
  ChevronRight,
  Search,
  ExternalLink,
  Sofa,
} from "lucide-react";



const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] =
          await Promise.all([
            axios.get("/api/product"),
            axios.get("/api/category"),
          ]);

        const productData =
          productResponse.data.res ||
          productResponse.data.products ||
          productResponse.data.data ||
          [];

        const categoryData =
          categoryResponse.data.res ||
          categoryResponse.data.categories ||
          categoryResponse.data.data ||
          [];

        setProducts(Array.isArray(productData) ? productData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const totalStock = products.reduce(
    (total, product) =>
      total + Math.max(0, Number(product.stock) || 0),
    0
  );

  const lowStock = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 5
  ).length;

  const outOfStock = products.filter(
    (product) => Number(product.stock ?? 0) <= 0
  ).length;

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      note: "Products in your collection",
      icon: Package,
      accent: "bg-[#e9e0d1] text-[#765b3e]",
      number: "text-[#453728]",
    },
    {
      title: "Categories",
      value: categories.length,
      note: "Organized collections",
      icon: Tags,
      accent: "bg-[#e4e6d9] text-[#68704d]",
      number: "text-[#424833]",
    },
    {
      title: "Total Inventory",
      value: totalStock.toLocaleString(),
      note: "Units currently in stock",
      icon: Boxes,
      accent: "bg-[#e3e9e6] text-[#527365]",
      number: "text-[#334d42]",
    },
    {
      title: "Needs Attention",
      value: lowStock + outOfStock,
      note: `${lowStock} low stock · ${outOfStock} sold out`,
      icon: AlertTriangle,
      accent: "bg-[#f1e1d2] text-[#a15f35]",
      number: "text-[#814c2c]",
    },
  ];

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const filteredProducts = recentProducts.filter((product) =>
    (product.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function money(amount) {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  }

  function getImage(product) {
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

  function getCategoryName(product) {
    if (
      product.category &&
      typeof product.category === "object"
    ) {
      return product.category.title || "Uncategorized";
    }

    return (
      categories.find(
        (category) =>
          String(category._id) === String(product.category)
      )?.title || "Uncategorized"
    );
  }

  function getStockStatus(stock) {
    if (stock == null || !Number.isFinite(Number(stock))) {
      return {
        label: "Unknown",
        style: "bg-stone-100 text-stone-600",
        dot: "bg-stone-400",
      };
    }

    if (Number(stock) <= 0) {
      return {
        label: "Out of stock",
        style: "bg-[#f5e3dc] text-[#a14d36]",
        dot: "bg-[#b65e45]",
      };
    }

    if (Number(stock) <= 5) {
      return {
        label: "Low stock",
        style: "bg-[#f3ead1] text-[#8d7130]",
        dot: "bg-[#b59445]",
      };
    }

    return {
      label: "In stock",
      style: "bg-[#e4eadf] text-[#536a49]",
      dot: "bg-[#718a62]",
    };
  }



  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#39352d] lg:flex">

 

      {/* Main dashboard */}
      <main className="min-w-0 flex-1">
        {/* Top navigation */}
        <header className="sticky top-0 z-30 border-b border-[#e7dfd3] bg-[#f5f1ea]/95 backdrop-blur-md">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="rounded-xl border border-[#e3dacd] bg-white p-2.5 transition hover:bg-[#eee5d8] lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94836d]">
                  MINICOM / ADMIN
                </p>
                <p className="mt-1 text-sm font-semibold text-[#373126]">
                  Store overview
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[#ded2c0] bg-white px-3 py-2.5 text-xs font-semibold text-[#514432] transition hover:border-[#b99d76] hover:bg-[#eee5d8] sm:px-4 sm:text-sm"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">View Store</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
          {/* Page heading */}
          <section className="relative mb-8 overflow-hidden rounded-[24px] bg-[#e7dccb] px-6 py-8 sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border border-[#c6b397]/60" />
            <div className="pointer-events-none absolute -right-1 top-8 h-44 w-44 rounded-full border border-[#c6b397]/60" />
            <div className="pointer-events-none absolute -bottom-24 right-36 h-44 w-44 rounded-full bg-[#d8c7af]/50" />

            <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cdbba1] bg-[#f4ece1]/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6e5940]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7d8964]" />
                  Your store at a glance
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-[#332b21] sm:text-4xl lg:text-[42px]">
                  Good to see you.
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-6 text-[#71624f] sm:text-base">
                  Manage your collection, keep an eye on inventory,
                  and make your store feel exceptional.
                </p>
              </div>

              <Link
                href="/admin/products/form"
                className="relative inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#373126] px-5 py-3.5 text-sm font-semibold text-[#fffaf2] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#55452f] sm:self-center"
              >
                <Plus size={18} />
                Add New Product
              </Link>
            </div>
          </section>

          {loading ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9dfd0]">
                <Loader2 size={26} className="animate-spin text-[#756044]" />
              </div>
              <p className="text-sm text-[#817564]">
                Preparing your dashboard...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#e7c9bc] bg-[#f8eae4] p-6">
              <p className="font-semibold text-[#8c4937]">
                Something went wrong
              </p>
              <p className="mt-2 text-sm text-[#9b6655]">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-[#794a37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e392b]"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a876d]">
                      At a glance
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#373126]">
                      Store performance
                    </h2>
                  </div>

                  <span className="hidden text-xs text-[#938774] sm:block">
                    Live data from your store
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.title}
                        className="group rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#cdb99b] hover:shadow-[0_12px_30px_rgba(69,54,35,0.07)] sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-[#827665]">
                              {stat.title}
                            </p>

                            <p className={`mt-4 text-3xl font-semibold tracking-tight ${stat.number}`}>
                              {stat.value}
                            </p>
                          </div>

                          <div className={`rounded-2xl p-3.5 transition duration-300 group-hover:scale-105 ${stat.accent}`}>
                            <Icon size={22} strokeWidth={1.7} />
                          </div>
                        </div>

                        <div className="mt-5 flex items-center gap-2 border-t border-[#eee7dc] pt-4">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            index === 3 ? "bg-[#b59445]" : "bg-[#82906a]"
                          }`} />
                          <p className="text-xs text-[#938775]">
                            {stat.note}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Management links */}
              <section className="mt-10">
                <div className="mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a876d]">
                    Workspace
                  </p>
                  <h2 className="mt-1.5 text-xl font-semibold text-[#373126]">
                    Manage your store
                  </h2>
                  <p className="mt-1.5 text-sm text-[#8b806f]">
                    Everything you need to keep Minicom running smoothly.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {navigation.slice(1).map((item, index) => {
                    const Icon = item.icon;
                    const accents = [
                      "bg-[#e9e0d1] text-[#765b3e]",
                      "bg-[#e4e6d9] text-[#68704d]",
                      "bg-[#f1e4d3] text-[#916e40]",
                      "bg-[#e3e9e6] text-[#527365]",
                    ];

                    const descriptions = [
                      "Update details, pricing and stock.",
                      "Organize your products into collections.",
                      "Review and manage customer orders.",
                      "Keep track of your customer base.",
                    ];

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="group flex items-center gap-4 rounded-2xl border border-[#e8dfd2] bg-[#fffdf9] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#cdb99b] hover:shadow-[0_12px_30px_rgba(69,54,35,0.07)]"
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accents[index]}`}>
                          <Icon size={22} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-[#40372a]">
                            {item.label}
                          </h3>
                          <p className="mt-1 text-xs leading-5 text-[#938775]">
                            {descriptions[index]}
                          </p>
                        </div>

                        <ArrowRight
                          size={17}
                          className="shrink-0 text-[#b5a58f] transition duration-200 group-hover:translate-x-1 group-hover:text-[#67523a]"
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Recent products */}
              <section className="mt-10 overflow-hidden rounded-2xl border border-[#e8dfd2] bg-[#fffdf9]">
                <div className="flex flex-col justify-between gap-4 border-b border-[#eee7dc] px-5 py-6 sm:flex-row sm:items-center sm:px-7">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a876d]">
                      Your inventory
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold text-[#373126]">
                      Recent products
                    </h2>
                    <p className="mt-1 text-sm text-[#938775]">
                      The latest additions to your collection.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a49783]"
                      />
                      <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search products..."
                        aria-label="Search recent products"
                        className="w-full rounded-xl border border-[#e6ddcf] bg-[#faf7f1] py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-[#aa9e8c] focus:border-[#bda582] sm:w-52"
                      />
                    </div>

                    <Link
                      href="/admin/products"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#373126] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#55452f]"
                    >
                      All Products
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee6d9] text-[#8a7658]">
                      <Package size={25} strokeWidth={1.5} />
                    </div>

                    <h3 className="mt-4 font-semibold text-[#40372a]">
                      {products.length === 0
                        ? "Your collection starts here"
                        : "No matching products"}
                    </h3>

                    <p className="mt-2 text-sm text-[#938775]">
                      {products.length === 0
                        ? "Add your first product to bring your store to life."
                        : "Try searching with a different product name."}
                    </p>

                    {products.length === 0 && (
                      <Link
                        href="/admin/products/form"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#373126] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#55452f]"
                      >
                        <Plus size={17} />
                        Add your first product
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left">
                      <thead>
                        <tr className="bg-[#faf7f1] text-[10px] uppercase tracking-[0.16em] text-[#958671]">
                          <th className="px-6 py-4 font-semibold">
                            Product
                          </th>
                          <th className="px-5 py-4 font-semibold">
                            Category
                          </th>
                          <th className="px-5 py-4 font-semibold">
                            Price
                          </th>
                          <th className="px-5 py-4 font-semibold">
                            Stock
                          </th>
                          <th className="px-5 py-4 font-semibold">
                            Status
                          </th>
                          <th className="px-5 py-4 text-right font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#f0e9df]">
                        {filteredProducts.map((product) => {
                          const image = getImage(product);
                          const stock =
                            product.stock == null
                              ? null
                              : Number(product.stock);
                          const status = getStockStatus(stock);

                          return (
                            <tr
                              key={product._id}
                              className="group transition hover:bg-[#faf7f1]"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3.5">
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={product.title || "Product"}
                                      className="h-14 w-14 rounded-xl border border-[#eee5d8] bg-[#f0ebe2] object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#eee6d9] text-[#a3937a]">
                                      <Package size={22} />
                                    </div>
                                  )}

                                  <div className="min-w-0">
                                    <p className="max-w-[210px] truncate text-sm font-semibold text-[#40372a]">
                                      {product.title || "Untitled product"}
                                    </p>
                                    <p className="mt-1 text-xs text-[#a09583]">
                                      ID: {String(product._id).slice(-7)}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4 text-sm text-[#827665]">
                                {getCategoryName(product)}
                              </td>

                              <td className="px-5 py-4 text-sm font-semibold text-[#4a3c2b]">
                                {money(product.price)}
                              </td>

                              <td className="px-5 py-4 text-sm text-[#665b4c]">
                                {stock === null || !Number.isFinite(stock)
                                  ? "—"
                                  : stock.toLocaleString()}
                              </td>

                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold ${status.style}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                  {status.label}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-right">
                                <Link
                                  href={`/admin/products/${product._id}`}
                                  aria-label={`Edit ${product.title}`}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6ddcf] px-3 py-2 text-xs font-semibold text-[#6d583d] transition hover:border-[#bda582] hover:bg-[#eee5d8]"
                                >
                                  Edit
                                  <ArrowRight size={13} />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {products.length > 0 && (
                  <div className="flex flex-col justify-between gap-2 border-t border-[#eee7dc] bg-[#faf7f1] px-6 py-4 sm:flex-row sm:items-center">
                    <p className="text-xs text-[#958671]">
                      Showing {filteredProducts.length} of {products.length} recent products
                    </p>
                    <Link
                      href="/admin/products"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#725b3c] transition hover:text-[#453728]"
                    >
                      Manage complete inventory
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </section>

              {/* Footer */}
              <footer className="flex flex-col items-center justify-between gap-2 py-8 text-xs text-[#a09380] sm:flex-row">
                <p>© {new Date().getFullYear()} Minicom. Made for better living.</p>
                <Link
                  href="/"
                  className="transition hover:text-[#5f4c34]"
                >
                  Visit your storefront →
                </Link>
              </footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
