
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Loader2,
  Package,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ShopProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        setLoading(true);

        const response = await axios.get(`/api/product/${id}`);

        setProduct(
          response.data.data || response.data.res || null
        );
      } catch (error) {
        console.error("Product fetch failed:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const images = Array.isArray(product?.images)
    ? product.images
        .map((image) =>
          typeof image === "string" ? image : image?.url || ""
        )
        .filter(Boolean)
    : [];

  const stock = Number(product?.stock || 0);

  const productId = product
    ? String(product._id || product.id || "")
    : "";

  const wishlisted = productId
    ? isWishlisted(productId)
    : false;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  function handleWishlist() {
    if (!product) return;

    toggleWishlist({
      ...product,
      id: productId,
      image: images[0] || "",
    });

    toast.success(
      wishlisted
        ? "Removed from wishlist"
        : "Added to wishlist!"
    );
  }

  function handleAddToCart() {
    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items are available.`);
      return;
    }

    addToCart(
      {
        ...product,
        id: productId,
        image: images[0] || "",
        stock,
      },
      quantity
    );

    toast.success("Added to your cart!");
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3">
        <Loader2 className="animate-spin" />
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-5 text-center">
        <Package size={48} className="mb-4 text-neutral-400" />

        <h1 className="text-2xl font-semibold">
          Product not found
        </h1>

        <p className="mt-2 text-neutral-500">
          This product may have been removed.
        </p>

        <Link
          href="/shop"
          className="mt-6 rounded-full bg-black px-6 py-3 text-white"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-amber-700"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product images */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="overflow-hidden bg-stone-100">
              {images.length ? (
                <img
                  src={images[selectedImage] || images[0]}
                  alt={product.title}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center">
                  <Package
                    size={48}
                    className="text-neutral-400"
                  />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.section>

          {/* Product information */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:pt-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              MINICOM COLLECTION
            </p>

            {/* Title and wishlist button */}
            <div className="mt-4 flex items-start justify-between gap-4">
              <h1 className="text-3xl font-medium sm:text-5xl">
                {product.title}
              </h1>

              <button
                type="button"
                onClick={handleWishlist}
                aria-label={
                  wishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                aria-pressed={wishlisted}
                title={
                  wishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                  wishlisted
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-red-300 hover:text-red-600"
                }`}
              >
                <Heart
                  size={22}
                  className={
                    wishlisted ? "fill-current" : ""
                  }
                />
              </button>
            </div>

            <p className="mt-5 text-2xl font-semibold">
              {formatPrice(product.price)}
            </p>

            <div className="my-7 border-t border-neutral-200" />

            {product.category?.title && (
              <p className="mb-4 text-sm text-neutral-600">
                Category: {product.category.title}
              </p>
            )}

            <p className="mb-6 text-sm">
              Availability:{" "}
              <span
                className={
                  stock > 0
                    ? "text-green-700"
                    : "text-red-600"
                }
              >
                {stock > 0 ? "In stock" : "Out of stock"}
              </span>
            </p>

            {product.desc && (
              <div className="mb-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider">
                  Description
                </h2>

                <p className="whitespace-pre-line text-sm leading-7 text-neutral-600">
                  {product.desc}
                </p>
              </div>
            )}

            <p className="mb-3 text-sm font-semibold">
              Quantity
            </p>

            <div className="inline-flex h-12 items-center border border-neutral-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1)
                  )
                }
                className="flex h-full w-12 items-center justify-center disabled:opacity-30"
              >
                <Minus size={16} />
              </button>

              <span className="w-10 text-center">
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= stock || stock <= 0}
                onClick={() =>
                  setQuantity((current) =>
                    Math.min(stock, current + 1)
                  )
                }
                className="flex h-full w-12 items-center justify-center disabled:opacity-30"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 bg-neutral-900 px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              <ShoppingBag size={19} />
              {stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            <Link
              href="/shop"
              className="mt-4 block border border-neutral-300 px-6 py-4 text-center text-sm hover:border-black"
            >
              Continue Shopping
            </Link>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
