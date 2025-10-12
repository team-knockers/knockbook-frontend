import { Input, Label } from 'reactstrap';
import s from './AddAddressPage.module.css';
import { useMemo, useState } from 'react';
import OneWayButton from '../../components/forms/OneWayButton';
import { useKakaoPostcode } from '../../features/account/hooks/useKakaoPostcode';
import { useFetcher } from 'react-router-dom';

type AddAddressPageProps = {
  onProceedClick: () => void
};

export default function AddAddressPage({ 
  onProceedClick 
} : AddAddressPageProps) {

  const fetcher = useFetcher();

  const [label, setLabel] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const isNonEmpty = (v: string) => v.trim().length > 0;
  const phoneDigits = (v: string) => v.replace(/\D/g, "");
  const isValidPhone = (v: string) => {
    const d = phoneDigits(v);
    return d.length >= 10 && d.length <= 11; // KR mobile common length
  };

  const canProceed = useMemo(() => {
    return (
      isNonEmpty(label) &&
      isNonEmpty(recipientName) &&
      isValidPhone(phone) &&
      isNonEmpty(postalCode) &&
      isNonEmpty(address1) &&
      isNonEmpty(address2)
    );
  }, [label, recipientName, phone, postalCode, address1, address2]);

  const handleProceed = () => {
    if (!canProceed) { return; }
    const fd = new FormData();
    fd.append('intent', 'insert');
    fd.append('label', label);
    fd.append('phone', phone);
    fd.append('recipientName', recipientName);
    fd.append('postalCode', postalCode);
    fd.append('address1', address1);
    fd.append('address2', address2);
    fd.append('isDefault', String(isDefault));
    fetcher.submit(fd, { method: 'post' });
    onProceedClick();
  };

  const openPostcode = useKakaoPostcode();
  const callKakaoPostalAPI = () => {
    openPostcode((data) => {
      const addr = data.address || data.roadAddress || data.jibunAddress || "";
      const extra = (data.addressType === "R" && (data.bname || data.buildingName))
        ? ` (${[data.bname, data.buildingName].filter(Boolean).join(", ")})` : "";
      setPostalCode(data.zonecode);
      setAddress1(addr + extra);
      // setAddress2("") // option: clear detail
    });
  };

  return(
    <main className={s['page-layout']}>
      <div className={s['shipping-label']}>
        <Label 
          className={`mb-0 ${s['shipping-title']}`}>
          배송지 명
        </Label>
        <Input
          className={s['shipping-input']}
          type="text"
          value={label}
          placeholder="최대 7글자까지"
          onChange={e => setLabel(e.target.value)} />
      </div>
      <div className={s['shipping-recipient']}>
        <Label 
          className={`mb-0 ${s['shipping-title']}`}>
          받는 분
        </Label>
        <Input
          className={s['shipping-input']}
          type="text"
          value={recipientName}
          placeholder="이름을 입력하세요"
          onChange={e => setRecipientName(e.target.value)} />
        <Input
          className={s['shipping-input']}
          type="text"
          value={phone}
          placeholder="휴대폰 번호를 - 없이 입력하세요"
          onChange={e => setPhone(e.target.value)} />
      </div>
      <div className={s['shipping-address']}>
        <Label 
          className={`mb-0 ${s['shipping-title']}`}>
          주소
        </Label>
        <div className={s['shipping-postal-code']}>
          <Input
            className={s['shipping-input']}
            type="text"
            value={postalCode}
            placeholder="우편번호"
            readOnly
            onChange={e => setPostalCode(e.target.value)} />
          <OneWayButton
            responsiveType='fixed'
            widthSizeType='sm'
            heightSizeType='sm'
            colorType='dark'
            content='우편번호 검색'
            fontSize='11px'
            onClick={callKakaoPostalAPI}/>
        </div>
        <Input
            className={s['shipping-input']}
            type="text"
            value={address1}
            placeholder="기본 주소"
            readOnly
            onChange={e => setAddress1(e.target.value)} />
          <Input
            className={s['shipping-input']}
            type="text"
            value={address2}
            placeholder="상세 주소"
            onChange={e => setAddress2(e.target.value)} />
      </div>
      <div className={s['set-default']}>
        <Input
          className='mt-0'
          type="checkbox"
          onChange={e => setIsDefault(e.target.checked)}/>
        <Label className='mb-0'>
          기본 배송지로 설정
        </Label>
      </div>
      <OneWayButton
        content='저장'
        responsiveType='fluid'
        widthSizeType='md'
        heightSizeType='xl'
        colorType='dark'
        fontSize='15px'
        disabled={!canProceed}
        onClick={handleProceed}/>
    </main>
  );
}