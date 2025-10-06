import { useFetcher, useLoaderData } from 'react-router-dom';
import type { CartPageLoaderData } from './CartPage.loader';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from 'reactstrap';
import { formatPoint, formatWon } from '../../features/purchase/utils/formatter';
import { FiGift } from 'react-icons/fi';
import type { OrderType } from '../../features/purchase/type';

import CartItem from '../../features/purchase/components/CartItem';
import s from './CartPage.module.css';

const keyOf = (t: OrderType, id: string) => `${t}:${id}`;

export default function CartPage() {
  const { totalItems, booksToPurchase, booksToRental, products, summary } =
    useLoaderData() as CartPageLoaderData;

  const fetcher = useFetcher();
  const isMutating = fetcher.state !== 'idle';

  /** typed keys per group (avoid collisions across groups) */
  const purchaseKeys = useMemo(() => {
    return booksToPurchase.map(b => keyOf('BOOK_PURCHASE', b.id));
  }, [booksToPurchase]);

  const rentalKeys = useMemo(() => {
    return booksToRental.map(b => keyOf('BOOK_RENTAL', b.id));
  }, [booksToRental]);

  const productKeys = useMemo(() => {
    return products.map(p => keyOf('PRODUCT', p.id));
  }, [products]);

  /** merge all typed keys */
  const allKeys = useMemo(() => {
    return [...purchaseKeys, ...rentalKeys, ...productKeys];
  }, [purchaseKeys, rentalKeys, productKeys]);

  /** selection states (store typed keys) */
  const [selected, setSelected] = useState<Set<string>>(new Set(allKeys));

  /** reselect all when data changes */
  useEffect(() => {
    setSelected(new Set(allKeys));
  }, [allKeys]);

  /** global select-all checkbox state */
  const allRef = useRef<HTMLInputElement>(null);
  const isAll = allKeys.length > 0 && allKeys.every(k => selected.has(k));

  useEffect(() => {
    if (!allRef.current) {
      return;
    }
    const some = selected.size > 0 && selected.size < allKeys.length;
    allRef.current.indeterminate = some && !isAll;
  }, [selected, allKeys.length, isAll]);

  /** group-level select-all refs */
  const purchaseAllRef = useRef<HTMLInputElement>(null);
  const rentalAllRef = useRef<HTMLInputElement>(null);
  const productAllRef = useRef<HTMLInputElement>(null);

  /** check if all selected per group */
  const purchaseIsAll = purchaseKeys.length > 0 && purchaseKeys.every(k => selected.has(k));
  const rentalIsAll = rentalKeys.length > 0 && rentalKeys.every(k => selected.has(k));
  const productIsAll = productKeys.length > 0 && productKeys.every(k => selected.has(k));

  /** update indeterminate for each group */
  useEffect(() => {
    if (!purchaseAllRef.current) {
      return;
    }
    const some = purchaseKeys.some(k => selected.has(k));
    purchaseAllRef.current.indeterminate = some && !purchaseIsAll;
  }, [purchaseKeys, selected, purchaseIsAll]);

  useEffect(() => {
    if (!rentalAllRef.current) {
      return;
    }
    const some = rentalKeys.some(k => selected.has(k));
    rentalAllRef.current.indeterminate = some && !rentalIsAll;
  }, [rentalKeys, selected, rentalIsAll]);

  useEffect(() => {
    if (!productAllRef.current) {
      return;
    }
    const some = productKeys.some(k => selected.has(k));
    productAllRef.current.indeterminate = some && !productIsAll;
  }, [productKeys, selected, productIsAll]);

  /** read current qty from loader data using typed key */
  const getCurrentQty = (typedKey: string): number => {
    const [type, id] = typedKey.split(':') as [OrderType, string];
    if (type === 'BOOK_PURCHASE') {
      const item = booksToPurchase.find(b => b.id === id);
      return item ? item.quantity : 0;
    }
    if (type === 'BOOK_RENTAL') {
      const item = booksToRental.find(b => b.id === id);
      return item ? item.quantity : 0;
    }
    const item = products.find(p => p.id === id);
    return item ? item.quantity : 0;
  };

  /** qty change → submit delta to action (inc = addItem, dec = decreaseItem) */
  const handleQtyChange = (typedKey: string, nextQty: number) => {
    if (isMutating) {
      return;
    }

    const [, cartItemId] = typedKey.split(':');
    const curr = getCurrentQty(typedKey);
    const diff = nextQty - curr;

    // nothing to do
    if (!Number.isFinite(diff) || diff === 0) {
      return;
    }

    // if goes to 0 or below → treat as delete-all of that item
    if (nextQty <= 0) {
      const fd = new FormData();
      fd.append('intent', 'delete');
      fd.append('cartItemId', cartItemId);
      fetcher.submit(fd, { method: 'post' });
      return;
    }

    const fd = new FormData();
    fd.append('intent', 'change-qty');
    fd.append('cartItemId', cartItemId);
    fd.append('direction', diff > 0 ? 'inc' : 'dec'); // inc → addItem, dec → decreaseItem
    fd.append('by', String(Math.abs(diff)));
    fetcher.submit(fd, { method: 'post' });
  };

  /** handle single checkbox change (typed key) */
  const handleSelectChange = (typedKey: string, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(typedKey);
      } else {
        next.delete(typedKey);
      }
      return next;
    });
  };

  /** handle global select-all */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(allKeys));
    } else {
      setSelected(new Set());
    }
  };

  /** handle per-group select-all (typed keys) */
  const handleSelectAllGroup = (keys: string[], checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      for (const k of keys) {
        if (checked) {
          next.add(k);
        } else {
          next.delete(k);
        }
      }
      return next;
    });
  };

  /** delete handler: remove typed key from UI, submit id to action */
  const handleDelete = (typedKey: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(typedKey);
      return next;
    });

    const [, cartItemId] = typedKey.split(':'); // extract raw id for API
    fetcher.submit(
      { intent: 'delete', cartItemId },
      { method: 'post' } // same-route action; method is required
    );
  };

  /** bulk delete: submit all selected ids in one request (form.getAll on action) */
  const handleDeleteSelected = () => {
    if (selected.size === 0 || isMutating) {
      return;
    }

    // Optimistic: simply clear selection; the list itself will refresh on revalidate
    const keysToDelete = Array.from(selected);
    setSelected(prev => {
      const next = new Set(prev);
      for (const k of keysToDelete) {
        next.delete(k);
      }
      return next;
    });

    const fd = new FormData();
    fd.append('intent', 'bulk-delete');
    for (const typedKey of keysToDelete) {
      const [, id] = typedKey.split(':');
      fd.append('cartItemId', id); // multiple values under the same name
    }

    fetcher.submit(fd, { method: 'post' });
  };

  /** compute summary based on *selected* items only */
  const displaySummary = useMemo(() => {
    let listSubtotal = 0;   // sum of listPrice * qty (purchase/product)
    let saleAmount = 0;     // sum of salePrice * qty (purchase/product)
    let rentalAmount = 0;   // sum of rentalPrice * qty (rental)
    let points = 0;         // total points

    const has = (typedKey: string) => selected.has(typedKey);

    // BOOK_PURCHASE
    for (const b of booksToPurchase) {
      const key = `BOOK_PURCHASE:${b.id}`;
      if (!has(key)) { continue; }
      const qty = b.quantity ?? 1;
      if (Number.isFinite(b.listPrice)) { 
        listSubtotal += (b.listPrice! * qty); 
      }
      if (Number.isFinite(b.salePrice)) {
        saleAmount += (b.salePrice! * qty);
        if (Number.isFinite(b.pointsRate)) {
          points += Math.floor((b.salePrice! * qty) * (b.pointsRate ?? 0) / 100);
        }
      }
    }

    // BOOK_RENTAL
    for (const r of booksToRental) {
      const key = `BOOK_RENTAL:${r.id}`;
      if (!has(key)) { continue; }
      const qty = r.quantity ?? 1;
      if (Number.isFinite(r.rentalPrice)) {
        rentalAmount += (r.rentalPrice! * qty);
        if (Number.isFinite(r.pointsRate)) {
          points += Math.floor((r.rentalPrice! * qty) * (r.pointsRate ?? 0) / 100);
        }
      }
    }

    // PRODUCT
    for (const p of products) {
      const key = `PRODUCT:${p.id}`;
      if (!has(key)) { continue; }
      const qty = p.quantity ?? 1;
      if (Number.isFinite(p.listPrice)) { listSubtotal += (p.listPrice! * qty); }
      if (Number.isFinite(p.salePrice)) {
        saleAmount += (p.salePrice! * qty);
        if (Number.isFinite(p.pointsRate)) {
          points += Math.floor((p.salePrice! * qty) * (p.pointsRate ?? 0) / 100);
        }
      }
    }

    // discount amount = difference between list and sale subtotals
    const discountAmount = Math.max(0, listSubtotal - saleAmount);

    // shipping rule: if all items are selected, keep server shipping; otherwise assume 0
    const shippingAmount =
      selected.size === allKeys.length ? (summary.shippingAmount ?? 0) : 0;

    const totalAmount = saleAmount + rentalAmount + shippingAmount;

    return {
      subtotalAmount: listSubtotal,
      discountAmount,
      rentalAmount,
      shippingAmount,
      totalAmount,
      pointsEarnable: points,
    };
  }, [selected, booksToPurchase, booksToRental, products, allKeys.length, summary.shippingAmount]);

  return (
    <main className={s['page-layout']}>
      {/* LEFT: selection + item lists */}
      <section className={s['cart-left']}>
        {/* Global header (Select All) */}
        <div className={s['cart-header']}>
          <div className={s['select-all']}>
            <Input
              innerRef={allRef}
              type="checkbox"
              checked={isAll}
              onChange={e => handleSelectAll(e.target.checked)}
            />
            <span>전체선택 ({selected.size}/{totalItems})</span>
          </div>

          {/* Selected delete */}
          <button
            className={s['delete-selected-items']}
            onClick={handleDeleteSelected}
            disabled={isMutating || selected.size === 0}
            title={selected.size === 0 ? '선택된 항목이 없습니다' : '선택 항목 삭제'}
          >
            선택삭제
          </button>
        </div>

        <div className={s['cart-content']}>
          {/* BOOK PURCHASE */}
          <div className={s['cart-book-purchase']}>
            <div className={s['cart-book-purchase-header']}>
              <div className={s['select-all']}>
                <Input
                  innerRef={purchaseAllRef}
                  type="checkbox"
                  checked={purchaseIsAll}
                  onChange={e => handleSelectAllGroup(purchaseKeys, e.target.checked)}
                />
                <span>도서 - 구매</span>
              </div>
              <div className={s['subtotal-count']}>
                <span>총 {booksToPurchase.length}개</span>
              </div>
            </div>

            <div className={s['cart-book-purchase-list']}>
              {booksToPurchase.length === 0 ? (
                <div className={s['no-content']}>
                  <span>담은 도서가 존재하지 않습니다.</span>
                </div>
              ) : (
                booksToPurchase.map(b => {
                  const typedKey = keyOf('BOOK_PURCHASE', b.id);
                  return (
                    <CartItem
                      key={typedKey}
                      imgUrl={b.thumbnailUrl}
                      title={b.titleSnapshot}
                      listPrice={b.listPrice}
                      salePrice={b.salePrice}
                      isSelected={selected.has(typedKey)}
                      onSelectChange={checked => handleSelectChange(typedKey, checked)}
                      onQtyChange={(nextQty) => handleQtyChange(typedKey, nextQty)}
                      onDeleteClick={() => handleDelete(typedKey)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* BOOK RENTAL */}
          <div className={s['cart-book-rental']}>
            <div className={s['cart-book-rental-header']}>
              <div className={s['select-all']}>
                <Input
                  innerRef={rentalAllRef}
                  type="checkbox"
                  checked={rentalIsAll}
                  onChange={e => handleSelectAllGroup(rentalKeys, e.target.checked)}
                />
                <span>도서 - 대여</span>
              </div>
              <div className={s['subtotal-count']}>
                <span>총 {booksToRental.length}개</span>
              </div>
            </div>

            <div className={s['cart-book-rental-list']}>
              {booksToRental.length === 0 ? (
                <div className={s['no-content']}>
                  <span>담은 도서가 존재하지 않습니다.</span>
                </div>
              ) : (
                booksToRental.map(b => {
                  const typedKey = keyOf('BOOK_RENTAL', b.id);
                  return (
                    <CartItem
                      key={typedKey}
                      imgUrl={b.thumbnailUrl}
                      title={b.titleSnapshot}
                      salePrice={b.rentalPrice}
                      isSelected={selected.has(typedKey)}
                      onSelectChange={checked => handleSelectChange(typedKey, checked)}
                      onQtyChange={(nextQty) => handleQtyChange(typedKey, nextQty)}
                      onDeleteClick={() => handleDelete(typedKey)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* PRODUCT */}
          <div className={s['cart-product']}>
            <div className={s['cart-product-header']}>
              <div className={s['select-all']}>
                <Input
                  innerRef={productAllRef}
                  type="checkbox"
                  checked={productIsAll}
                  onChange={e => handleSelectAllGroup(productKeys, e.target.checked)}
                />
                <span>상품</span>
              </div>
              <div className={s['subtotal-count']}>
                <span>총 {products.length}개</span>
              </div>
            </div>

            <div className={s['cart-product-list']}>
              {products.length === 0 ? (
                <div className={s['no-content']}>
                  <span>담은 상품이 존재하지 않습니다.</span>
                </div>
              ) : (
                products.map(p => {
                  const typedKey = keyOf('PRODUCT', p.id);
                  return (
                    <CartItem
                      key={typedKey}
                      imgUrl={p.thumbnailUrl}
                      title={p.titleSnapshot}
                      listPrice={p.listPrice}
                      salePrice={p.salePrice}
                      isSelected={selected.has(typedKey)}
                      onSelectChange={checked => handleSelectChange(typedKey, checked)}
                      onQtyChange={(nextQty) => handleQtyChange(typedKey, nextQty)}
                      onDeleteClick={() => handleDelete(typedKey)}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: summary & payment info */}
      <aside className={s['cart-summary']}>
        <div className={s['cart-summary-detail']}>
          <div className={s['cart-summary-detail-row']}>
            <span>상품 금액</span>
            <span>{formatWon(displaySummary.subtotalAmount)}</span>
          </div>
          <div className={s['cart-summary-detail-row']}>
            <span>상품 할인 금액</span>
            <span>-{formatWon(displaySummary.discountAmount)}</span>
          </div>
          <div className={s['cart-summary-detail-row']}>
            <span>대여비</span>
            <span>{formatWon(displaySummary.rentalAmount)}</span>
          </div>
          <div className={s['cart-summary-detail-row']}>
            <span>배송비</span>
            <span>{formatWon(displaySummary.shippingAmount)}</span>
          </div>
        </div>

        <div className={s['cart-summary-total']}>
          <div className={s['cart-total-amount']}>
            <span>결제 예정 금액</span>
            <span>{formatWon(displaySummary.totalAmount)}</span>
          </div>
          <div className={s['cart-points-earnable']}>
            <span>적립 예정 포인트</span>
            <span>{formatPoint(displaySummary.pointsEarnable)}</span>
          </div>
        </div>

        <div className={s['cart-summary-actions']}>
          <button className={s['cart-proceed-gift']}>
            <FiGift size={18} />
            <span>선물하기</span>
          </button>
          <button className={s['cart-proceed-order']}>
            주문하기 ({selected.size})
          </button>
        </div>
      </aside>

      {/* MOBILE: sticky bottom bar */}
      <div className={s['cart-proceed']}>
        <div className={s['cart-proceed-summary']}>
          <span>결제 예정 금액</span>
          <strong>{formatWon(displaySummary.totalAmount)}</strong>
        </div>
        <div className={s['cart-proceed-action']}>
          <button className={s['cart-proceed-gift']}>선물하기</button>
          <button className={s['cart-proceed-order']}>
            주문하기 ({selected.size})
          </button>
        </div>
      </div>
    </main>
  );
}
