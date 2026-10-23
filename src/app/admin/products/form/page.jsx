
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import {
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Boxes,
  FileText,
  ImagePlus,
  LoaderCircle,
  Save,
  X,
  Upload,
} from "lucide-react";

export default function ProductFormPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    stock: "",
    category: "",
  });

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category");

        if (response.data.success) {
          setCategories(response.data.res || []);
        } else {
          toast.error("Could not load categories.");
        }
      } catch (error) {
        console.error("Category loading error:", error);
        toast.error("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save the secure Cloudinary URL after a successful upload.
  const handleUploadSuccess = (result) => {
    const imageUrl = result?.info?.secure_url;

    if (!imageUrl) {
      toast.error("Could not get the uploaded image URL.");
      return;
    }

    setImages((previous) => {
      // Prevent the same URL from being added twice.
      if (previous.includes(imageUrl)) return previous;
      return [...previous, imageUrl];
    });

    toast.success("Image uploaded successfully!");
  };

  const removeImage = (imageUrl) => {
    setImages((previous) =>
      previous.filter((image) => image !== imageUrl)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      toast.error("Please enter a valid price.");
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

    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.post("/api/product", {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        images,
      });

      if (response.data.success) {
        toast.success("Product added successfully!");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(
          response.data.message || "Could not create product."
        );
      }
    } catch (error) {
      console.error("Product creation error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add product."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100";

  const labelClass =
    "flex items-center gap-2 text-sm font-medium text-neutral-800";

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to products
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Product management
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Add New Product
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                Add a product to your Minicom store.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Package size={24} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {/* Basic information */}
              <section className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Basic information
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Give your product a name and description.
                </p>

                <div className="mt-6">
                  <label htmlFor="title" className={labelClass}>
                    <Package size={16} />
                    Product name
                  </label>

                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Modern Wooden Chair"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="desc" className={labelClass}>
                    <FileText size={16} />
                    Description
                  </label>

                  <textarea
                    id="desc"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    rows={5}
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </section>

              {/* Pricing and stock */}
              <section className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Pricing and inventory
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Set your selling price and available stock.
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="price" className={labelClass}>
                      <DollarSign size={16} />
                      Price (PKR)
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="2500"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="stock" className={labelClass}>
                      <Boxes size={16} />
                      Available stock
                    </label>

                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="10"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Cloudinary image uploader */}
              <section className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Product images
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Upload one or more photos from your computer.
                </p>

                {!cloudName || !uploadPreset ? (
                  <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Cloudinary configuration is missing. Check your
                    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
                    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET variables
                    in .env, then restart your development server.
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={uploadPreset}
                    options={{
                      cloudName,
                      multiple: true,
                      maxFiles: 10,
                      folder: "minicom/products",
                      resourceType: "image",
                      clientAllowedFormats: [
                        "jpg",
                        "jpeg",
                        "png",
                        "webp",
                        "avif",
                      ],
                      maxFileSize: 10000000,
                    }}
                    onSuccess={handleUploadSuccess}
                  >
                    {({ open, isLoading }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        disabled={isLoading}
                        className="mt-6 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center transition hover:border-neutral-900 hover:bg-neutral-100 disabled:opacity-50"
                      >
                        <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                          {isLoading ? (
                            <LoaderCircle
                              size={25}
                              className="animate-spin"
                            />
                          ) : (
                            <Upload size={25} />
                          )}
                        </span>

                        <span className="text-sm font-semibold text-neutral-900">
                          {isLoading
                            ? "Loading uploader..."
                            : "Choose product photos"}
                        </span>

                        <span className="mt-2 text-xs text-neutral-500">
                          JPG, PNG, WebP or AVIF · Maximum 10 MB per image
                        </span>
                      </button>
                    )}
                  </CldUploadWidget>
                )}

                {/* Uploaded image previews */}
                {images.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-800">
                        Uploaded photos
                      </p>

                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                        {images.length} / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {images.map((image, index) => (
                        <div
                          key={image}
                          className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
                        >
                          <img
                            src={image}
                            alt={`Product photo ${index + 1}`}
                            className="aspect-square w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(image)}
                            aria-label={`Remove photo ${index + 1}`}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 shadow transition hover:bg-red-600 hover:text-white"
                          >
                            <X size={16} />
                          </button>

                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-neutral-800">
                              First photo
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="mt-3 text-xs leading-5 text-neutral-500">
                      The first photo will be stored first in your
                      images array. Your product card can use it as
                      the main image.
                    </p>

                    {images.length < 10 && cloudName && uploadPreset && (
                      <CldUploadWidget
                        uploadPreset={uploadPreset}
                        options={{
                          cloudName,
                          multiple: true,
                          maxFiles: 10 - images.length,
                          folder: "minicom/products",
                          resourceType: "image",
                          clientAllowedFormats: [
                            "jpg",
                            "jpeg",
                            "png",
                            "webp",
                            "avif",
                          ],
                          maxFileSize: 10000000,
                        }}
                        onSuccess={handleUploadSuccess}
                      >
                        {({ open }) => (
                          <button
                            type="button"
                            onClick={() => open()}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 underline underline-offset-4 hover:text-black"
                          >
                            <ImagePlus size={16} />
                            Upload more photos
                          </button>
                        )}
                      </CldUploadWidget>
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Category and publishing sidebar */}
            <aside className="space-y-6">
              <section className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Organization
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Choose the category for this product.
                </p>

                <div className="mt-6">
                  <label htmlFor="category" className={labelClass}>
                    <Tag size={16} />
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    disabled={loadingCategories}
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.title}
                      </option>
                    ))}
                  </select>

                  {!loadingCategories && categories.length === 0 && (
                    <p className="mt-3 text-xs leading-5 text-amber-700">
                      No categories found. Create a category first,
                      then return here.
                    </p>
                  )}

                  <Link
                    href="/admin/categories"
                    className="mt-3 inline-block text-sm font-medium text-neutral-600 underline underline-offset-4 transition hover:text-black"
                  >
                    Manage categories
                  </Link>
                </div>
              </section>

              <section className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold text-neutral-900">
                  Publish product
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Review your information and uploaded photos before
                  saving the product to your database.
                </p>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    loadingCategories ||
                    categories.length === 0
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Saving product...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save product
                    </>
                  )}
                </button>

                <Link
                  href="/admin/products"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Cancel
                </Link>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
