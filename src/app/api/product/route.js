
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbconnect from "@/backend/dbconnect";
import Product from "@/backend/product";
import Category from "@/backend/category";

// GET: Fetch all products
export async function GET() {
  try {
    await dbconnect();

    const res = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        res,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products.",
      },
      { status: 500 }
    );
  }
}

// POST: Add a new product
export async function POST(req) {
  try {
    await dbconnect();

    const data = await req.json();

    // Validate required fields
    if (!data.title || data.price == null || !data.category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, price, and category are required.",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.isValidObjectId(data.category)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID.",
        },
        { status: 400 }
      );
    }

    // Confirm that the category exists
    const categoryExists = await Category.findById(
      data.category
    );

    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected category does not exist.",
        },
        { status: 404 }
      );
    }

    // Validate price
    if (
      !Number.isFinite(Number(data.price)) ||
      Number(data.price) < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    const res = await Product.create({
      ...data,
      title: data.title.trim(),
      price: Number(data.price),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        res,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}
