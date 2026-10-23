
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

// A separate storage key for the Minicom project
const CART_STORAGE_KEY = "minicom-shopping-cart-v1";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load Minicom's cart when the app starts
  useEffect(() => {
    try {
      // Remove the old project's cart data
      localStorage.removeItem("shopping-cart");

      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save Minicom's cart whenever it changes
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    }
  }, [cart, hydrated]);

  // Add a product or increase its quantity
  const addToCart = useCallback((product, quantity = 1) => {
    const id = String(product._id || product.id);

    const image =
      (typeof product.image === "string" && product.image) ||
      (typeof product.images?.[0] === "string"
        ? product.images[0]
        : product.images?.[0]?.url) ||
      product.imageUrl ||
      product.thumbnail ||
      "";

    const newItem = {
      id,
      title: product.title || product.name || "Untitled product",
      price: Number(product.price) || 0,
      image,
      quantity: Math.max(1, Math.floor(Number(quantity) || 1)),
      stock:
        product.stock == null
          ? null
          : Math.max(0, Number(product.stock) || 0),
    };

    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => String(item.id) === id
      );

      if (existing) {
        const requestedQuantity =
          existing.quantity + newItem.quantity;

        const updatedQuantity =
          existing.stock == null
            ? requestedQuantity
            : Math.min(requestedQuantity, existing.stock);

        return previousCart.map((item) =>
          String(item.id) === id
            ? { ...item, quantity: updatedQuantity }
            : item
        );
      }

      if (newItem.stock !== null && newItem.stock < 1) {
        return previousCart;
      }

      return [...previousCart, newItem];
    });
  }, []);

  // Increase quantity
  const increaseQuantity = useCallback((id) => {
    setCart((previousCart) =>
      previousCart.map((item) => {
        if (String(item.id) !== String(id)) return item;

        if (
          item.stock !== null &&
          item.stock != null &&
          item.quantity >= item.stock
        ) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  }, []);

  // Decrease quantity, but never below 1
  const decreaseQuantity = useCallback((id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  }, []);

  // Remove one product
  const removeFromCart = useCallback((id) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  }, []);

  // Clear the entire cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        hydrated,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
