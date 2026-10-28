
"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  MapPin,
  PackageCheck,
  LoaderCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const SHIPPING_FEE = 250;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const inputClass =
  "mt-2 w-full rounded-xl border border-[#ded6ca] bg-white px-4 py-3.5 text-sm text-[#29231d] outline-none transition placeholder:text-[#a49a8c] focus:border-[#a78049] focus:ring-2 focus:ring-[#a78049]/10";

export default function CheckoutPage() {
  const { cart, clear, hydrated } = useCart();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [localStorageWarning, setLocalStorageWarning] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const total = subtotal + SHIPPING_FEE;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await axios.post("/api/order", {
        customer: form,
        paymentMethod: "Cash on Delivery",
        items: cart.map((item) => ({
          id: item.id,
          quantity: Number(item.quantity),
        })),
      });

      const order = response.data.order;

      // Save locally only after MongoDB confirms the order.
      try {
        const savedOrders = JSON.parse(
          localStorage.getItem("customer-orders") || "[]"
        );

        const updatedOrders = [
          order,
          ...savedOrders.filter(
            (savedOrder) =>
              String(savedOrder._id) !== String(order._id)
          ),
        ];

        localStorage.setItem(
          "customer-orders",
          JSON.stringify(updatedOrders)
        );
      } catch (storageError) {
        console.error("Could not save order locally:", storageError);
        setLocalStorageWarning(true);
      }

      setPlacedOrder(order);
      clear();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f4ee]">
        <LoaderCircle className="animate-spin text-[#80613b]" size={32} />
      </div>
    );
  }

  // Order confirmation after the API successfully creates the order.
  if (placedOrder) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-4 pb-20 pt-32 text-[#29231d]">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#e6ded2] bg-white p-6 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f3e9]">
            <CheckCircle2 size={42} className="text-[#34734b]" />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[3px] text-[#997749]">
            Thank you for shopping with us
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Order placed successfully!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#786e62]">
            Thank you for choosing Minicom. Your order has been saved, and
            payment will be collected when your order is delivered.
          </p>

          <div className="mt-8 rounded-2xl bg-[#f7f4ee] p-5 text-left">
            <div className="flex items-center justify-between gap-4 border-b border-[#e5ddd1] pb-4">
              <span className="text-sm text-[#786e62]">Order number</span>
              <span className="break-all text-right text-sm font-semibold">
                {String(placedOrder._id)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <span className="text-sm text-[#786e62]">Order status</span>
              <span className="rounded-full bg-[#f0e4d0] px-3 py-1 text-xs font-semibold text-[#73552f]">
                {placedOrder.status || "Pending"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#e5ddd1] pt-4">
              <span className="text-sm text-[#786e62]">Total payable</span>
              <span className="text-lg font-semibold">
                {formatPrice(placedOrder.total)}
              </span>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#786e62]">
              Delivery to {placedOrder.customer?.city}. Keep your order
              number for future reference.
            </p>
          </div>

          {localStorageWarning && (
            <p className="mt-4 text-sm text-amber-700">
              Your order is saved in the database, but this browser could
              not save its local copy.
            </p>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#29231d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#80613b]"
            >
              Continue shopping <ArrowRight size={17} />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-[#ded6ca] px-6 py-3.5 text-sm font-semibold transition hover:bg-[#f7f4ee]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f4ee] px-4 pb-16 pt-32 text-[#29231d]">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ebe3d7]">
            <ShoppingBag size={34} className="text-[#80613b]" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold">Your cart is empty</h1>

          <p className="mt-3 text-sm leading-6 text-[#786e62]">
            Add your favourite pieces to your cart before proceeding to
            checkout.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#29231d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#80613b]"
          >
            Explore the collection <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 pb-20 pt-28 text-[#29231d] sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10 border-b border-[#e4dbcf] pb-7">
          <Link
            href="/cart"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#786e62] transition hover:text-[#29231d]"
          >
            <ArrowLeft size={16} /> Back to cart
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[3px] text-[#997749]">
                Minicom / Checkout
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Complete your order.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#786e62]">
                Just a few details and your selected pieces will be on their
                way to you.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#786e62]">
              <ShieldCheck size={19} className="text-[#80613b]" />
              Secure checkout
            </div>
          </div>

          {/* Checkout steps */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { number: "01", label: "Your cart", done: true },
              { number: "02", label: "Checkout", done: true },
              { number: "03", label: "Confirmation", done: false },
            ].map((step) => (
              <div
                key={step.number}
                className={`border-t-2 pt-3 ${
                  step.label === "Checkout"
                    ? "border-[#80613b]"
                    : step.done
                    ? "border-[#c7b79f]"
                    : "border-[#e4dbcf]"
                }`}
              >
                <p className="text-[10px] font-semibold tracking-[2px] text-[#997749]">
                  {step.number}
                </p>
                <p className="mt-1 text-xs font-medium sm:text-sm">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_400px]"
        >
          {/* Customer details */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#e6ded2] bg-white p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0e7da]">
                  <MapPin size={21} className="text-[#80613b]" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Delivery information
                  </h2>
                  <p className="mt-1 text-sm text-[#887d70]">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Full name *
                  <input
                    className={inputClass}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    maxLength={100}
                  />
                </label>

                <label className="text-sm font-medium">
                  Phone number *
                  <input
                    className={inputClass}
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03XX XXXXXXX"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    maxLength={25}
                  />
                </label>

                <label className="text-sm font-medium sm:col-span-2">
                  Email address *
                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    maxLength={254}
                  />
                </label>

                <label className="text-sm font-medium sm:col-span-2">
                  Complete delivery address *
                  <textarea
                    className={`${inputClass} min-h-[105px] resize-y`}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House number, street, area, and any useful directions"
                    autoComplete="street-address"
                    required
                    maxLength={500}
                  />
                </label>

                <label className="text-sm font-medium">
                  City *
                  <input
                    className={inputClass}
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    autoComplete="address-level2"
                    required
                    maxLength={100}
                  />
                </label>

                <label className="text-sm font-medium">
                  Postal code
                  <input
                    className={inputClass}
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="Optional"
                    autoComplete="postal-code"
                    maxLength={20}
                  />
                </label>
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-2xl border border-[#e6ded2] bg-white p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0e7da]">
                  <ShoppingBag size={21} className="text-[#80613b]" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">Payment method</h2>
                  <p className="mt-1 text-sm text-[#887d70]">
                    Simple and convenient payment.
                  </p>
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-xl border border-[#b79b73] bg-[#fbf8f2] p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked
                  readOnly
                  className="mt-1 accent-[#80613b]"
                />

                <span className="flex-1">
                  <span className="block text-sm font-semibold">
                    Cash on Delivery
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#887d70]">
                    Pay in cash when your order arrives.
                  </span>
                </span>

                <Truck size={22} className="text-[#80613b]" />
              </label>

              <label className="mt-6 block text-sm font-medium">
                Order notes
                <textarea
                  className={`${inputClass} min-h-[90px] resize-y`}
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Delivery instructions or other details (optional)"
                  maxLength={1000}
                />
              </label>
            </section>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#29231d] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#80613b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Placing your order...
                </>
              ) : (
                <>
                  Place order · {formatPrice(total)}
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-5 text-[#887d70]">
              By placing your order, you confirm that your delivery details
              are correct.
            </p>
          </div>

          {/* Order summary */}
          <aside className="space-y-5 lg:sticky lg:top-8">
            <section className="rounded-2xl border border-[#e6ded2] bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-[#eee7dc] pb-5">
                <h2 className="text-xl font-semibold">Your order</h2>
                <span className="rounded-full bg-[#f0e7da] px-3 py-1 text-xs font-semibold text-[#80613b]">
                  {cart.reduce(
                    (sum, item) => sum + Number(item.quantity || 0),
                    0
                  )}{" "}
                  items
                </span>
              </div>

              <div className="max-h-[360px] space-y-5 overflow-y-auto py-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <div className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-xl bg-[#f3efe8]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <PackageCheck
                            size={25}
                            className="text-[#b3a48f]"
                          />
                        </div>
                      )}

                      <span className="absolute -right-0.5 -top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#29231d] px-1.5 text-[10px] font-semibold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="line-clamp-2 text-sm font-medium leading-5">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#887d70]">
                        Quantity: {item.quantity}
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {formatPrice(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-[#eee7dc] pt-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#786e62]">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#786e62]">Delivery fee</span>
                  <span className="font-medium">
                    {formatPrice(SHIPPING_FEE)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-[#eee7dc] pt-5">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-xl font-semibold">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="text-right text-xs text-[#887d70]">
                  Inclusive of listed charges
                </p>
              </div>
            </section>

            <div className="rounded-2xl border border-[#e6ded2] bg-[#eee6da] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-[#80613b]"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Shop with confidence
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#786e62]">
                    Your order details are saved to our order database after
                    successful submission.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
