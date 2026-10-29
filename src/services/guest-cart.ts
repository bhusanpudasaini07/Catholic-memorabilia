// Guest carts stay separate from account carts and are never sent automatically.
export interface GuestCartItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  originalPrice?: number;
  originalUnitPrice?: number;
  discountPercentage?: number;
  priceAfterDiscount?: number;
  subTotal?: number;
  discountAmount?: number;
  product: any;
}

export interface GuestCart {
  items: GuestCartItem[];
  totalItems: number;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  userId: string;
}

// Calculate in cents so saved item totals add up exactly to the cart total.
export function guestCartTotals(items: GuestCartItem[]): GuestCart {
  let subTotalCents = 0;
  let discountCents = 0;
  let totalCents = 0;
  const calculatedItems = items.map(item => {
    // Prefer the catalog price. unitPrice may already be a discounted price from a previous save.
    const price = Number(item.product?.productPrice ?? item.originalPrice ?? item.originalUnitPrice ?? item.unitPrice);
    const originalCents = Math.round(price * 100);
    const percentage = Number(item.product?.discountPercentage);
    // Same rule as the product card: discount applies only when hasDiscount is on.
    const discountPercentage = item.product?.hasDiscount === true && Number.isFinite(percentage) && percentage > 0
      ? Math.min(100, Math.max(0, percentage)) : 0;
    // Same expression as the product card, then round to cents.
    const priceAfterDiscount = Math.round((price - (price * discountPercentage / 100)) * 100) / 100;
    const unitCents = Math.round(priceAfterDiscount * 100);
    const lineOriginalCents = originalCents * item.quantity;
    const lineTotalCents = unitCents * item.quantity;
    const lineDiscountCents = lineOriginalCents - lineTotalCents;
    subTotalCents += lineOriginalCents;
    discountCents += lineDiscountCents;
    totalCents += lineTotalCents;
    const originalPrice = originalCents / 100;
    const product = item.product
      ? { ...item.product, originalPrice, priceAfterDiscount }
      : item.product;
    return {
      ...item,
      product,
      originalPrice,
      originalUnitPrice: originalPrice,
      discountPercentage,
      unitPrice: priceAfterDiscount,
      priceAfterDiscount,
      subTotal: lineOriginalCents / 100,
      discountAmount: lineDiscountCents / 100,
      totalPrice: lineTotalCents / 100,
    };
  });
  return {
    items: calculatedItems,
    totalItems: calculatedItems.reduce((sum, item) => sum + item.quantity, 0),
    subTotal: subTotalCents / 100,
    discountAmount: discountCents / 100,
    totalAmount: totalCents / 100,
    userId: 'guest',
  };
}

export function readGuestCart(): GuestCart {
  if (typeof window === 'undefined') return guestCartTotals([]);
  try {
    const saved = JSON.parse(window.localStorage.getItem('cart') || 'null');
    const items = Array.isArray(saved?.items) ? saved.items : [];
    return guestCartTotals(items.map((item: any) => ({
      ...item,
      id: Number(item.productId ?? item.product_id),
      productId: Number(item.productId ?? item.product_id),
      quantity: Number(item.quantity),
      unitPrice: Number(item.product?.productPrice ?? item.originalPrice ?? item.originalUnitPrice ?? item.unitPrice),
    })).filter((item: GuestCartItem) => Number.isInteger(item.productId) && item.productId > 0 &&
      Number.isInteger(item.quantity) && item.quantity > 0 && Number.isFinite(item.unitPrice) && item.unitPrice >= 0));
  } catch {
    return guestCartTotals([]);
  }
}

export function writeGuestCart(items: GuestCartItem[]): GuestCart {
  const cart = guestCartTotals(items);
  // Propagate storage failures to the existing mutation error handler.
  window.localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
}

export function validateQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Quantity must be a positive whole number.');
}

export function addGuestCartItem(data: { productId: number; quantity: number; product?: any }) {
  validateQuantity(data.quantity);
  if (!Number.isInteger(data.productId) || data.productId < 1) throw new Error('Please select a valid product.');
  const items = readGuestCart().items;
  const existing = items.find(item => item.productId === data.productId);
  if (existing) {
    existing.quantity += data.quantity;
    if (data.product) existing.product = data.product;
  }
  else {
    const unitPrice = Number(data.product?.productPrice);
    if (!data.product || !Number.isFinite(unitPrice) || unitPrice < 0) throw new Error('Product details are unavailable. Please try again.');
    items.push({ id: data.productId, productId: data.productId, quantity: data.quantity,
      unitPrice, totalPrice: 0, product: data.product });
  }
  return writeGuestCart(items);
}
