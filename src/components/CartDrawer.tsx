"use client";

import { useState } from "react";
import Image from "next/image";
import { removeItemFromCart } from "@/app/actions";
import toast from "react-hot-toast";

interface CartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      handle: string;
    };
    image?: {
      url: string;
      altText: string;
    };
  };
}

interface CartData {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{ node: CartLineNode }>;
  };
}

export default function CartDrawer({ cart }: { cart: CartData | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const cartQuantity = cart?.totalQuantity || 0;
  const lines = cart?.lines?.edges || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount || "0.00";

  const handleRemove = async (lineId: string) => {
  setIsUpdating(true);
  const result = await removeItemFromCart(lineId);

  if (result.success) {
    toast.success("Item removed from cart");
  } else {
    toast.error("Failed to remove item");
  }

  setIsUpdating(false);
};

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="text-white hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span className="bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {cartQuantity}
        </span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[100] transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#1a1a1a] border-l border-[#333] z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[#333] flex justify-between items-center">
          <h2 className="text-2xl font-heading text-white uppercase">Your Cart</h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto p-6 flex flex-col gap-6 ${isUpdating ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
          {lines.length === 0 ? (
            <div className="text-center text-secondary mt-10">Your cart is empty.</div>
          ) : (
            lines.map(({ node }: { node: CartLineNode }) => {
              const merchandise = node.merchandise;
              const product = merchandise.product;
              return (
                <div key={node.id} className="flex gap-4 border-b border-[#333] pb-6 relative group">
                  <div className="relative w-24 h-24 bg-[#222] rounded-md overflow-hidden flex-shrink-0">
                    {merchandise.image && (
                      <Image 
                        src={merchandise.image.url} 
                        alt={merchandise.image.altText || product.title} 
                        fill 
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold text-sm uppercase">{product.title}</h3>
                        <p className="text-gray-400 text-xs mt-1">{merchandise.title !== "Default Title" ? merchandise.title : ""}</p>
                      </div>
                      
                      {/* Trash / Delete Button */}
                      <button 
                        onClick={() => handleRemove(node.id)}
                        disabled={isUpdating}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary font-bold text-sm">
                        ${parseFloat(merchandise.price.amount).toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm">Qty: {node.quantity}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {lines.length > 0 && cart?.checkoutUrl && (
          <div className="p-6 border-t border-[#333] bg-[#111]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white uppercase font-bold tracking-wide">Subtotal</span>
              <span className="text-primary font-bold text-xl">${parseFloat(subtotal).toFixed(2)}</span>
            </div>
            <a 
              href={cart.checkoutUrl} 
              className="block w-full text-center bg-primary hover:bg-[#e04f1a] text-white font-bold py-4 rounded uppercase tracking-wider transition-colors"
            >
              Secure Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}