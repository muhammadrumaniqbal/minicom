
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  ArrowUpRight,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({
  product,
  categoryName,
  onAddToCart,
}) {
  const { isWishlisted, toggleWishlist, hydrated } = useWishlist();

  const productId = String(product._id || product.id);
  const liked = hydrated && isWishlisted(productId);

  const image =
    (typeof product.image === "string" && product.image) ||
    (typeof product.images?.[0] === "string"
      ? product.images[0]
      : product.images?.[0]?.url) ||
    product.imageUrl ||
    product.thumbnail ||
    "";

  const stock =
    product.stock == null
      ? null
      : Math.max(0, Number(product.stock) || 0);

  const outOfStock = stock !== null && stock < 1;

  const money = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  function handleWishlistClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const wasLiked = isWishlisted(productId);
    toggleWishlist({ ...product, image });

    toast.success(
      wasLiked
        ? "Removed from your wishlist"
        : "Added to your wishlist"
    );
  }

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group min-w-0"
    >
      {/* Product image */}
      <div className="relative overflow-hidden rounded-2xl bg-[#f2eee7]">
        <Link
          href={`/shop/${productId}`}
          className="block"
          aria-label={`View ${product.title}`}
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            {image ? (
              <motion.img
                src={image}
                alt={product.title || "Furniture product"}
                initial={{ scale: 1.02 }}
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-[#a3947d]">
                <Package size={38} strokeWidth={1.3} />
                <span className="text-xs">No image available</span>
              </div>
            )}
          </div>
        </Link>

        {/* Stock label */}
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-700">
            Sold out
          </span>
        )}

        {/* Wishlist heart */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.82 }}
          onClick={handleWishlistClick}
          disabled={!hydrated}
          aria-label={
            liked
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={liked}
          title={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition duration-300 disabled:cursor-wait ${
            liked
              ? "border-rose-100 bg-rose-50 text-rose-600"
              : "border-white/70 bg-white/90 text-[#4b453b] hover:bg-white hover:text-rose-600"
          }`}
        >
          <Heart
            size={19}
            strokeWidth={1.8}
            className={liked ? "fill-rose-500 text-rose-500" : ""}
          />
        </motion.button>

        {/* Add to cart */}
        <div className="absolute inset-x-3 bottom-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart?.(product)}
            disabled={outOfStock}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 px-4 py-3.5 text-xs font-semibold tracking-[0.08em] text-[#302c25] shadow-sm backdrop-blur-sm transition duration-300 hover:bg-[#302c25] hover:text-white disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            <ShoppingBag size={16} />
            {outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          </motion.button>
        </div>
      </div>

      {/* Product details */}
      <div className="px-1 pt-4">
        <div className="flex min-h-4 items-center justify-between gap-2">
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-[#998b75]">
            {categoryName || "MINICOM COLLECTION"}
          </p>

          {liked && (
            <Heart
              size={13}
              className="shrink-0 fill-rose-500 text-rose-500"
            />
          )}
        </div>

        <div className="mt-2 flex items-start justify-between gap-3">
          <Link
            href={`/shop/${productId}`}
            className="min-w-0 flex-1"
          >
            <h3 className="line-clamp-2 text-sm font-medium leading-6 text-[#302c25] transition-colors hover:text-[#9a8058] sm:text-base">
              {product.title}
            </h3>
          </Link>

          <Link
            href={`/shop/${productId}`}
            aria-label={`View ${product.title}`}
            className="mt-1 shrink-0 text-[#a39175] transition hover:translate-x-0.5 hover:text-[#302c25]"
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold tracking-tight text-[#302c25]">
            {money(product.price)}
          </p>

          {stock !== null && stock > 0 && stock <= 5 && (
            <span className="text-[10px] text-[#a17a36]">
              Only {stock} left
            </span>
          )}
        </div>

        <div className="mt-4 h-px bg-[#eee8df] transition-colors group-hover:bg-[#d6c5a8]" />
      </div>
    </motion.article>
  );
}
