
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Processing: "bg-violet-100 text-violet-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800",
};

const money = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function OrderSkeleton() {
  return (
    <div className="animate-pulse border-b border-stone-200 p-5">
      <div className="flex flex-wrap gap-4">
        <div className="h-4 w-32 rounded bg-stone-200" />
        <div className="h-4 w-40 rounded bg-stone-200" />
        <div className="h-4 w-24 rounded bg-stone-200" />
        <div className="h-8 w-32 rounded bg-stone-200" />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] || "bg-stone-100 text-stone-700"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/order", {
        headers: { "Cache-Control": "no-cache" },
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load orders."
        );
      }

      setOrders(
        Array.isArray(response.data.orders)
          ? response.data.orders
          : []
      );
    } catch (err) {
      console.error("Fetch admin orders error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to load orders.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesSearch =
        !term ||
        String(order._id || "").toLowerCase().includes(term) ||
        (order.customer?.name || "").toLowerCase().includes(term) ||
        (order.customer?.email || "").toLowerCase().includes(term) ||
        (order.customer?.phone || "").toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => order.status !== "Cancelled")
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      processing: orders.filter(
        (order) =>
          order.status === "Confirmed" ||
          order.status === "Processing"
      ).length,
      delivered: orders.filter(
        (order) => order.status === "Delivered"
      ).length,
      revenue: totalRevenue,
    };
  }, [orders]);

  async function updateOrderStatus(orderId, status) {
    const previousOrders = orders;

    setUpdatingId(orderId);

    // Update the page immediately while the server saves the change.
    setOrders((current) =>
      current.map((order) =>
        order._id === orderId ? { ...order, status } : order
      )
    );

    try {
      const response = await axios.patch(
        `/api/order/${orderId}`,
        { status }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to update order."
        );
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? response.data.order
            : order
        )
      );

      toast.success("Order status updated.");
    } catch (err) {
      console.error("Update order status error:", err);
      setOrders(previousOrders);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Could not update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-7 text-stone-800 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Store management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Orders
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Review customer orders and manage their status.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start border border-stone-300 bg-white px-4 py-3 text-sm font-medium transition hover:bg-stone-100 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh orders
          </button>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              label: "Total orders",
              value: stats.total,
              icon: Package,
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
            },
            {
              label: "In progress",
              value: stats.processing,
              icon: Truck,
            },
            {
              label: "Delivered",
              value: stats.delivered,
              icon: CheckCircle,
            },
            {
              label: "Order value",
              value: money(stats.revenue),
              icon: Package,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="border border-stone-200 bg-white p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-stone-500">
                    {stat.label}
                  </span>
                  <Icon size={19} className="text-stone-400" />
                </div>

                <p className="break-words text-2xl font-semibold">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="overflow-hidden border border-stone-200 bg-white">
          <div className="grid gap-3 border-b border-stone-200 p-4 md:grid-cols-[1fr_220px] md:p-5">
            <label className="flex min-w-0 items-center gap-3 border border-stone-200 px-3 py-3">
              <Search size={18} className="shrink-0 text-stone-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order ID, customer, email or phone..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
                aria-label="Search orders"
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="border border-stone-200 bg-white px-3 py-3 text-sm outline-none"
              aria-label="Filter orders by status"
            >
              <option value="All">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-5">
            <p className="text-sm text-stone-500">
              {loading
                ? "Loading orders..."
                : `${filteredOrders.length} of ${orders.length} orders`}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="text-xs font-medium underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>

          {loading ? (
            <div>
              {Array.from({ length: 5 }).map((_, index) => (
                <OrderSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-16 text-center">
              <XCircle
                size={38}
                className="mx-auto mb-4 text-red-500"
              />
              <h2 className="font-semibold">Could not load orders</h2>
              <p className="mt-2 text-sm text-stone-500">{error}</p>
              <button
                type="button"
                onClick={fetchOrders}
                className="mt-5 bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700"
              >
                Try again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Package
                size={40}
                className="mx-auto mb-4 text-stone-300"
              />
              <h2 className="font-semibold">No orders found</h2>
              <p className="mt-2 text-sm text-stone-500">
                {orders.length === 0
                  ? "New customer orders will appear here."
                  : "Try changing your search or status filter."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {filteredOrders.map((order) => {
                const isExpanded = expandedId === order._id;
                const isUpdating = updatingId === order._id;

                return (
                  <article key={order._id} className="p-4 md:p-5">
                    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_0.8fr_auto] xl:items-center">
                      <div className="min-w-0">
                        <p className="break-all text-sm font-semibold">
                          #{String(order._id).slice(-8).toUpperCase()}
                        </p>

                        <p className="mt-1 text-sm text-stone-700">
                          {order.customer?.name || "Unknown customer"}
                        </p>

                        <p className="mt-1 break-all text-xs text-stone-500">
                          {order.customer?.email || "No email"}
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-400">
                          <CalendarDays size={13} />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500">
                          {order.items?.length || 0} line item(s)
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          {money(order.total)}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {order.paymentMethod || "Payment not specified"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={order.status} />

                        {isUpdating && (
                          <LoaderCircle
                            size={15}
                            className="animate-spin text-stone-500"
                          />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        <select
                          value={order.status}
                          onChange={(event) =>
                            updateOrderStatus(
                              order._id,
                              event.target.value
                            )
                          }
                          disabled={isUpdating}
                          aria-label={`Change status for order ${order._id}`}
                          className="min-w-0 border border-stone-300 bg-white px-3 py-2.5 text-xs outline-none disabled:opacity-50"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(
                              isExpanded ? null : order._id
                            )
                          }
                          className="inline-flex items-center gap-1 border border-stone-300 px-3 py-2.5 text-xs font-medium hover:bg-stone-50"
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? "Hide" : "Details"}
                          {isExpanded ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-5 grid gap-6 border-t border-stone-200 pt-5 lg:grid-cols-2">
                        <div>
                          <h3 className="mb-4 text-sm font-semibold">
                            Customer and delivery
                          </h3>

                          <div className="space-y-3 text-sm text-stone-600">
                            <p className="flex items-start gap-2">
                              <Phone size={16} className="mt-0.5 shrink-0" />
                              {order.customer?.phone || "No phone provided"}
                            </p>

                            <p className="flex items-start gap-2">
                              <Mail size={16} className="mt-0.5 shrink-0" />
                              <span className="break-all">
                                {order.customer?.email || "No email provided"}
                              </span>
                            </p>

                            <p className="flex items-start gap-2">
                              <MapPin size={16} className="mt-0.5 shrink-0" />
                              <span>
                                {[
                                  order.customer?.address,
                                  order.customer?.city,
                                  order.customer?.postalCode,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "No address provided"}
                              </span>
                            </p>

                            {order.customer?.notes && (
                              <p className="border-l-2 border-stone-300 pl-3">
                                <span className="font-medium">Notes: </span>
                                {order.customer.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-4 text-sm font-semibold">
                            Items and totals
                          </h3>

                          <div className="space-y-4">
                            {(order.items || []).map((item, index) => (
                              <div
                                key={`${order._id}-${item.productId || index}`}
                                className="flex items-start justify-between gap-3 text-sm"
                              >
                                <div className="min-w-0">
                                  <p className="font-medium">
                                    {item.title}
                                  </p>
                                  <p className="mt-1 text-xs text-stone-500">
                                    Qty: {item.quantity} × {money(item.price)}
                                  </p>
                                </div>

                                <p className="shrink-0 font-medium">
                                  {money(
                                    Number(item.price) *
                                      Number(item.quantity)
                                  )}
                                </p>
                              </div>
                            ))}

                            <div className="space-y-2 border-t border-stone-200 pt-3 text-sm">
                              <div className="flex justify-between gap-3 text-stone-500">
                                <span>Subtotal</span>
                                <span>{money(order.subtotal)}</span>
                              </div>

                              <div className="flex justify-between gap-3 text-stone-500">
                                <span>Shipping</span>
                                <span>{money(order.shippingFee)}</span>
                              </div>

                              <div className="flex justify-between gap-3 border-t border-stone-200 pt-3 font-semibold">
                                <span>Total</span>
                                <span>{money(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="mt-4 text-xs leading-5 text-stone-500">
          Order value excludes cancelled orders in the summary above.
          Status changes are saved to the database.
        </p>
      </div>
    </main>
  );
}
