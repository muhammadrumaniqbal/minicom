
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Tag,
  Loader2,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");

      if (response.data.success) {
        setCategories(response.data.res || []);
      } else {
        toast.error("Could not load categories.");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a new category
  const handleAddCategory = async (event) => {
    event.preventDefault();

    const title = categoryName.trim();

    if (!title) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      setAdding(true);

      const response = await axios.post("/api/category", {
        title,
      });

      if (response.data.success) {
        toast.success("Category added successfully!");
        setCategoryName("");

        // Refresh the list
        await fetchCategories();
      }
    } catch (error) {
      console.error("Add category error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add category."
      );
    } finally {
      setAdding(false);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await axios.delete(
        `/api/category?id=${encodeURIComponent(id)}`
      );

      if (response.data.success) {
        toast.success("Category deleted successfully!");

        setCategories((previous) =>
          previous.filter((category) => category._id !== id)
        );
      }
    } catch (error) {
      console.error("Delete category error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Store management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Categories
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Create and manage the categories for your products.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <Tag size={20} className="text-neutral-600" />
            <div>
              <p className="text-xs text-neutral-500">
                Total categories
              </p>
              <p className="text-lg font-semibold text-neutral-900">
                {categories.length}
              </p>
            </div>
          </div>
        </div>

        {/* Add category form */}
        <section className="mt-8 rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">
              Add a category
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Give your category a clear, recognizable name.
            </p>
          </div>

          <form
            onSubmit={handleAddCategory}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1">
              <label htmlFor="categoryName" className="sr-only">
                Category name
              </label>

              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(event.target.value)
                }
                placeholder="e.g. Living Room, Bedroom, Chairs"
                maxLength={100}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
                disabled={adding}
              />
            </div>

            <button
              type="submit"
              disabled={adding || !categoryName.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {adding ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              {adding ? "Adding..." : "Add Category"}
            </button>
          </form>
        </section>

        {/* Category list */}
        <section className="mt-7 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-5 sm:px-7">
            <div>
              <h2 className="font-semibold text-neutral-900">
                All Categories
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Categories available for your products.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchCategories();
              }}
              disabled={loading}
              aria-label="Refresh categories"
              className="rounded-lg border border-neutral-200 p-2.5 text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 p-14 text-neutral-500">
              <Loader2 size={28} className="animate-spin" />
              <p className="text-sm">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
                <Tag size={26} className="text-neutral-500" />
              </div>

              <h3 className="font-semibold text-neutral-900">
                No categories yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                Add your first category above. You can then select it
                when creating a product.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                  <tr>
                    <th className="px-5 py-4 font-medium sm:px-7">
                      Category name
                    </th>
                    <th className="px-5 py-4 font-medium">
                      Date created
                    </th>
                    <th className="px-5 py-4 text-right font-medium sm:px-7">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="transition hover:bg-neutral-50/70"
                    >
                      <td className="px-5 py-4 sm:px-7">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                            <Tag
                              size={18}
                              className="text-neutral-700"
                            />
                          </div>

                          <span className="font-medium text-neutral-900">
                            {category.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-neutral-500">
                        {category.createdAt
                          ? new Date(
                              category.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-right sm:px-7">
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCategory(
                              category._id,
                              category.title
                            )
                          }
                          disabled={deletingId === category._id}
                          aria-label={`Delete ${category.title}`}
                          title="Delete category"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === category._id ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          <span className="hidden sm:inline">
                            Delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
