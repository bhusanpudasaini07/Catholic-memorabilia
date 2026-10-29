// Guest carts stay separate from account carts and are never sent automatically.
export interface GuestCartItem {
  id: number;
  productId?: number;
  bundleId?: number;
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
    if (item.bundleId) {
      const price = Number(item.product?.productPrice ?? item.unitPrice);
      const unitCents = Math.round(price * 100);
      const lineTotalCents = unitCents * item.quantity;
      subTotalCents += lineTotalCents;
      totalCents += lineTotalCents;
      const unitPrice = unitCents / 100;
      return {
        ...item,
        originalPrice: unitPrice,
        originalUnitPrice: unitPrice,
        discountPercentage: 0,
        unitPrice,
        priceAfterDiscount: unitPrice,
        subTotal: lineTotalCents / 100,
        discountAmount: 0,
        totalPrice: lineTotalCents / 100,
      };
    }
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

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    if (!cleaned) return undefined;
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function firstNumber(values: unknown[]): number | undefined {
  for (const value of values) {
    const parsed = toNumber(value);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function normalizeGuestItem(item: any): GuestCartItem | null {
  const bundleId = toNumber(item?.bundleId);
  const productId = bundleId
    ? undefined
    : firstNumber([item?.productId, item?.product_id, item?.product?.id]);
  const quantity = toNumber(item?.quantity);
  const unitPrice = firstNumber([
    item?.product?.productPrice,
    item?.originalPrice,
    item?.originalUnitPrice,
    item?.unitPrice,
    item?.product?.netPrice,
    item?.priceAfterDiscount,
  ]) ?? 0;

  if (!quantity || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(unitPrice) || unitPrice < 0) {
    return null;
  }
  if (bundleId) {
    if (!Number.isInteger(bundleId) || bundleId < 1) return null;
  } else if (!productId || !Number.isInteger(productId) || productId < 1) {
    return null;
  }

  return {
    ...item,
    id: (bundleId ?? productId) as number,
    productId,
    bundleId: bundleId && bundleId > 0 ? bundleId : undefined,
    quantity,
    unitPrice,
    totalPrice: Number(item?.totalPrice) || 0,
    product: item?.product,
  };
}

export function readGuestCart(): GuestCart {
  if (typeof window === 'undefined') return guestCartTotals([]);
  try {
    const saved = JSON.parse(window.localStorage.getItem('cart') || 'null');
    const source = Array.isArray(saved) ? saved : Array.isArray(saved?.items) ? saved.items : [];
    const items: GuestCartItem[] = [];
    source.forEach((item: any) => {
      try {
        const normalized = normalizeGuestItem(item);
        if (normalized) items.push(normalized);
      } catch {
        // Skip one damaged line instead of dropping the whole cart.
      }
    });
    return guestCartTotals(items);
  } catch {
    return guestCartTotals([]);
  }
}

export function removeGuestCartItem(productId?: number, bundleId?: number): GuestCart {
  const items = readGuestCart().items;
  const matchIndex = items.findIndex((item) => {
    if (bundleId) return Number(item.bundleId) === Number(bundleId);
    return !item.bundleId && Number(item.productId) === Number(productId);
  });
  if (matchIndex < 0) return readGuestCart();
  return writeGuestCart(items.filter((_, index) => index !== matchIndex));
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
  const existing = items.find(item => !item.bundleId && item.productId === data.productId);
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

export function addGuestBundleItem(data: {
  bundleId: number;
  quantity: number;
  bundle?: { name?: string; imageUrl?: string; fixedPrice?: number | string };
}) {
  validateQuantity(data.quantity);
  if (!Number.isInteger(data.bundleId) || data.bundleId < 1) throw new Error('Please select a valid bundle.');
  const unitPrice = Number(data.bundle?.fixedPrice);
  if (!data.bundle || !Number.isFinite(unitPrice) || unitPrice < 0) throw new Error('Bundle details are unavailable. Please try again.');
  const items = readGuestCart().items;
  const product = {
    id: data.bundleId,
    productName: data.bundle.name,
    productImageUrl: data.bundle.imageUrl,
    productPrice: unitPrice,
    hasDiscount: false,
  };
  const existing = items.find(item => item.bundleId === data.bundleId);
  if (existing) {
    existing.quantity += data.quantity;
    existing.product = product;
    existing.unitPrice = unitPrice;
  } else {
    items.push({
      id: data.bundleId,
      bundleId: data.bundleId,
      quantity: data.quantity,
      unitPrice,
      totalPrice: 0,
      product,
    });
  }
  return writeGuestCart(items);
}
