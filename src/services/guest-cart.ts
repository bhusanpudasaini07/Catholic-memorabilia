// Guest carts stay separate from account carts and are never sent automatically.
export interface GuestCartItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: any;
}

// Calculate in cents so saved item totals add up exactly to the cart total.
export function guestCartTotals(items: GuestCartItem[]) {
  const calculatedItems = items.map(item => {
    const price = Number(item.product?.productPrice ?? item.unitPrice);
    const originalCents = Math.round(price * 100);
    const percentage = Number(item.product?.discountPercentage);
    // Match the product card: discount applies only when hasDiscount is enabled.
    const discountPercentage = item.product?.hasDiscount === true && Number.isFinite(percentage)
      ? Math.min(100, Math.max(0, percentage)) : 0;
    const unitCents = Math.round(originalCents * (100 - discountPercentage) / 100);
    return {
      ...item,
      originalUnitPrice: originalCents / 100,
      discountPercentage,
      unitPrice: unitCents / 100,
      subTotal: originalCents * item.quantity / 100,
      discountAmount: (originalCents - unitCents) * item.quantity / 100,
      totalPrice: unitCents * item.quantity / 100,
    };
  });
  const sumCents = (field: 'subTotal' | 'discountAmount' | 'totalPrice') =>
    calculatedItems.reduce((sum, item) => sum + Math.round(item[field] * 100), 0) / 100;
  return {
    items: calculatedItems,
    totalItems: calculatedItems.reduce((sum, item) => sum + item.quantity, 0),
    subTotal: sumCents('subTotal'),
    discountAmount: sumCents('discountAmount'),
    totalAmount: sumCents('totalPrice'),
    userId: 'guest',
  };
}

export function readGuestCart() {
  if (typeof window === 'undefined') return guestCartTotals([]);
  try {
    const saved = JSON.parse(window.localStorage.getItem('cart') || 'null');
    const items = Array.isArray(saved?.items) ? saved.items : [];
    return guestCartTotals(items.map((item: any) => ({
      ...item,
      id: Number(item.productId ?? item.product_id),
      productId: Number(item.productId ?? item.product_id),
      quantity: Number(item.quantity),
      unitPrice: Number(item.product?.productPrice ?? item.unitPrice),
    })).filter((item: GuestCartItem) => Number.isInteger(item.productId) && item.productId > 0 &&
      Number.isInteger(item.quantity) && item.quantity > 0 && Number.isFinite(item.unitPrice) && item.unitPrice >= 0));
  } catch {
    return guestCartTotals([]);
  }
}

export function writeGuestCart(items: GuestCartItem[]) {
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
