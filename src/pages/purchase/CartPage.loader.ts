import type { ActionFunctionArgs } from "react-router-dom";
import { CartService } from "../../features/purchase/services/CartService";
import type {
  CartSummary,
  BookItemToPurchase,
  GetCartResponse,
  BookItemToRental,
  ProductItem,
} from "../../features/purchase/type";

/** Loader: fetch cart and normalize data for the page */
export async function CartPageLoader() {
  const cart: GetCartResponse = await CartService.getCart();
  const summary: CartSummary = createSummary(cart);
  const booksToPurchase: BookItemToPurchase[] = mapBooksToPurchase(cart);
  const booksToRental: BookItemToRental[] = mapBooksToRental(cart);
  const products: ProductItem[] = mapProducts(cart);
  const totalItems = cart.itemCount;

  return { totalItems, booksToPurchase, booksToRental, products, summary };
}

/** Action: handle cart mutations (delete, etc.) */
export async function cartAction({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "delete") {
    const cartItemId = form.get("cartItemId");
    if (!cartItemId) {
      return new Response("Missing cartItemId", { status: 400 });
    }
    await CartService.removeCartItem(String(cartItemId));
    return new Response(null, { status: 204 });
  }

  if (intent === "bulk-delete") {
    const ids = form.getAll("cartItemId").map(String).filter(Boolean);
    if (ids.length === 0) {
      return new Response("Missing cartItemId[]", { status: 400 });
    }
    await Promise.allSettled(ids.map(id => CartService.removeCartItem(id)));
    return new Response(null, { status: 204 });
  }

  if (intent === "change-qty") {
    const cartItemId = form.get("cartItemId");
    const direction = String(form.get("direction")); // 'inc' | 'dec'
    const by = Number(form.get("by") ?? 0);

    if (!cartItemId || !Number.isFinite(by) || by <= 0 
        || (direction !== "inc" && direction !== "dec")) {
      return new Response("Bad Request", { status: 400 });
    }

    // Call unit endpoints 'by' times (assuming only per-unit APIs exist)
    if (direction === "inc") {
      await Promise.allSettled(
        Array.from(
          { length: by },
          () => CartService.incrementCartItem(String(cartItemId))));
    } else {
      await Promise.allSettled(
        Array.from(
          { length: by },
          () => CartService.decrementCartItem(String(cartItemId))));
    }

    return new Response(null, { status: 204 });
  }

  return new Response("Bad Request", { status: 400 });
}

function createSummary(cart: GetCartResponse): CartSummary {
  const {
    subtotalAmount,
    discountAmount,
    shippingAmount,
    rentalAmount,
    totalAmount,
    pointsEarnable,
  } = cart;

  return {
    subtotalAmount,
    discountAmount,
    shippingAmount,
    rentalAmount,
    totalAmount,
    pointsEarnable,
  };
}

function mapBooksToPurchase(cart: GetCartResponse): BookItemToPurchase[] {
  return cart.items
    .filter((i) => i.refType === "BOOK_PURCHASE")
    .map((i) => ({
      id: i.id,
      titleSnapshot: i.titleSnapshot,
      thumbnailUrl: i.thumbnailUrl,
      listPrice: i.listPriceSnapshot,
      salePrice: i.salePriceSnapshot,
      quantity: i.quantity,
      pointsRate: i.pointsRate,
    }));
}

function mapBooksToRental(cart: GetCartResponse): BookItemToRental[] {
  return cart.items
    .filter((i) => i.refType === "BOOK_RENTAL")
    .map((i) => ({
      id: i.id,
      titleSnapshot: i.titleSnapshot,
      thumbnailUrl: i.thumbnailUrl,
      rentalPrice: i.rentalPriceSnapshot,
      quantity: i.quantity,
      pointsRate: i.pointsRate,
    }));
}

function mapProducts(cart: GetCartResponse): ProductItem[] {
  return cart.items
    .filter((i) => i.refType === "PRODUCT")
    .map((i) => ({
      id: i.id,
      titleSnapshot: i.titleSnapshot,
      thumbnailUrl: i.thumbnailUrl,
      listPrice: i.listPriceSnapshot,
      salePrice: i.salePriceSnapshot,
      quantity: i.quantity,
      pointsRate: i.pointsRate,
    }));
}

export type CartPageLoaderData = {
  totalItems: number;
  summary: CartSummary;
  booksToPurchase: BookItemToPurchase[];
  booksToRental: BookItemToRental[];
  products: ProductItem[];
};
