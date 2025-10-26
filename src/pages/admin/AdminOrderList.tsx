import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  Pagination,
  ArrayField,
  FunctionField,
  Button,
  useUpdate,
  useNotify,
  useRefresh,
} from 'react-admin';
import { Box, MenuItem, Select, Stack } from '@mui/material';
import { useState } from 'react';

const BottomLeftPagination = (props: any) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: '0.5rem 1rem' }}>
    <Pagination rowsPerPageOptions={[10, 20, 50]} {...props} />
  </Box>
);

const statusChoices = ['PENDING', 'PAID', 'CANCELLED', 'COMPLETED'];
const rentalStatusChoices = [ 'PREPARING', 'SHIPPING', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNING', 'RETURNED', 'CANCELLED' ];

const OrderStatusControl = ({ record }: { record: any }) => {
  const [status, setStatus] = useState<string>(record?.status ?? '');
  const [rentalStatus, setRentalStatus] = useState<string>(record?.rentalStatus ?? '');
  const [update, { isLoading }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const save = () => {
    update(
      'orders',
      {
        id: record.id,
        previousData: record,
        data: { status, rentalStatus, userId: record.userId },
      },
      {
        onSuccess: () => {
          notify('상태가 저장되었습니다.', { type: 'info' });
          refresh();
        },
        onError: (e: any) => {
          notify(e?.message ?? '저장 실패', { type: 'warning' });
        },
      }
    );
  };

  const hasRentalStatus = !!record?.rentalStatus;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Select
        size="small"
        value={status}
        onChange={(e) => setStatus(String(e.target.value))}
        sx={{ minWidth: 130 }}
      >
        {statusChoices.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>
      <Select
        size="small"
        value={rentalStatus}
        onChange={(e) => setRentalStatus(String(e.target.value))}
        sx={{ minWidth: 150 }}
        disabled={!hasRentalStatus}
      >
        {rentalStatusChoices.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>
      <Button variant="contained" size="small" onClick={save} disabled={isLoading}>
        저장
      </Button>
    </Stack>
  );
};



const OrderItemsPanel = () => (
  <Box sx={{ p: 2 }}>
    <ArrayField source="items">
      <Datagrid
        bulkActionButtons={false}
        sx={{
          '& th.MuiTableCell-root, & td.MuiTableCell-root': { fontSize: 12, whiteSpace: 'nowrap' },
          '& th.column-thumbnailUrl, & td.column-thumbnailUrl': { minWidth: 64 },
          '& th.column-titleSnapshot, & td.column-titleSnapshot': { minWidth: 220, maxWidth: 360 },
          '& th.column-quantity, & td.column-quantity': { width: 80, textAlign: 'right' },
          '& th.column-listPriceSnapshot, & td.column-listPriceSnapshot': { width: 120, textAlign: 'right' },
          '& th.column-salePriceSnapshot, & td.column-salePriceSnapshot': { width: 120, textAlign: 'right' },
          '& th.column-rentalDays, & td.column-rentalDays': { width: 100, textAlign: 'right' },
          '& th.column-rentalPriceSnapshot, & td.column-rentalPriceSnapshot': { width: 120, textAlign: 'right' },
          '& th.column-lineSubtotalAmount, & td.column-lineSubtotalAmount': { width: 140, textAlign: 'right' },
          '& th.column-lineDiscountAmount, & td.column-lineDiscountAmount': { width: 140, textAlign: 'right' },
          '& th.column-lineTotalAmount, & td.column-lineTotalAmount': { width: 140, textAlign: 'right' },
        }}
      >
        <FunctionField
          source="thumbnailUrl"
          label="썸네일"
          render={(r: any) =>
            r.thumbnailUrl ? (
              <img src={r.thumbnailUrl} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
            ) : (
              ''
            )
          }
        />
        <TextField source="titleSnapshot" label="상품명(스냅샷)" />
        <NumberField source="quantity" label="수량" />

        <NumberField
          source="listPriceSnapshot"
          label="정가"
          options={{ style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }}
        />
        <NumberField
          source="salePriceSnapshot"
          label="판매가"
          options={{ style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }}
        />

        <NumberField source="rentalDays" label="대여일" />
        <NumberField
          source="rentalPriceSnapshot"
          label="대여가"
          options={{ style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }}
        />

        <NumberField
          source="lineSubtotalAmount"
          label="라인 소계"
          options={{ style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }}
        />
        <NumberField
          source="lineDiscountAmount"
          label="라인 할인"
          options={{ style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }}
        />
        <NumberField
          source="lineTotalAmount"
          label="라인 합계"
          options={{ style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }}
        />
      </Datagrid>
    </ArrayField>
  </Box>
);

export const AdminOrderList = () => (
  <List 
    pagination={<BottomLeftPagination />}
    perPage={10}>
    <Datagrid
      rowClick="expand"
      expand={<OrderItemsPanel />}
      sx={{
        '& th.MuiTableCell-root, & td.MuiTableCell-root': { fontSize: 12, whiteSpace: 'nowrap' },

        '& th.column-orderNo, & td.column-orderNo': { minWidth: 160 },
        '& th.column-userId, & td.column-userId': { minWidth: 40 },
        '& th.column-status, & td.column-status': { minWidth: 120 },
        '& th.column-paymentStatus, & td.column-paymentStatus': { minWidth: 80 },
        '& th.column-rentalStatus, & td.column-rentalStatus': { minWidth: 80 },

        '& th.column-itemCount, & td.column-itemCount': { minWidth: 70, textAlign: 'right' },
        '& th.column-subtotalAmount, & td.column-subtotalAmount': { minWidth: 100, textAlign: 'right' },
        '& th.column-discountAmount, & td.column-discountAmount': { minWidth: 100, textAlign: 'right' },
        '& th.column-couponDiscountAmount, & td.column-couponDiscountAmount': { minWidth: 80, textAlign: 'right' },
        '& th.column-shippingAmount, & td.column-shippingAmount': { minWidth: 50, textAlign: 'right' },
        '& th.column-rentalAmount, & td.column-rentalAmount': { minWidth: 80, textAlign: 'right' },
        '& th.column-totalAmount, & td.column-totalAmount': { minWidth: 90, textAlign: 'right', fontWeight: 600 },

        '& th.column-placedAt, & td.column-placedAt': { minWidth: 100 },
        '& th.column-paidAt, & td.column-paidAt': { minWidth: 100 },
        '& th.column-cancelledAt, & td.column-cancelledAt': { minWidth: 50 },
        '& th.column-completedAt, & td.column-completedAt': { minWidth: 100 },
      }}
    >
      <TextField source="orderNo" label="주문번호" />
      <TextField source="userId" label="사용자" />
      <TextField source="status" label="주문상태" />
      <TextField source="paymentStatus" label="결제상태" />
      <TextField source="rentalStatus" label="대여상태" />
      <NumberField source="itemCount" label="아이템수" />
      <NumberField
        source="subtotalAmount"
        label="상품소계"
        options={{ 
          style: 'currency',
          currency: 'KRW',
          maximumFractionDigits: 0 
        }}
      />
      <NumberField
        source="discountAmount"
        label="할인금액"
        options={{ 
          style: 'currency',
          currency: 'KRW',
          maximumFractionDigits: 0 
        }}
      />
      <NumberField
        source="couponDiscountAmount"
        label="쿠폰할인"
        options={{ 
          style: 'currency',
          currency: 'KRW',
          maximumFractionDigits: 0 
        }}
      />
      <NumberField
        source="shippingAmount"
        label="배송비"
        options={{ 
          style: 'currency',
          currency: 'KRW',
          maximumFractionDigits: 0 
        }}
      />
      <NumberField
        source="rentalAmount"
        label="대여금액"
        options={{ 
          style: 'currency',
          currency: 'KRW',
          maximumFractionDigits: 0 
        }}
      />
      <NumberField
        source="totalAmount"
        label="총결제금액"
        options={{ 
          style: 'currency',
          currency: 'KRW',
          maximumFractionDigits: 0 
        }}
      />

      <DateField 
        source="placedAt"
        label="주문일"
        showTime={false} />
      <DateField 
        source="paidAt"
        label="결제일"
        showTime={false}
        emptyText="-" />
      <DateField 
        source="cancelledAt"
        label="취소일"
        showTime={false}
        emptyText="-" />
      <DateField 
        source="completedAt"
        label="완료일"
        showTime={false}
        emptyText="-" />

      <FunctionField 
        label="상태 변경" 
        render={(record: any) => <OrderStatusControl record={record} />} />
    </Datagrid>
  </List>
);
