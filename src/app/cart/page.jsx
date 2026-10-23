
"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    hydrated,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalQuantity,
    totalPrice,
  } = useCart();

  const money = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  if (!hydrated) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-neutral-500">Loading your cart...</p>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#c7c791] px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
            <ShoppingBag size={34} className="text-neutral-800" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-neutral-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-neutral-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700"
          >
            <ArrowLeft size={18} />
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Your selection
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {totalQuantity} item(s) in your cart
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:text-red-600"
          >
            <Trash2 size={16} />
            Clear cart
          </button>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_350px]">
          {/* Cart items */}
          <section className="space-y-4">
            {cart.map((item) => {
              const itemId = String(item.id || item._id);
              const image =
                item.image ||
                item.images?.[0]?.url ||
                item.images?.[0] ||
                "";

              return (
                <article
                  key={itemId}
                  className="flex flex-col gap-4 rounded-2xl border border-neutral-200/70 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 sm:w-28">
                    {image ? (
                      <img
                        src={image}
                        alt={item.title || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingBag
                        size={30}
                        className="text-neutral-400"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-neutral-900">
                      {item.title || item.name || "Product"}
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                      {money(item.price)} each
                    </p>

                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      {money(Number(item.price) * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex items-center rounded-xl border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(itemId)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="p-2.5 text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-9 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(itemId)}
                        disabled={
                          item.stock != null &&
                          item.quantity >= item.stock
                        }
                        aria-label="Increase quantity"
                        className="p-2.5 text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(itemId)}
                      className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-red-600"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Order summary */}
          <aside className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4 text-neutral-600">
                <span>Items ({totalQuantity})</span>
                <span>{money(totalPrice)}</span>
              </div>

              <div className="flex justify-between gap-4 text-neutral-600">
                <span>Shipping</span>
                <span>Calculated later</span>
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between gap-4 text-base font-semibold text-neutral-900">
                  <span>Subtotal</span>
                  <span>{money(totalPrice)}</span>
                </div>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Shipping charges are not included in this subtotal.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                alert("Checkout functionality will be added next!")
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              <ShoppingCart size={18} />
              Proceed to checkout
            </button>

            <Link
              href="/"
              className="mt-4 block text-center text-sm transition hover:text-black"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
