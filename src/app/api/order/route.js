
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import dbConnect from "@/backend/dbconnect";
import Product from "@/backend/product";
import Order from "@/backend/order";
import {
  COOKIE_NAME,
  verifySessionToken,
} from "@/backend/auth";

const SHIPPING_FEE = 250;

// GET: Fetch all orders for the admin dashboard
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    const session = token
      ? await verifySessionToken(token)
      : null;

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    await dbConnect();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch orders.",
      },
      { status: 500 }
    );
  }
}

// POST: Create an order during checkout
export async function POST(request) {
  let session;

  try {
    // Verify the customer session
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    const authSession = token
      ? await verifySessionToken(token)
      : null;

    if (!authSession || authSession.role !== "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in as a customer to place an order.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      customer,
      items,
      paymentMethod,
    } = body;

    // Validate customer details
    if (
      !customer?.name?.trim() ||
      !customer?.email?.trim() ||
      !customer?.phone?.trim() ||
      !customer?.address?.trim() ||
      !customer?.city?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required customer details.",
        },
        { status: 400 }
      );
    }

    // Validate order items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (paymentMethod !== "Cash on Delivery") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    // Combine duplicate products into one entry
    const combinedItems = new Map();

    for (const item of items) {
      const productId = item.productId || item.id;
      const quantity = Number(item.quantity);

      if (
        !productId ||
        !mongoose.Types.ObjectId.isValid(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "One or more cart items are invalid.",
          },
          { status: 400 }
        );
      }

      const existing = combinedItems.get(productId);

      if (existing) {
        existing.quantity += quantity;
      } else {
        combinedItems.set(productId, {
          productId,
          quantity,
        });
      }
    }

    const validatedItems = Array.from(combinedItems.values());

    await dbConnect();

    session = await mongoose.startSession();

    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];
      let subtotal = 0;

      for (const item of validatedItems) {
        // Decrement stock only when enough stock is available
        const product = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            new: true,
            session,
          }
        );

        if (!product) {
          throw new Error(
            `Product unavailable or insufficient stock for ID: ${item.productId}`
          );
        }

        const price = Number(product.price);

        if (!Number.isFinite(price) || price < 0) {
          throw new Error(
            `Invalid price for product: ${product.title}`
          );
        }

        const image = Array.isArray(product.images)
          ? product.images[0] || ""
          : "";

        orderItems.push({
          productId: product._id,
          title: product.title,
          price,
          image,
          quantity: item.quantity,
        });

        subtotal += price * item.quantity;
      }

      const shippingFee = SHIPPING_FEE;
      const total = subtotal + shippingFee;

      const orders = await Order.create(
        [
          {
            customer: {
              name: customer.name.trim(),
              email: customer.email.trim(),
              phone: customer.phone.trim(),
              address: customer.address.trim(),
              city: customer.city.trim(),
              postalCode: customer.postalCode?.trim() || "",
              notes: customer.notes?.trim() || "",
            },
            items: orderItems,
            subtotal,
            shippingFee,
            total,
            paymentMethod: "Cash on Delivery",
            status: "Pending",
          },
        ],
        { session }
      );

      createdOrder = orders[0];
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully.",
        order: createdOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    const isStockError =
      error.message?.includes("Product unavailable") ||
      error.message?.includes("Invalid price for product");

    return NextResponse.json(
      {
        success: false,
        message: isStockError
          ? error.message
          : "Unable to place your order. Please try again.",
      },
      { status: isStockError ? 400 : 500 }
    );
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
