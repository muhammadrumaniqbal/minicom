
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext(null);
const WISHLIST_KEY = "minicom-wishlist";

function getProductId(product) {
  return String(product?._id || product?.id || "");
}

function getProductImage(product) {
  return (
    (typeof product?.image === "string" && product.image) ||
    (typeof product?.images?.[0] === "string"
      ? product.images[0]
      : product?.images?.[0]?.url) ||
    product?.imageUrl ||
    product?.thumbnail ||
    ""
  );
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load saved products when the app starts.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save changes after the initial load.
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlist, hydrated]);

  // Add a product, or remove it if it is already saved.
  const toggleWishlist = useCallback((product) => {
    const id = getProductId(product);

    if (!id) return;

    const image = getProductImage(product);

    const savedProduct = {
      ...product,
      id,
      _id: id,
      image,
    };

    setWishlist((current) => {
      const alreadySaved = current.some(
        (item) => getProductId(item) === id
      );

      if (alreadySaved) {
        return current.filter(
          (item) => getProductId(item) !== id
        );
      }

      return [...current, savedProduct];
    });
  }, []);

  const isWishlisted = useCallback(
    (productOrId) => {
      const id =
        typeof productOrId === "object"
          ? getProductId(productOrId)
          : String(productOrId || "");

      return wishlist.some(
        (product) => getProductId(product) === id
      );
    },
    [wishlist]
  );

  const removeFromWishlist = useCallback((productOrId) => {
    const id =
      typeof productOrId === "object"
        ? getProductId(productOrId)
        : String(productOrId || "");

    setWishlist((current) =>
      current.filter((product) => getProductId(product) !== id)
    );
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        hydrated,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}
