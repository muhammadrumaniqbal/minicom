
import dbconnect from "@/backend/dbconnect";
import Product from "@/backend/product";
import Category from "@/backend/category";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await dbconnect();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id)
      .populate("category")
      .lean();

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found in database" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("GET product error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbconnect();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return Response.json(
        { success: false, message: "Product not found in database" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("DELETE product error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
