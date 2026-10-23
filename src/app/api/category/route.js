
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbconnect from "@/backend/dbconnect";
import Category from "@/backend/category";
import Product from "@/backend/product";

// GET: Fetch all categories
export async function GET() {
  try {
    await dbconnect();

    const res = await Category.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, res },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories.",
      },
      { status: 500 }
    );
  }
}

// POST: Create a category
export async function POST(request) {
  try {
    await dbconnect();

    const data = await request.json();

    if (
      typeof data.title !== "string" ||
      !data.title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Category title is required.",
        },
        { status: 400 }
      );
    }

    const title = data.title.trim();

    // Check for an existing category, ignoring letter case
    const escapedTitle = title.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const existingCategory = await Category.findOne({
      title: {
        $regex: `^${escapedTitle}$`,
        $options: "i",
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "This category already exists.",
        },
        { status: 409 }
      );
    }

    const res = await Category.create({ title });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        res,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "This category already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category.",
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a category
export async function DELETE(request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid category ID is required.",
        },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    // Do not delete categories assigned to existing products
    const productsUsingCategory = await Product.exists({
      category: id,
    });

    if (productsUsingCategory) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This category is assigned to products. Move those products to another category before deleting it.",
        },
        { status: 409 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category.",
      },
      { status: 500 }
    );
  }
}
