export type OrderType = 'BOOK_PURCHASE' | 'BOOK_RENTAL' | 'PRODUCT';

export type GetCartResponse = {
  id: string;
  userId: string;
  status: string;
  items: CartItem[];
  itemCount: number;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  rentalAmount: number;
  totalAmount: number;
  pointsEarnable: number;
}

export type addCartPurchaseItemRequest = {
  refType: OrderType;
  refId: string;
  quantity: number;
}

export type addCartRentalItemRequest = {
  refType: OrderType;
  refId: string;
  rentalDays: number;
  quantity: number; 
}

export type CartSummary = {
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  rentalAmount: number;
  totalAmount: number;
  pointsEarnable: number;
}

export type CartItem = {
  id: string;
  refType: OrderType;
  refId: string;
  titleSnapshot: string;
  thumbnailUrl: string;
  listPriceSnapshot: number;
  salePriceSnapshot: number;
  rentalDays: number;
  rentalPriceSnapshot: number;
  quantity: number;
  pointsRate: number;
}

export type BookItemToPurchase = {
  id: string;
  titleSnapshot: string;
  thumbnailUrl: string;
  listPrice: number;
  salePrice: number;
  quantity: number;
  pointsRate: number;
}

export type BookItemToRental = {
  id: string;
  titleSnapshot: string;
  thumbnailUrl: string;
  rentalPrice: number;
  quantity: number;
  pointsRate: number;
}

export type ProductItem = {
  id: string;
  titleSnapshot: string;
  thumbnailUrl: string;
  listPrice: number;
  salePrice: number;
  quantity: number;
  pointsRate: number;
}

export type CreateOrderFromCartRequest = {
  cartItemIds: string[];
}

export type CreateOrderDirectRequest = {
  refType: string;
  refId: string;
  quantity: number;
}

export type Order = {
  id: string;
  orderNo: string;
  userId: string;
  cartId: string;
  shippingAddressId: string;
  status: string;
  rentalStatus: string;
  paymentStatus: string;
  itemCount: number;
  subtotalAmount: number;
  discountAmount: number;
  couponDiscountAmount: number;
  shippingAmount: number;
  rentalAmount: number;
  totalAmount: number;
  placedAt: string;
  paidAt: string;
  cancelledAt: string;
  completedAt: string;
  
  appliedCouponIssuanceId: number;
  pointsSpent: number;
  pointsEarned: number;
  items: OrderItem[];
}

export type OrderAggregation = {
  subtotalAmount: number;
  discountAmount: number;
  couponDiscountAmount: number;
  shippingAmount: number;
  rentalAmount: number;
  totalAmount: number;
  pointsSpent: number;
  pointsEarned: number;
}

export type OrderItem = {
  id: string;
  orderId: string;
  refType: string;
  refId: string;

  titleSnapshot: string;
  thumbnailUrl: string;

  listPriceSnapshot: number;
  salePriceSnapshot: number;
  quantity: number;

  rentalDays: number;
  rentalPriceSnapshot: number;

  pointsRate: number;
  pointsEarnedItem: number;

  lineSubtotalAmount: number;
  lineDiscountAmount: number;
  lineTotalAmount: number;
}

export type CouponIssuance = {
  id: string;
  couponId: string;
  userId: string;
  issuedAt: string;
  expiresAt: string;
  status: string;
  code: string;
  name: string;
  type: string;
  discountAmount: number;
  discountRateBp: number;
  maxDiscountAmount: number;
  scope: string;
}

export type ApplyCouponRequest = {
  couponIssuanceId: string;
}

export type ApplyPointsRequest = {
  points: number;
}

export type GetPointBalanceResponse = {
  balance: number;
}

export type PointTransaction = {
  id: string;
  kind: string;
  amountSigned: string;
  orderId: string;
  orderNo: string;
  memo: string;
  createdAt: string;
}

export type KakaoReadyResponse = {
  tid: string;
  next_redirect_pc_url?: string;
  next_redirect_mobile_url?: string;
  next_redirect_app_url?: string;
  amount: number;
  orderId: number;
};

export type ApprovePaymentResponse = {
  orderId: number;
  paymentId: number;
  paymentStatus: 'PAID' | 'READY' | 'PARTIAL_REFUNDED' | 'REFUNDED' | 'FAILED' | 'CANCELLED';
  orderStatus: 'PENDING' | 'FULFILLING' | 'COMPLETED' | 'CANCELLED';
};

export type KakaoApproveRequest = {
  userId: string | number;
  orderId: string | number;
  pg_token: string;
};
