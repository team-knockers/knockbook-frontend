import { List, Datagrid, TextField, NumberField, Pagination, CreateButton, EditButton } from 'react-admin';
import { Box } from '@mui/material';

const BottomLeftPagination = (props: any) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      padding: '0.5rem 1rem',
    }}
  >
    <Pagination rowsPerPageOptions={[10, 20, 50]} {...props} />
  </Box>
);

export const AdminProductList = () => (
  <List 
    pagination={<BottomLeftPagination />}
    perPage={10}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, py: 1 }}>
      <CreateButton sx={{ fontSize: 13 }} />
    </Box>

    <Datagrid
      rowClick="edit"
      sx={{
        '& th.MuiTableCell-root, & td.MuiTableCell-root': { fontSize: 12, whiteSpace: 'nowrap' },
        '& th.column-productId, & td.column-productId': { minWidth: 60 },
        '& th.column-categoryId, & td.column-categoryId': { minWidth: 50 },
        '& th.column-sku, & td.column-sku': { minWidth: 90 },
        '& th.column-name, & td.column-name': { minWidth: 150 },
        '& th.column-stockQty, & td.column-stockQty': { minWidth: 70, textAlign: 'right' },
        '& th.column-unitPriceAmount, & td.column-unitPriceAmount': { minWidth: 70, textAlign: 'right' },
        '& th.column-salePriceAmount, & td.column-salePriceAmount': { minWidth: 70, textAlign: 'right' },
        '& th.column-manufacturerName, & td.column-manufacturerName': { minWidth: 80 },
        '& th.column-isImported, & td.column-isImported': { minWidth: 60 },
        '& th.column-importCountry, & td.column-importCountry': { minWidth: 80 },
        '& th.column-createdAt, & td.column-createdAt': { minWidth: 160 },
        '& th.column-updatedAt, & td.column-updatedAt': { minWidth: 160 },
        '& th.column-status, & td.column-status': { minWidth: 50 },
        '& th.column-availability, & td.column-availability': { minWidth: 50 },
        '& th.column-averageRating, & td.column-averageRating': { minWidth: 40, textAlign: 'right' },
        '& th.column-reviewCount, & td.column-reviewCount': { minWidth: 40, textAlign: 'right' },
      }}
    >
      <EditButton />
      <TextField source="productId" label="상품 ID" />
      <TextField source="categoryId" label="카테고리 ID" />
      <TextField source="sku" label="SKU" />
      <TextField source="name" label="상품명" />
      <NumberField source="stockQty" label="재고 수량" />
      <NumberField source="unitPriceAmount" label="정가" />
      <NumberField source="salePriceAmount" label="할인가" />
      <TextField source="manufacturerName" label="제조사" />
      <TextField source="isImported" label="수입 여부" />
      <TextField source="importCountry" label="수입국" />
      <TextField source="createdAt" label="생성일" />
      <TextField source="updatedAt" label="수정일" />
      <TextField source="status" label="상태" />
      <TextField source="availability" label="판매 가능 여부" />
      <NumberField source="averageRating" label="평균 평점" />
      <NumberField source="reviewCount" label="리뷰 수" />
    </Datagrid>
  </List>
);
