import { useState } from "react";
import styles from "./TwoButtonBottomPopup.module.css";

type TwoButtonBottomPopupProps = {
  price: number; // product unit price
  onConfirm: (quantity: number, totalPrice: number) => void; // Pass the current quantity and total price
  onClose: () => void; // requests to close the popup
};

function TwoButtonBottomPopup({
  price,
  onConfirm,
  onClose,
}: TwoButtonBottomPopupProps) {
  const [quantity, setQuantity] = useState(1); // internal state for quantity
  const handleIncrease = () => setQuantity(quantity + 1); // increase quantity
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1); // decrease quantity (minimum 1)
  };
  const totalPrice = quantity * price; // calculate total price
  return (
    <div
      className={styles["popup-overlay"]}
      onClick={onClose}>
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
            className={styles["cancel-button"]}
            onClick={onClose}>
            취소
          </button>
          <button
            className={styles["confirm-button"]}
            onClick={() => {
              onConfirm(quantity, totalPrice);
              onClose();
            }}>
            진행
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoButtonBottomPopup;
