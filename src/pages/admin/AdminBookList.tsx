import { Box } from '@mui/material';
import { List, Datagrid, TextField, NumberField,
   FunctionField, Pagination, CreateButton, EditButton } from 'react-admin';

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

const ScrollCell = ({ value }: { value?: string }) => (
  <div
    style={{
      maxHeight: 50,
      minWidth: 250,
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
    }}
  >
    {value ?? ''}
  </div>
);

export const AdminBookList = () => (
  <List
    pagination={<BottomLeftPagination />}
    perPage={10}
    sx={{ overflowX: 'auto' }}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, py: 1 }}>
      <CreateButton sx={{ fontSize: 13 }} />
    </Box>
    <Datagrid
      rowClick="edit"
      sx={{
        '& th.MuiTableCell-root, & td.MuiTableCell-root': { fontSize: 11 },
        '& .column-id': { minWidth: 70 },
        '& .column-title': { minWidth: 210 },
        '& .column-author': { minWidth: 100 },
        '& .column-publisher': { minWidth: 100 },
        '& .column-publishedAt': { minWidth: 100 },
        '& .column-categoryId, & .column-subcategoryId': { minWidth: 80 },
        '& .column-isbn13': { width: 160 },
        '& .column-pageCountText, & .column-dimensionsText, & .column-weightText, & .column-totalVolumesText':
          { minWidth: 65 },
        '& .column-rentalAmount, & .column-purchaseAmount, & .column-discountedPurchaseAmount, & .column-viewCount, & .column-salesCount, & .column-rentalCount, & .column-averageRating, & .column-ratingCount, & .column-rentalPoint, & .column-purchasePoint':
          { minWidth: 85 },
      }}
    >
      <EditButton />
      <TextField source="id" label="도서 ID" />
      <TextField source="title" label="제목" />
      <TextField source="author" label="저자" />
      <TextField source="publisher" label="출판사" />
      <TextField source="publishedAt" label="출간일" />
      <TextField source="categoryId" label="카테고리 ID" />
      <TextField source="subcategoryId" label="하위 카테고리 ID" />
      <FunctionField label="소개 제목" render={(r) => <ScrollCell value={r.introductionTitle} />} />
      <FunctionField label="소개 내용" render={(r) => <ScrollCell value={r.introductionDetail} />} />
      <FunctionField label="목차" render={(r) => <ScrollCell value={r.tableOfContents} />} />
      <FunctionField label="출판사 리뷰" render={(r) => <ScrollCell value={r.publisherReview} />} />
      <TextField source="isbn13" label="ISBN13" />
      <TextField source="pageCountText" label="쪽수" />
      <TextField source="dimensionsText" label="크기" />
      <TextField source="weightText" label="무게" />
      <TextField source="totalVolumesText" label="총 권수" />
      <NumberField source="rentalAmount" label="대여가" />
      <NumberField source="purchaseAmount" label="구매가" />
      <NumberField source="discountedPurchaseAmount" label="할인가" />
      <FunctionField label="표지 이미지 URL" render={(r) => <ScrollCell value={r.coverImageUrl} />} />
      <TextField source="rentalAvailability" label="대여 가능 여부" />
      <TextField source="purchaseAvailability" label="구매 가능 여부" />
      <NumberField source="viewCount" label="조회수" />
      <NumberField source="salesCount" label="판매량" />
      <NumberField source="rentalCount" label="대여 횟수" />
      <NumberField source="averageRating" label="평균 평점" />
      <NumberField source="ratingCount" label="평점 수" />
      <NumberField source="rentalPoint" label="대여 포인트" />
      <NumberField source="purchasePoint" label="구매 포인트" />
    </Datagrid>
  </List>
);
