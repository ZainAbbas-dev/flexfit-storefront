"use client";

import { useState } from "react";
import { addVariantToCart } from "@/app/actions";
import toast from "react-hot-toast"; // Naya import

export default function AddToCart({ variantId }: { variantId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [added, setsetAdded] = useState(false); // typo fix: setAdded

  const handleAddToCart = async () => {
    setIsPending(true);
    const result = await addVariantToCart(variantId);
    
    if (result.success) {
      setsetAdded(true);
      toast.success("Item added to your cart!"); // Toast trigger
      setTimeout(() => setsetAdded(false), 2000);
    } else {
      toast.error("Failed to add item."); // Error toast
    }
    setIsPending(false);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending}
      className={`w-full font-bold py-4 px-8 rounded uppercase tracking-wider transition-colors text-white 
        ${added ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-[#e04f1a]"} 
        disabled:opacity-70`}
    >
      {isPending ? "Adding..." : added ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}