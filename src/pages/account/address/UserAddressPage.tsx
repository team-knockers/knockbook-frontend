import { useFetcher } from 'react-router-dom';
import OneWayButton from '../../../components/forms/OneWayButton';
import s from './UserAddressPage.module.css';
import type { Address } from '../../../features/account/types';
import { Input, Label } from 'reactstrap';
import { useEffect, useState } from 'react';
import SimplePopup from '../../../components/overlay/SimplePopup';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import DuoConfirmPopup from '../../../components/overlay/DuoConfirmPopup';
import { PATHS } from '../../../routes/paths';
import AddressForm from '../../../features/account/components/AddressForm';

export default function UserAddressPage() {

  const isMobile = useMediaQuery('(max-width: 1023.98px)');
  const fetcher = useFetcher<Address[]>();

  useEffect(() => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(PATHS.userAddress);
    }
  }, [fetcher.state, fetcher.data]);

  const addresses = fetcher.data ?? [];

  const initialDefaultAddressId = addresses.find(a => a.isDefault)?.id;
  const [defaultAddressId, setDefaultAddressId] = useState(initialDefaultAddressId);
  const [canProceed, setCanProceed] = useState(false);

  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
  const [addressFormMode, setAddressFormMode] = useState<"insert" | "update">("insert");
  const [addressToEdit, setAddressToEdit] = useState<Address | undefined>(undefined);

  const [isDeleteAddressPopupOpen, setIsDeleteAddressPopupOpen] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState("");

  const ChangeDefaultAddress = () => {
    const fd = new FormData();
    fd.append('intent', 'change-default');
    fd.append('addressId', String(defaultAddressId));
    fetcher.submit(fd, { method: 'post', action: PATHS.userAddress });
  };

  const handleDeleteAddress = (addressId: string) => {
    /* console.log(addressId); */
    const fd = new FormData();
    fd.append('intent', 'delete');
    fd.append('addressId', String(addressId));
    fetcher.submit(fd, { method: 'post', action: PATHS.userAddress });
    setIsDeleteAddressPopupOpen(false);
  };

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
        <div className={s['add-address-button']}>

          {/* upsert popup */}
          <SimplePopup
            open={isAddressPopupOpen}
            onClose={() => setIsAddressPopupOpen(false)}
            title={addressFormMode === 'insert' ? '배송지 추가' : '배송지 수정'}
            fullScreen={isMobile}
            noBodyPadding
            showCloseButton={true}>
            {addressFormMode === 'insert' ? (
              <AddressForm
                key="insert"
                mode="insert"
                actionPath={PATHS.userAddress}
                onProceedClick={() => setIsAddressPopupOpen(false)}
              />
            ) : (
              addressToEdit && (
                <AddressForm
                  key={addressToEdit.id}
                  mode="update"
                  addressId={addressToEdit.id}
                  initial={{
                    label: addressToEdit.label,
                    recipientName: addressToEdit.recipientName,
                    phone: addressToEdit.phone,
                    postalCode: addressToEdit.postalCode,
                    address1: addressToEdit.address1,
                    address2: addressToEdit.address2,
                    isDefault: addressToEdit.isDefault,
                  }}
                  actionPath={PATHS.userAddress}
                  onProceedClick={() => setIsAddressPopupOpen(false)}
                />
              )
            )}                             
          </SimplePopup>

          {/* delete popup */}
          <DuoConfirmPopup
            open={isDeleteAddressPopupOpen}
            title="선택한 배송지를 삭제하시겠습니까?"
            cancelText='취소'
            confirmText='삭제'
            onCancel={() => setIsDeleteAddressPopupOpen(false)}
            onConfirm={() => handleDeleteAddress(addressIdToDelete)}
          />
          <OneWayButton
            content='+ 배송지 추가 설정'
            responsiveType='fluid'
            widthSizeType='sm'
            heightSizeType='xs'
            colorType='natural'
            onClick={() => {
              setAddressFormMode("insert");
              setAddressToEdit(undefined);
              setIsAddressPopupOpen(true);
            }}/>
        </div>
        { addresses.length === 0 ? (
          <div className={s['no-content']}>
            <span>등록된 배송지가 존재하지 않습니다.</span>
          </div>
        ) : (
          addresses.map(address => (
            <div 
              className={s['address-card']}
              key={address.id}>
              <div className={s['address-card-header']}>
                <div className={s['address-card-header-check']}>
                  <Input
                    className='mt-0'
                    type="radio"
                    value={address.id}
                    checked={defaultAddressId === address.id}
                    onChange={e => setDefaultAddressId(e.target.value)}
                  />
                  <div className={s['address-card-header-title']}>
                    <span>{address.isDefault ? "[기본 배송지]" : ""} {address.label}</span>
                  </div>
                </div>
                <div className={s['address-card-edit-button']}>
                  <OneWayButton
                    content='수정'
                    responsiveType='fixed'
                    widthSizeType='xxs'
                    heightSizeType='xxxs'
                    colorType='dark'
                    fontSize='12px'
                    onClick={() => {
                      setAddressFormMode("update");
                      setAddressToEdit(address);
                      setIsAddressPopupOpen(true);
                    }}/>
                  <OneWayButton
                    content='삭제'
                    responsiveType='fixed'
                    widthSizeType='xxs'
                    heightSizeType='xxxs'
                    colorType='light'
                    fontSize='12px'
                    onClick={() => {
                      setAddressIdToDelete(address.id);
                      setIsDeleteAddressPopupOpen(true);
                    }}/>
                </div>
              </div>
              <div className={s['address-card-content']}>
                <div className={s['address-card-profile']}>
                  <span>{address.recipientName} {address.phone}</span>
                </div>
                <div className={s['address-card-detail']}>
                  <span>[{address.postalCode}] {address.address1} {address.address2}</span>
                </div>
              </div>
            </div>
          ))
        )}
        <div className={s['set-default']}>
          <Input
            id="set-default"
            className='mt-0'
            type="checkbox"
            onChange={e => setCanProceed(e.target.checked)}/>
          <Label 
            for="set-default"
            className='mb-0'>
            기본 배송지로 설정
          </Label>
        </div>
        <OneWayButton
            content='선택'
            responsiveType='fluid'
            widthSizeType='xl'
            heightSizeType='xl'
            colorType='dark'
            fontSize='15px'
            disabled={!canProceed}
            onClick={ChangeDefaultAddress}/>
      </div>
    </main>
  );
}
