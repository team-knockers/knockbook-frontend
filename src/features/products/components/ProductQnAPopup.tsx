import { useState } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./styles/ProductQnAPopup.module.css";
import OneWayButton from "../../../components/forms/OneWayButton";
import { useRevalidator } from "react-router-dom";

type ProductQnAPopupProps = {
  productImageUrl: string; // Product image URL
  productName: string; // Product name
  onSubmit: (title: string, questionBody: string) => void | Promise<void>; // Function executed on submit button click
  onClose: () => void; // Function executed on close button click
};

const titleMaxLength = 50;
const contentMaxlength = 300;

export default function ProductQnAPopup ({
  productImageUrl,
  productName,
  onSubmit,
  onClose,
}: ProductQnAPopupProps) {
  const [title, setTitle] = useState("");
  const [questionBody, setquestionBody] = useState("");
  const {revalidate} = useRevalidator();
  // Check whether both the title and content are filled in
  const isFormValid = title.trim() !== "" && questionBody.trim() !== "";

  const handleSubmit = () => {
    onSubmit(title, questionBody);
    revalidate();
    onClose();
  };

  return (
    <div 
      className={styles["post-popup"]}>
      <div className={styles["post-header"]}>
        <span className={styles["post-title"]}>상품 문의 작성</span>
        <button
          className={styles["close-button"]}
          onClick={onClose}>
          <IoClose className={styles["close-icon"]}/>
        </button>
      </div>

      <div className={styles["post-content"]}>
        <div className={styles["product-wrapper"]}>
          <div className={styles["product-item"]}>
            <img
              className={styles["product-image"]}
              src={productImageUrl} 
              alt={productName} />
            <span>{productName}</span>
          </div>
        </div>

        <div className={styles["form-wrapper"]}>
          <label className={styles["form-title"]}>
            <p>제목<span>*</span></p>
            <input
              type="text"
              placeholder="50자 이내로 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              maxLength={titleMaxLength}
            />
          </label>

          <label className={styles["form-description"]}>
            <p>내용<span>*</span></p>
            <div className={styles["form-description-text"]}>
              <textarea
                placeholder="내용을 입력해주세요."
                value={questionBody}
                onChange={(e) => setquestionBody(e.target.value.slice(0, 300))}
                maxLength={contentMaxlength}
              />
              <div className={styles["char-count"]}>
                <span className={styles["current-length"]}>{questionBody.length}</span>
                <span className={styles["max-length"]}> / 300자</span>
              </div>
            </div>
          </label>
          
        </div>
      </div>
      <div className={styles["submit-button"]}>
        <OneWayButton
          content='등록하기'
          onClick={handleSubmit}
          responsiveType='fixed'
          widthSizeType='lg'
          heightSizeType='xl'
          colorType='dark'
          disabled={!isFormValid}
        />
      </div>
    </div>
  );
}
