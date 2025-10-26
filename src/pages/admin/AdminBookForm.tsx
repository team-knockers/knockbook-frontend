import {
  Create, Edit, SimpleForm,
  TextInput, NumberInput, DateInput, SelectInput,
  required, minValue, maxLength, regex,
} from 'react-admin';

// ===== validators =====
const vRequired = required();
const vIsbn13 = [required(), maxLength(13), regex(/^\d{13}$/, 'ISBN-13 must be 13 digits')];
const vNonNeg = minValue(0);

const statusChoices = [
  { id: 'VISIBLE', name: 'VISIBLE' },
  { id: 'HIDDEN',  name: 'HIDDEN'  },
];

const toBookPayload = (values: any) => {
  const copy = { ...values };
  if (copy.publishedAt instanceof Date) {
    copy.publishedAt = copy.publishedAt.toISOString().slice(0, 10);
  }

  [
    'sellableStockQty','rentableStockQty','pageCount','width','height','thickness','weight','totalVolumes',
    'rentalAmount','purchaseAmount','discountedPurchaseAmount'
  ].forEach(k => {
    if (copy[k] !== undefined && copy[k] !== null) copy[k] = Number(copy[k]);
  });
  return copy;
};

export function AdminBookCreate() {
  return (
    <Create transform={toBookPayload}>
      <SimpleForm>
        <TextInput source="title" label="제목" validate={vRequired} fullWidth />
        <TextInput source="author" label="저자" validate={vRequired} />
        <TextInput source="publisher" label="출판사" validate={vRequired} />
        <DateInput source="publishedAt" label="출간일" validate={vRequired} />

        <NumberInput source="sellableStockQty" label="판매 재고" validate={[vRequired, vNonNeg]} />
        <NumberInput source="rentableStockQty" label="대여 재고" validate={[vRequired, vNonNeg]} />

        <TextInput source="categoryId" label="카테고리 ID" validate={vRequired} />
        <TextInput source="subcategoryId" label="하위 카테고리 ID" validate={vRequired} />

        <TextInput source="introductionTitle" label="소개 제목" fullWidth />
        <TextInput source="introductionDetail" label="소개 내용" multiline fullWidth />
        <TextInput source="tableOfContents" label="목차" multiline fullWidth />
        <TextInput source="publisherReview" label="출판사 리뷰" multiline fullWidth />

        <TextInput source="isbn13" label="ISBN-13" validate={vIsbn13} />

        <NumberInput source="pageCount" label="쪽수" validate={vNonNeg} />
        <NumberInput source="width" label="가로(mm)" validate={vNonNeg} />
        <NumberInput source="height" label="세로(mm)" validate={vNonNeg} />
        <NumberInput source="thickness" label="두께(mm)" validate={vNonNeg} />
        <NumberInput source="weight" label="무게(g)" validate={vNonNeg} />
        <NumberInput source="totalVolumes" label="총 권수" validate={vNonNeg} />

        <NumberInput source="rentalAmount" label="대여가" validate={[vRequired, vNonNeg]} />
        <NumberInput source="purchaseAmount" label="구매가" validate={[vRequired, vNonNeg]} />
        <NumberInput source="discountedPurchaseAmount" label="할인가" validate={[vRequired, vNonNeg]} />

        <TextInput source="coverThumbnailUrl" label="표지 썸네일 URL" validate={vRequired} fullWidth />
        <TextInput source="coverImageUrl" label="표지 이미지 URL" validate={vRequired} fullWidth />

        <SelectInput source="status" label="상태" choices={statusChoices} />
      </SimpleForm>
    </Create>
  );
}

export function AdminBookEdit() {
  return (
    <Edit transform={toBookPayload}>
      <SimpleForm>
        <TextInput source="id" label="도서 ID" disabled />

        <TextInput source="title" label="제목" fullWidth />
        <TextInput source="author" label="저자" />
        <TextInput source="publisher" label="출판사" />
        <DateInput source="publishedAt" label="출간일" />

        <NumberInput source="sellableStockQty" label="판매 재고" validate={vNonNeg} />
        <NumberInput source="rentableStockQty" label="대여 재고" validate={vNonNeg} />

        <TextInput source="categoryId" label="카테고리 ID" />
        <TextInput source="subcategoryId" label="하위 카테고리 ID" />

        <TextInput source="introductionTitle" label="소개 제목" fullWidth />
        <TextInput source="introductionDetail" label="소개 내용" multiline fullWidth />
        <TextInput source="tableOfContents" label="목차" multiline fullWidth />
        <TextInput source="publisherReview" label="출판사 리뷰" multiline fullWidth />

        <TextInput source="isbn13" label="ISBN-13" />

        <NumberInput source="pageCount" label="쪽수" validate={vNonNeg} />
        <NumberInput source="width" label="가로(mm)" validate={vNonNeg} />
        <NumberInput source="height" label="세로(mm)" validate={vNonNeg} />
        <NumberInput source="thickness" label="두께(mm)" validate={vNonNeg} />
        <NumberInput source="weight" label="무게(g)" validate={vNonNeg} />
        <NumberInput source="totalVolumes" label="총 권수" validate={vNonNeg} />

        <NumberInput source="rentalAmount" label="대여가" validate={vNonNeg} />
        <NumberInput source="purchaseAmount" label="구매가" validate={vNonNeg} />
        <NumberInput source="discountedPurchaseAmount" label="할인가" validate={vNonNeg} />

        <TextInput source="coverThumbnailUrl" label="표지 썸네일 URL" fullWidth />
        <TextInput source="coverImageUrl" label="표지 이미지 URL" fullWidth />

        <SelectInput source="status" label="상태" choices={statusChoices} />
      </SimpleForm>
    </Edit>
  );
}
