// Plain (serializable) shapes passed from server components to client components.

export type BundleView = {
  id: string;
  label: string;
  quantity: number;
  price: number;
  compareAt: number | null;
  freeShipping: boolean;
  isPopular: boolean;
};

export type ProductView = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  currencySymbol: string;
  shippingFee: number;
  freeShippingQty: number | null;
  stock: number;
};

export type UpsellView = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  extraQuantity: number;
  discountPercent: number;
  freeShipping: boolean;
};
