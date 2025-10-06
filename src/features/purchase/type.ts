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