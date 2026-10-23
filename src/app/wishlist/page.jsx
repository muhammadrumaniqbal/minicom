
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const router = useRouter();

  const {
    wishlist = [],
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const getProductId = (product) =>
    String(product?._id || product?.id || "");

  const getProductImage = (product) => {
    if (product?.image) return product.image;

    if (Array.isArray(product?.images) && product.images.length > 0) {
      const firstImage = product.images[0];

      return typeof firstImage === "string"
        ? firstImage
        : firstImage?.url || "";
    }

    return "";
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);

  const handleAddToCart = (product) => {
    const stock = Number(product.stock ?? 0);

    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    addToCart(
      {
        ...product,
        id: getProductId(product),
        image: getProductImage(product),
        stock,
      },
      1
    );

    toast.success("Added to cart!");
  };

  const handleRemove = (product) => {
    removeFromWishlist(getProductId(product));
    toast.success("Removed from wishlist");
  };

  return (
    <section className="min-h-screen bg-[#faf8f4] px-4 py-12 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[4px] text-yellow-700">
              Your favorites
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              My Wishlist
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              {wishlist.length}{" "}
              {wishlist.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearWishlist();
                toast.success("Wishlist cleared");
              }}
              className="inline-flex items-center gap-2 self-start rounded-full border border-neutral-300 px-5 py-3 text-sm transition hover:border-red-500 hover:text-red-600 sm:self-auto"
            >
              <Trash2 size={16} />
              Clear wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f1ea]">
              <Heart size={32} strokeWidth={1.4} />
            </div>

            <h2 className="text-xl font-semibold text-neutral-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              Save your favorite furniture pieces by clicking the heart icon
              on a product.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-yellow-600"
            >
              <ShoppingBag size={17} />
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((product) => {
              const productId = getProductId(product);
              const image = getProductImage(product);

              return (
                <article
                  key={productId}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                >
                  <Link
                    href={`/shop/${productId}`}
                    className="relative block aspect-[4/5] overflow-hidden bg-[#f2eee7]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.title || "Furniture"}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                        No image available
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    <h2 className="truncate text-base font-medium text-neutral-900">
                      {product.title || "Untitled product"}
                    </h2>

                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      {formatPrice(product.price)}
                    </p>

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-3 py-3 text-sm text-white transition hover:bg-yellow-600"
                      >
                        <ShoppingBag size={16} />
                        Add to cart
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(product)}
                        aria-label="Remove from wishlist"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-red-500 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}