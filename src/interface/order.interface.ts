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
  total: number;
  totalTax: number;
  updatedAt: string;
}

export interface IOrderDetails {
  coupon: any;
  couponDiscount: number;
  createdAt: string;
  delivery: boolean;
  deliveryAddress: any;
  deliveryCharge: number;
  discount: number;
  id: number;
  nonTaxableAmount: number;
  note: string;
  orderAmount: number;
  orderDate: string;
  orderNumber: string;
  orderProducts: Array<IOrderProduct>;
  orderStatus: string;
  paymentMethod: any;
  paymentStatus: string;
  pickUp: any;
  requestedDate: string;
  scheme: number;
  serviceCharge: number;
  serviceChargePercent: number;
  statusLog: any;
  subTotal: number;
  taxableAmount: number;
  total: number;
  totalTax: number;
  updatedAt: string;
}

export interface IOrderProduct {
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
