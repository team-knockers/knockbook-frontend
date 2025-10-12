import { useFetcher, useLoaderData } from 'react-router-dom';
import OneWayButton from '../../components/forms/OneWayButton';
import s from './UserAddressPage.module.css';
import type { Address } from '../../features/account/types';
import { Input, Label } from 'reactstrap';
import { useState } from 'react';
import SimplePopup from '../../components/overlay/SimplePopup';
import AddAddressPage from './AddAddressPage';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import DuoConfirmPopup from '../../components/overlay/DuoConfirmPopup';
import EditAddressPage from './EditAddressPage';

export default function UserAddressPage() {

  const isMobile = useMediaQuery('(max-width: 1023.98px)');
  const fetcher = useFetcher();

  const addresses = useLoaderData() as Address[];
  const initialDefaultAddressId = addresses.find(a => a.isDefault)?.id;
  const [defaultAddressId, setDefaultAddressId] = useState(initialDefaultAddressId);
  const [canProceed, setCanProceed] = useState(false);
  const [isAddAddressPopupOpen, setIsAddAddressPopupOpen] = useState(false);
  const [isEditAddressPopupOpen, setIsEditAddressPopupOpen] = useState(false);
  const [addressIdToEdit, setAddressIdToEdit] = useState("");
  const [isDeleteAddressPopupOpen, setIsDeleteAddressPopupOpen] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState("");

  const ChangeDefaultAddress = () => {
    const fd = new FormData();
    fd.append('intent', 'change-default');
    fd.append('addressId', String(defaultAddressId));
    fetcher.submit(fd, { method: 'post' });
  };

  const handleDeleteAddress = (addressId: string) => {
    /* console.log(addressId); */
    const fd = new FormData();
    fd.append('intent', 'delete');
    fd.append('addressId', String(addressId));
    fetcher.submit(fd, { method: 'post' });
    setIsDeleteAddressPopupOpen(false);
  };

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
        <div className={s['add-address-button']}>
          <SimplePopup
            open={isAddAddressPopupOpen}
            onClose={() => setIsAddAddressPopupOpen(false)}
            title="배송지 추가"
            fullScreen={isMobile}
            noBodyPadding
            showCloseButton={true}
          >
            <AddAddressPage
              onProceedClick={() => setIsAddAddressPopupOpen(false)} />                                    
          </SimplePopup>
          <SimplePopup
            open={isEditAddressPopupOpen}
            onClose={() => setIsEditAddressPopupOpen(false)}
            title="배송지 수정"
            fullScreen={isMobile}
            noBodyPadding
            showCloseButton={true}
          >
            <EditAddressPage
              addressId={addressIdToEdit}
              onProceedClick={() => setIsEditAddressPopupOpen(false)} />                            
          </SimplePopup>
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
            onClick={() => setIsAddAddressPopupOpen(true)}
          />
        </div>
        { addresses.length === 0 ? (
          <div className={s['no-content']}>
            <span>등록된 배송지가 존재하지 않습니다.</span>
          </div>
        ) : (
          addresses.map(address => (
            <div className={s['address-card']}>
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
                      setAddressIdToEdit(address.id);
                      setIsEditAddressPopupOpen(true);
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
