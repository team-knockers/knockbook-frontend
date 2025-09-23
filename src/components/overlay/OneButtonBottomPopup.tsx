import React from "react";
import styles from "./OneButtonBottomPopup.module.css";

type OneButtonBottomPopupProps = {
  quantity: number; // 현재 수량
  price: number; // 상품 단가
  onQuantityChange: (newQuantity: number) => void; // 수량 변경 핸들러
  onConfirm: () => void; // 진행 버튼 클릭 핸들러
  onClose?: () => void; // 배경 클릭 시 닫기 옵션
};

const OneButtonBottomPopup: React.FC<OneButtonBottomPopupProps> = ({ // React.FC 함수형 컴포넌트 타입 정의 도구
  quantity,
  price,
  onQuantityChange,
  onConfirm,
  onClose,
}) => {
    const totalPrice = quantity * price; // 가격과 수량 곱해서 총액 계산
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
                        className={styles["confirm-button"]}
                        onClick={onConfirm}>
                        진행
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OneButtonBottomPopup;
