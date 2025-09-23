import React from "react";
import styles from "./TwoButtonBottomPopup.module.css";

type TwoButtonBottomPopupProps = {
  quantity: number; // Current Quantity
  price: number; // Unit Price
  onQuantityChange: (newQuantity: number) => void; // Quantity Change Handler
  onConfirm: () => void; // Confirm Button Click Handler
  onClose?: () => void; // Optional Close on Background Click
};

const TwoButtonBottomPopup: React.FC<TwoButtonBottomPopupProps> = ({ // React.FC Functional Component Type Definition Utility
  quantity,
  price,
  onQuantityChange,
  onConfirm,
  onClose,
}) => {
    const totalPrice = quantity * price; // Calculate Total Price by Multiplying Quantity and Unit Price
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
                                onClick={() => onQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}>
                                -
                            </button>
                            <span className={styles["count"]}>
                                {quantity}
                            </span>
                            <button
                                className={styles["counter-button"]}
                                onClick={() => onQuantityChange(quantity + 1)}>
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
                        onClick={() => onClose && onClose()}>
                        취소
                    </button>
                    <button 
                        className={styles["confirm-button"]}
                        onClick={onConfirm}>
                        진행
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwoButtonBottomPopup;
