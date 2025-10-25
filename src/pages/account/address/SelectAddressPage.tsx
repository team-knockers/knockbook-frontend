import { useFetcher } from 'react-router-dom';
import OneWayButton from '../../../components/forms/OneWayButton';
import s from './SelectAddressPage.module.css';
import type { Address } from '../../../features/account/types';
import { Input } from 'reactstrap';
import { useEffect, useMemo, useState } from 'react';
import { PATHS } from '../../../routes/paths';

type Props = {
  onSelect?: (addressId: string) => void;
};

export default function SelectAddressPage({ onSelect }: Props) {
  const fetcher = useFetcher<Address[]>();

  useEffect(() => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(PATHS.userAddress);
    }
  }, [fetcher.state, fetcher.data]);

  const addresses = fetcher.data ?? [];

  const initialId = useMemo(() => {
    return addresses.find(a => a.isDefault)?.id ?? addresses[0]?.id;
  }, [addresses]);

  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);

  useEffect(() => {
    if (!selectedId && initialId) setSelectedId(initialId);
  }, [initialId, selectedId]);

  const handleConfirm = () => {
    if (!selectedId) { return; }
    const picked = addresses.find(a => a.id === selectedId);
    if (picked) {
      onSelect?.(picked.id);
    }
  };

  return (
    <main className={s['page-layout']}>
      <div className={s['max-width-container']}>
        {addresses.length === 0 ? (
          <div className={s['no-content']}>
            <span>등록된 배송지가 존재하지 않습니다.</span>
          </div>
        ) : (
          addresses.map(address => (
            <div className={s['address-card']} key={address.id}>
              <div className={s['address-card-header']}>
                <div className={s['address-card-header-check']}>
                  <Input
                    className="mt-0"
                    type="radio"
                    name="selectAddress"
                    value={address.id}
                    checked={selectedId === address.id}
                    onChange={e => setSelectedId(e.target.value)}
                  />
                  <div className={s['address-card-header-title']}>
                    <span>
                      {address.label}
                    </span>
                  </div>
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

        <OneWayButton
          content="선택"
          responsiveType="fluid"
          widthSizeType="xl"
          heightSizeType="xl"
          colorType="dark"
          fontSize="15px"
          disabled={!selectedId}
          onClick={handleConfirm}
        />
      </div>
    </main>
  );
}
