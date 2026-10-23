
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  ImagePlus,
  X,
} from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);

        const [productResponse, categoryResponse] =
          await Promise.all([
            axios.get(`/api/product/${id}`),
            axios.get("/api/category"),
          ]);

        const product =
          productResponse.data.data ||
          productResponse.data.res;

        if (!product) {
          throw new Error("Product not found");
        }

        const categoryData =
          categoryResponse.data.res ||
          categoryResponse.data.categories ||
          categoryResponse.data.data ||
          categoryResponse.data;

        setCategories(
          Array.isArray(categoryData) ? categoryData : []
        );

        setFormData({
          title: product.title || "",
          desc: product.desc || "",
          price: product.price ?? "",
          stock: product.stock ?? 0,
          category:
            typeof product.category === "object"
              ? product.category?._id || ""
              : product.category || "",
          images: Array.isArray(product.images)
            ? product.images
                .map((image) =>
                  typeof image === "string"
                    ? image
                    : image?.url || ""
                )
                .filter(Boolean)
            : [],
        });
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function addImage() {
    const url = imageUrl.trim();

    if (!url) {
      toast.error("Please enter an image URL.");
      return;
    }

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        toast.error("Please enter a valid image URL.");
        return;
      }
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      images: [...previous.images, url],
    }));

    setImageUrl("");
  }

  function removeImage(indexToRemove) {
    setFormData((previous) => ({
      ...previous,
      images: previous.images.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Product title is required.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      toast.error("Enter a valid product price.");
      return;
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      toast.error("Stock must be a whole number of 0 or more.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please add at least one product image.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        images: formData.images,
      };

      const response = await axios.put(
        `/api/product/${id}`,
        payload
      );

      if (response.data.success === false) {
        throw new Error(
          response.data.message || "Failed to update product"
        );
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center gap-3 bg-stone-50">
        <Loader2
          size={26}
          className="animate-spin text-amber-700"
        />
        <p className="text-sm text-neutral-600">
          Loading product details...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-amber-700"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Minicom Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Edit Product
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Update product information and save your changes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="border-b border-stone-200 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
                <Package size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-neutral-900">
                  Product Information
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Fields marked with * are required.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-5 py-7 sm:grid-cols-2 sm:px-8">
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Product Title *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Price (PKR) *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 25000"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Available Stock *
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 10"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Category *
              </label>

              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              >
                <option value="">Select a category</option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="desc"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Product Description
              </label>

              <textarea
                id="desc"
                name="desc"
                rows={5}
                value={formData.desc}
                onChange={handleChange}
                placeholder="Describe the product..."
                className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Product Images *
              </label>

              <p className="mb-4 text-xs leading-5 text-neutral-500">
                Add a publicly accessible image URL. Existing images
                are shown below. You can remove images you no longer
                want.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(event) =>
                    setImageUrl(event.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                  className="min-w-0 flex-1 rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                />

                <button
                  type="button"
                  onClick={addImage}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-700"
                >
                  <ImagePlus size={17} />
                  Add Image
                </button>
              </div>

              {formData.images.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50"
                    >
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow transition hover:bg-red-600 hover:text-white"
                      >
                        <X size={17} />
                      </button>

                      <p className="truncate px-3 py-2 text-xs text-neutral-500">
                        Image {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-stone-300 px-4 py-8 text-center text-sm text-neutral-500">
                  No images added yet.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-stone-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
