export interface IOrders {
  coupon: any;
  couponDiscount: number;
  createdAt: string;
  deliveryCharge: number;
  discount: number;
  id: number;
  orderAmount: number;
  orderDate: string;
  orderNumber: string;
  orderProductsCount: number;
  orderStatus: string;
  paymentStatus: string;
  pickUp: boolean;
  requestedDate: string;
  scheme: number;
  serviceCharge: number;
  subTotal: number;
  taxableAmount: number;
  totalAmount: number;
  totalTax: number;
  updatedAt: string;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: {
    productName?: string;
    productImageUrl?: string;
  };
  bundle?: {
    name?: string;
    imageUrl?: string;
    fixedPrice?: number | string;
  };
  quantity: number;
  originalPrice: number;
  unitPrice: number;
  priceAfterDiscount: number;
  discountAmount: number;
  totalPrice: number;
}

export interface IOrderDetails {
  id: number;
  userId?: number | null;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    contactNumber?: string;
  };
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  shippingAddress?: string;
  deliveryAddress?: string;
  orderStatus: string;
  totalItems: number;
  totalAmount: number;
  shippingMethod?: string;
  shippingFee: number;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrderProduct {
  items: any;
  barcode: any;
  createdAt: string;
  id: number;
  newQuantity: number;
  orderId: number;
  packageType: any;
  price: number;
  productId: number;
  productTitle: string;
  quantity: number;
  secondlevel_category_id: number;
  secondlevel_category_title: string;
  selectedunit: any;
  size: string;
  sku: string;
  unit: string;
  updatedAt: string;
}
