import {
  Create, Edit, SimpleForm,
  TextInput, NumberInput, DateTimeInput, SelectInput,
  required, minValue,
} from 'react-admin';

const vRequired = required();
const vNonNeg = minValue(0);

const statusChoices = [
  { id: 'ACTIVE',        name: 'ACTIVE' },
  { id: 'HIDDEN',        name: 'HIDDEN' },
  { id: 'DISCONTINUED',  name: 'DISCONTINUED' },
];

const toProductPayload = (values: any) => {
  const copy = { ...values };
  if (copy.releasedAt instanceof Date) {
    copy.releasedAt = copy.releasedAt.toISOString(); // e.g. "2025-10-26T12:34:56.000Z"
  }
  ['unitPriceAmount','salePriceAmount','stockQty'].forEach(k => {
    if (copy[k] !== undefined && copy[k] !== null) copy[k] = Number(copy[k]);
  });
  return copy;
};

export function AdminProductCreate() {
  return (
    <Create transform={toProductPayload}>
      <SimpleForm>
        <TextInput source="categoryCode" label="카테고리 코드" validate={vRequired} />
        <TextInput source="sku" label="SKU" validate={vRequired} />
        <TextInput source="name" label="상품명" validate={vRequired} fullWidth />

        <NumberInput source="stockQty" label="재고 수량" validate={[vRequired, vNonNeg]} />
        <NumberInput source="unitPriceAmount" label="정가" validate={[vRequired, vNonNeg]} />
        <NumberInput source="salePriceAmount" label="할인가" validate={vNonNeg} />

        <TextInput source="manufacturerName" label="제조사" validate={vRequired} />
        <SelectInput
          source="isImported"
          label="수입 여부"
          choices={[{ id: 'Y', name: 'Y' }, { id: 'N', name: 'N' }]}
          validate={vRequired}
        />
        <TextInput source="importCountry" label="수입국" validate={vRequired} />

        <DateTimeInput source="releasedAt" label="출시일(UTC)" />

        <SelectInput source="status" label="상태" choices={statusChoices} validate={vRequired} />
  
        <TextInput source="availability" label="가용 상태(enum 문자열)" validate={vRequired} />

        <TextInput source="galleryImageUrls" label="갤러리 이미지 URL들(쉼표로 구분)" parse={(v) => v?.split(',').map((s: string) => s.trim())} format={(a) => Array.isArray(a) ? a.join(', ') : a} fullWidth validate={vRequired} />
        <TextInput source="descriptionImageUrls" label="상세 이미지 URL들(쉼표로 구분)" parse={(v) => v?.split(',').map((s: string) => s.trim())} format={(a) => Array.isArray(a) ? a.join(', ') : a} fullWidth validate={vRequired} />
      </SimpleForm>
    </Create>
  );
}

export function AdminProductEdit() {
  return (
    <Edit transform={toProductPayload}>
      <SimpleForm>
        <TextInput source="productId" label="상품 ID" disabled />
        <TextInput source="categoryCode" label="카테고리 코드" />
        <TextInput source="sku" label="SKU" />
        <TextInput source="name" label="상품명" fullWidth />

        <NumberInput source="stockQty" label="재고 수량" validate={vNonNeg} />
        <NumberInput source="unitPriceAmount" label="정가" validate={vNonNeg} />
        <NumberInput source="salePriceAmount" label="할인가" validate={vNonNeg} />

        <TextInput source="manufacturerName" label="제조사" />
        <SelectInput
          source="isImported"
          label="수입 여부"
          choices={[{ id: 'Y', name: 'Y' }, { id: 'N', name: 'N' }]}
        />
        <TextInput source="importCountry" label="수입국" />

        <DateTimeInput source="releasedAt" label="출시일(UTC)" />

        <SelectInput source="status" label="상태" choices={statusChoices} />
        <TextInput source="availability" label="가용 상태(enum 문자열)" />

        <TextInput source="galleryImageUrls" label="갤러리 이미지 URL들(쉼표로 구분)"
          parse={(v) => v?.split(',').map((s: string) => s.trim())}
          format={(a) => Array.isArray(a) ? a.join(', ') : a}
          fullWidth
        />
        <TextInput source="descriptionImageUrls" label="상세 이미지 URL들(쉼표로 구분)"
          parse={(v) => v?.split(',').map((s: string) => s.trim())}
          format={(a) => Array.isArray(a) ? a.join(', ') : a}
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
}
