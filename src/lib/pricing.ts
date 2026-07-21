import type { Bundle, Product } from "@prisma/client";

export type PricingResult = {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

/**
 * Compute the order totals. A selected bundle takes precedence over a raw
 * quantity: the bundle defines its own quantity and total price.
 */
export function computePricing(
  product: Pick<
    Product,
    "price" | "compareAtPrice" | "shippingFee" | "freeShippingQty"
  >,
  quantity: number,
  bundle?: Pick<
    Bundle,
    "quantity" | "price" | "compareAt" | "freeShipping"
  > | null,
): PricingResult {
  if (bundle) {
    const qty = bundle.quantity;
    const subtotal = (bundle.compareAt ?? product.price * qty);
    const bundleTotal = bundle.price;
    const discount = Math.max(0, subtotal - bundleTotal);
    const shipping = bundle.freeShipping ? 0 : shippingFor(product, qty);
    return {
      quantity: qty,
      unitPrice: Math.round(bundleTotal / qty),
      subtotal,
      discount,
      shipping,
      total: bundleTotal + shipping,
    };
  }

  const qty = Math.max(1, quantity);
  const subtotal = product.price * qty;
  const discount = 0;
  const shipping = shippingFor(product, qty);
  return {
    quantity: qty,
    unitPrice: product.price,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
  };
}

function shippingFor(
  product: Pick<Product, "shippingFee" | "freeShippingQty">,
  qty: number,
): number {
  if (
    product.freeShippingQty != null &&
    product.freeShippingQty > 0 &&
    qty >= product.freeShippingQty
  ) {
    return 0;
  }
  return product.shippingFee ?? 0;
}
