import { useState } from "react";
import styles from "./OneButtonBottomPopup.module.css";

type OneButtonBottomPopupProps = {
  price: number; // product unit price
  onConfirm: (quantity: number) => void; // Pass the current quantity
  confirmText: string;
};

export default function OneButtonBottomPopup ({
  price,
  onConfirm,
  confirmText,
}: OneButtonBottomPopupProps) {
  const [quantity, setQuantity] = useState(1); // internal state for quantity
  const handleIncrease = () => setQuantity(quantity + 1); // increase quantity
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // decrease quantity (minimum 1)
    } 
  };
  const totalPrice = quantity * price; // calculate total price
  return (
    <div
      className={styles["popup-container"]}
      onClick={(e) => e.stopPropagation()}>
      <div className={styles["quantity-wrapper"]}>
        <div className={styles["quantity-box"]}>
          <span className={styles["quantity-text"]}>주문수량</span>
          <div className={styles["counter-label"]}>
            <button
              className={styles["counter-button"]}
              onClick={handleDecrease}
              disabled={quantity <= 1}>
              -
            </button>
            <span className={styles["count"]}>
              {quantity}
            </span>
            <button
              className={styles["counter-button"]}
              onClick={handleIncrease}>
              +
            </button>
          </div>
        </div>
        <div className={styles["price-box"]}>
          <span className={styles["price-text"]}>
            총 {quantity}권 상품 금액
          </span>
          <span className={styles["price-value"]}>
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>
      <div className={styles["button-box"]}>
        <button
          className={styles["confirm-button"]}
          onClick= {() => onConfirm(quantity)}>
          {confirmText}
        </button>
      </div>
    </div>
  );
};
