
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Package,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ArrowUpRight,
  Boxes,
  AlertTriangle,
  Tags,
  RefreshCw,
  X,
  ShieldAlert,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Custom delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("/api/product");
      setProducts(res.data.res || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("We couldn't load your products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Open our custom confirmation modal
  function handleDeleteClick(product) {
    setDeleteError("");
    setProductToDelete(product);
    setShowDeleteModal(true);
  }

  // Delete the selected product after confirmation
  async function confirmDelete() {
    if (!productToDelete || deletingId) return;

    const productId = productToDelete._id;

    try {
      setDeletingId(productId);
      setDeleteError("");

      await axios.delete(`/api/product/${productId}`);

      // Remove the deleted product immediately without navigating away
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== productId)
      );

      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);

      setDeleteError(
        error.response?.data?.message ||
          "We couldn't remove this product. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function closeDeleteModal() {
    if (deletingId) return;

    setShowDeleteModal(false);
    setProductToDelete(null);
    setDeleteError("");
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const category = product.category?.title?.toLowerCase() || "";

      return title.includes(term) || category.includes(term);
    });
  }, [products, search]);

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const lowStock = products.filter(
    (product) => Number(product.stock || 0) <= 5
  ).length;

  const totalValue = products.reduce(
    (total, product) =>
      total + Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  return (
    <main className="min-h-screen bg-[#f5f1e9] px-4 py-6 text-[#302c25] sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8a806e]">
              <span className="h-px w-8 bg-[#a58b61]" />
              Store management
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Products
              <span className="ml-3 text-[#a58b61]">.</span>
            </h1>

            <p className="mt-2 text-sm text-[#827a6c] sm:text-base">
              Manage your inventory and keep your collection looking its best.
            </p>
          </div>

          <Link
            href="/admin/products/form"
            className="group inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#302c25] px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#302c25]/10 transition duration-300 hover:bg-[#a58b61]"
          >
            <Plus size={18} />
            Add Product
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Summary cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Package}
            label="Total Products"
            value={loading ? "—" : products.length}
            detail="Products in your store"
          />

          <StatCard
            icon={Boxes}
            label="Total Inventory"
            value={loading ? "—" : totalStock.toLocaleString("en-PK")}
            detail="Units currently in stock"
          />

          <StatCard
            icon={AlertTriangle}
            label="Low Stock"
            value={loading ? "—" : lowStock}
            detail="Products with 5 units or less"
            warning={lowStock > 0 && !loading}
          />

          <StatCard
            icon={Tags}
            label="Inventory Value"
            value={loading ? "—" : formatPrice(totalValue)}
            detail="Price multiplied by stock"
            compact
          />
        </div>

        {/* Product table */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#e6dfd3] bg-[#fffdf9] shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#eee7dc] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-semibold">Your collection</h2>
              <p className="mt-1 text-sm text-[#8a8173]">
                {loading
                  ? "Loading your inventory..."
                  : `${filteredProducts.length} ${
                      filteredProducts.length === 1 ? "product" : "products"
                    } displayed`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-64">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958b7b]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-[#e7dfd2] bg-[#faf7f1] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#a39a8b] focus:border-[#a58b61] focus:ring-2 focus:ring-[#a58b61]/10"
                />
              </div>

              <button
                type="button"
                onClick={fetchProducts}
                disabled={loading}
                aria-label="Refresh products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e7dfd2] px-4 py-3 text-sm font-medium text-[#5f574a] transition hover:bg-[#f1eadd] disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Delete error message */}
          {deleteError && !showDeleteModal && (
            <div
              role="alert"
              className="flex items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700"
            >
              <span>{deleteError}</span>
              <button
                type="button"
                onClick={() => setDeleteError("")}
                aria-label="Dismiss error"
                className="shrink-0 hover:text-red-900"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#a58b61]" size={34} />
              <p className="text-sm text-[#8a8173]">
                Preparing your product collection...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <AlertTriangle className="mb-3 text-red-700" size={34} />
              <p className="font-medium">{error}</p>

              <button
                type="button"
                onClick={fetchProducts}
                className="mt-4 rounded-lg bg-[#302c25] px-5 py-2.5 text-sm text-white transition hover:bg-[#a58b61]"
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1eadd]">
                <Package size={30} className="text-[#8b795d]" />
              </div>

              <h3 className="text-lg font-semibold">
                {search ? "No matching products" : "Your collection is empty"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#8a8173]">
                {search
                  ? "Try another product name or category."
                  : "Add your first product to start building your store collection."}
              </p>

              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 text-sm font-semibold text-[#8b7048] hover:underline"
                >
                  Clear search
                </button>
              ) : (
                <Link
                  href="/admin/products/form"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#302c25] px-5 py-3 text-sm text-white transition hover:bg-[#a58b61]"
                >
                  <Plus size={17} />
                  Add your first product
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-[#f7f3ec] text-[11px] uppercase tracking-[0.14em] text-[#8a8173]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Stock status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee7dc]">
                  {filteredProducts.map((product) => {
                    const stock = Number(product.stock || 0);
                    const isDeleting = deletingId === product._id;

                    return (
                      <tr
                        key={product._id}
                        className="group transition-colors hover:bg-[#faf6ef]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e9e0d2] bg-[#f1eadd]">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title || "Product"}
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <Package
                                  size={20}
                                  className="text-[#9b896b]"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-xs truncate font-semibold text-[#302c25]">
                                {product.title}
                              </p>
                              <p className="mt-1 text-xs text-[#9a9080]">
                                ID: {product._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-lg bg-[#f1eadd] px-3 py-1.5 text-xs font-medium text-[#746448]">
                            {product.category?.title || "Uncategorized"}
                          </span>
                        </td>

                        <td className="px-6 py-5 font-semibold text-[#302c25]">
                          {formatPrice(product.price)}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                stock === 0
                                  ? "bg-red-500"
                                  : stock <= 5
                                  ? "bg-amber-500"
                                  : "bg-emerald-600"
                              }`}
                            />
                            <span
                              className={`text-xs font-medium ${
                                stock === 0
                                  ? "text-red-700"
                                  : stock <= 5
                                  ? "text-amber-700"
                                  : "text-emerald-700"
                              }`}
                            >
                              {stock === 0
                                ? "Out of stock"
                                : stock <= 5
                                ? `Low stock · ${stock}`
                                : `${stock} in stock`}
                            </span>
                          </div>
                        </td>

                        {/* Edit and Delete buttons */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/${product._id}`}
                              className="inline-flex items-center gap-2 rounded-xl border border-[#e6ddce] bg-white px-3 py-2.5 text-xs font-semibold text-[#514638] transition duration-200 hover:border-[#302c25] hover:bg-[#302c25] hover:text-white"
                            >
                              <Pencil size={14} />
                              Edit
                              <ArrowUpRight size={13} className="opacity-60" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeleteClick(product)}
                              disabled={deletingId !== null}
                              aria-label={`Delete ${product.title}`}
                              title="Delete product"
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-[#eee7dc] bg-[#faf7f1] px-5 py-4 text-xs text-[#8a8173] sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Inventory overview
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Custom animated delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && productToDelete && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171510]/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDeleteModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
              className="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-[#fffdf9] shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-start justify-between">
                  <motion.div
                    initial={{ rotate: -12, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.08, type: "spring" }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600"
                  >
                    <ShieldAlert size={28} />
                  </motion.div>

                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={deletingId !== null}
                    aria-label="Close confirmation"
                    className="rounded-full p-2 text-[#968c7d] transition hover:bg-[#f1eadd] hover:text-[#302c25] disabled:opacity-40"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-red-600">
                  Inventory confirmation
                </p>

                <h2
                  id="delete-modal-title"
                  className="text-2xl font-semibold tracking-tight text-[#302c25] sm:text-3xl"
                >
                  Let this one go?
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#827a6c]">
                  You're about to remove this product from your collection.
                  This action cannot be undone.
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#e9e0d2] bg-[#f8f4ec] p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e9e0d2] bg-white">
                    {productToDelete.images?.[0] ? (
                      <img
                        src={productToDelete.images[0]}
                        alt={productToDelete.title || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={21} className="text-[#9b896b]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#302c25]">
                      {productToDelete.title}
                    </p>
                    <p className="mt-1 text-xs text-[#8a8173]">
                      {formatPrice(productToDelete.price)}
                      {" · "}
                      {Number(productToDelete.stock || 0)} in stock
                    </p>
                  </div>

                  <span className="shrink-0 rounded-lg bg-red-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
                    Delete
                  </span>
                </div>

                {deleteError && (
                  <div
                    role="alert"
                    className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                    <p>{deleteError}</p>
                  </div>
                )}

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={deletingId !== null}
                    onClick={closeDeleteModal}
                    className="flex-1 rounded-xl border border-[#e6ddce] bg-white px-4 py-3.5 text-sm font-semibold text-[#514638] transition hover:bg-[#f8f4ec] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Keep product
                  </button>

                  <button
                    type="button"
                    disabled={deletingId !== null}
                    onClick={confirmDelete}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/15 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === productToDelete._id ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete product
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-4 text-center text-[11px] text-[#a09788]">
                  Your product will be removed from the inventory immediately.
                </p>
              </div>

              <div className="h-1.5 bg-gradient-to-r from-[#d7c6a8] via-red-500 to-[#d7c6a8]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  warning = false,
  compact = false,
}) {
  return (
    <div className="group rounded-2xl border border-[#e6dfd3] bg-[#fffdf9] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#817766]">{label}</p>

          <p
            className={`mt-3 font-semibold tracking-tight ${
              compact ? "break-words text-xl sm:text-2xl" : "text-3xl"
            } ${warning ? "text-amber-700" : "text-[#302c25]"}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105 ${
            warning
              ? "bg-amber-100 text-amber-800"
              : "bg-[#f1eadd] text-[#8b7048]"
          }`}
        >
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 border-t border-[#eee7dc] pt-3 text-xs text-[#958b7b]">
        {detail}
      </p>
    </div>
  );
}
