"use server";

import { shopifyFetch } from "@/lib/shopify";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getCartQuery, addToCartMutation, removeFromCartMutation } from "@/lib/queries";

const createCartMutation = `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;

export async function addVariantToCart(variantId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  const lineItems = [{ merchandiseId: variantId, quantity: 1 }];

  try {
    if (cartId) {
      await shopifyFetch({
        query: addToCartMutation,
        variables: { cartId, lines: lineItems },
      });
    } else {
      const data = await shopifyFetch({
        query: createCartMutation,
        variables: { lineItems },
      });

      const newCart = data?.cartCreate?.cart;
      if (newCart?.id) {
        cookieStore.set("cartId", newCart.id, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false };
  }
}

export async function getCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) return null;

  try {
    const data = await shopifyFetch({
      query: getCartQuery,
      variables: { cartId },
    });
    return data?.cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function removeItemFromCart(lineId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) return { success: false };

  try {
    await shopifyFetch({
      query: removeFromCartMutation,
      variables: { cartId, lineIds: [lineId] },
    });

    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Error removing item:", error);
    return { success: false };
  }
}