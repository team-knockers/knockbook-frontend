import { useEffect, useRef, useState } from 'react';
import { HiLocationMarker } from "react-icons/hi";
import OneWayButton from '../../components/forms/OneWayButton';
import s from './OrderPage.module.css';
import { useFetcher, useLoaderData, useRevalidator } from 'react-router-dom';
import { Input, Label } from 'reactstrap';
import { MdKeyboardArrowUp } from "react-icons/md";
import type { OrderPageLoaderData } from './OrderPage.loader';
import { GoAlert } from "react-icons/go";
import { dateLabel, weekday } from '../../utils/dateValidator';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import type { CouponIssuance } from '../../features/purchase/type';
import { formatPoint, formatWon } from '../../features/purchase/utils/formatter';
import { PaymentService } from '../../features/purchase/services/PaymentService';
import SimplePopup from '../../components/overlay/SimplePopup';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useSession } from '../../hooks/useSession';
import { PATHS } from '../../routes/paths';
import AddressForm from '../../features/account/components/AddressForm';

export default function OrderPage() {

  const {
    orderId,
    address,
    numPurchaseItems, purchaseList,
    numRentalItems, rentalList,
    coupons, points,
    aggregation
  } = useLoaderData() as OrderPageLoaderData;

  const { revalidate } = useRevalidator();
  const fetcher = useFetcher();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { userId } = useSession.getState();

  /* address section */
  const hasAddress = !!address;
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
  const [addressFormMode, setAddressFormMode] = useState<"insert"|"update">("insert");

  const hasEntry = hasAddress && typeof address!.entryInfo === "string" && address!.entryInfo.trim() !== "";
  const [mode, setMode] = useState<"AUTH"|"PUBLIC">(hasEntry ? "AUTH" : "PUBLIC");
  const [entryInfo, setEntryInfo] =  useState(hasAddress ? (address!.entryInfo ?? "") : "");
  
  /* set a new address */
  const handleAddressInserted = () => {
    setIsAddressPopupOpen(false);
    revalidate();
  };

  const submitEntryInfo = (value: string) => {
    if (!hasAddress) {
      return;
    }
    const fd = new FormData();
    fd.append('intent', 'update-address-entry-info');
    fd.append("entryInfo", value);
    fd.append("addressId", address.id);
    submitWithIntent(fd, "PATCH");
  };

  const [purchaseOpen, setPurchaseOpen] = useState(true);
  const [rentalOpen, setRentalOpen] = useState(true);
  const [discountOpen, setDiscountOpen] = useState(true);
  const [aggregationOpen, setAggregationOpen] = useState(true);
  const [couponOpen, setCouponOpen] = useState(false);
  
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<"KAKAOPAY" | "TOSS">("KAKAOPAY");

  const [agreeOpen, setAgreeOpen] = useState(true);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreePersonal, setAgreePersonal] = useState(false);
  const [agreePg, setAgreePg] = useState(false);

  const [canProceed, setCanProceed] = useState(false);
  
  const lastIntentRef = useRef<string | null>(null);

  const submitWithIntent = (fd: FormData, method: "POST" | "DELETE" | "PATCH") => {
    lastIntentRef.current = (fd.get("intent") as string) ?? null;
    fetcher.submit(fd, { method });
  };

  useEffect(() => {
    if (fetcher.state === "idle" && lastIntentRef.current) {
      const i = lastIntentRef.current;
      if (
        i === "apply-coupon" || i === "remove-coupon" ||
        i === "apply-points" || i === "remove-points"
      ) {
        revalidate();
      }
      lastIntentRef.current = null;
    }
  }, [fetcher.state, revalidate]);

  const isExpired = (expiresAt: string) => {
    const now = new Date();
    const exp = new Date(expiresAt);
    return exp.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  };

  const selectedCoupon = selectedCouponId
    ? (coupons as CouponIssuance[]).find(c => c.id === selectedCouponId)
    : null;

  const pointsAvailable = points ?? 0;
  const [pointsInput, setPointsInput] = useState<string>("");
  const toInt = (v: string) => Number.isFinite(Number(v)) 
    ? Math.max(0, Math.floor(Number(v))) : 0;
  const clamp = (n: number, min: number, max: number) => 
    Math.min(Math.max(n, min), max);

  const applyCoupon = (couponIssuanceId: string) => {
    const fd = new FormData();
    fd.append("intent", "apply-coupon");
    fd.append("orderId", orderId);
    fd.append("couponIssuanceId", couponIssuanceId);
    submitWithIntent(fd, "POST");
  };

  const removeCoupon = () => {
    const fd = new FormData();
    fd.append("intent", "remove-coupon");
    fd.append("orderId", orderId);
    submitWithIntent(fd, "DELETE");
  };

  const applyPoints = (amount: number) => {
    const fd = new FormData();
    fd.append("intent", amount > 0 ? "apply-points" : "remove-points");
    fd.append("orderId", orderId);
    if (amount > 0) { fd.append("points", String(amount)); }
    submitWithIntent(fd, amount > 0 ? "POST" : "DELETE");
  };

  const handlePickCoupon = (id: string) => {
    setSelectedCouponId(id);
    applyCoupon(id);
  };

  const handleClearCoupon = () => {
    setSelectedCouponId(null);
    removeCoupon();
  };

   const onToggleAuth = (checked: boolean) => {
    setMode(checked ? "AUTH" : "PUBLIC");
  };

  const onTogglePublic = (checked: boolean) => {
    setMode(checked ? "PUBLIC" : "AUTH");
  };

  const onChangeEntryInfo = (v: string) => {
    setEntryInfo(v);
    if (mode === "AUTH") {
      submitEntryInfo(v);
    }
  };

  const onChangePoints = (raw: string) => {
    
    const numOnly = raw.replace(/[^\d]/g, "");
    if (numOnly === "") {
      setPointsInput("");
      return;
    }
    const n = clamp(toInt(numOnly), 0, pointsAvailable);
    setPointsInput(String(n));
  };

  const onUseAllPoints = () => {
    if (pointsAvailable <= 0) return;
    setPointsInput(String(pointsAvailable));
    applyPoints(pointsAvailable);
  };

  const onBlurPoints = () => {
    const n = toInt(pointsInput);
    if (n <= 0) {
      setPointsInput("");
      applyPoints(0);
    } else {
      applyPoints(clamp(n, 0, pointsAvailable));
    }
  };

  const onKeyDownPoints
  : React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const onToggleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreePersonal(checked);
    setAgreePg(checked);
  };
  
  useEffect(() => {
    setAgreeAll(agreePersonal && agreePg);
  }, [agreePersonal, agreePg]);

  useEffect(() => {
    setCanProceed(hasAddress && agreePersonal && agreePg);
  }, [hasAddress, agreePersonal, agreePg]);

  /* payment using kakaopay */
  const [payLoading, setPayLoading] = useState(false);

  const startKakaoPay = async () => {
    if (!canProceed) { return; }
    if (!userId) { return; }
    try {
      setPayLoading(true);
      const data = await PaymentService.kakaoReady(userId, orderId);
      PaymentService.redirectToKakao(data);
    } catch (e) {
      console.error(e);
      alert('결제 초기화 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setPayLoading(false);
    }
  };
  const handleOrderButtonClick = () => {
    if (payMethod === 'KAKAOPAY') {
      startKakaoPay();
    }
  }

  return (
    <main className={s['page-layout']}>

      {/* address popup */}
      <SimplePopup
        open={isAddressPopupOpen}
        onClose={() => setIsAddressPopupOpen(false)}
        title="배송지 추가"
        fullScreen={isMobile}
        noBodyPadding
        showCloseButton={true}>
          <AddressForm
            mode={addressFormMode}
            actionPath={PATHS.userAddress}
            addressId={address?.id}
            initial={addressFormMode === "update" ? {
              label: address?.label,
              recipientName: address?.recipientName,
              phone: address?.phone,
              postalCode: address?.postalCode,
              address1: address?.address1,
              address2: address?.address2,
              isDefault: true
            } : undefined}
            onProceedClick={handleAddressInserted}/>
      </SimplePopup>

      <div className={s['max-width-container']}>
        {/* left column */}
        <div className={s['left-col']}>
          <section className={s['shipping-address']}>
            {!hasAddress ? (
              <div className={s['shipping-address-empty']}>
                <div className={s['shipping-address-empty-title']}>
                  <HiLocationMarker size={16} />
                  <span>배송지 없음</span>
                </div>
                <p className={s['shipping-address-empty-desc']}>
                  결제를 진행하려면 배송지를 등록해주세요.
                </p>
                <OneWayButton
                  content='배송지 추가'
                  responsiveType='fixed'
                  widthSizeType='sm'
                  heightSizeType='sm'
                  colorType='dark'
                  fontSize='14px'
                  onClick={() => {
                    setAddressFormMode("insert");
                    setIsAddressPopupOpen(true);
                  }}
                />
              </div>
            ) : (
              <>
                <div className={s['shipping-address-header']}>
                  <div className={s['shipping-address-header-label']}>
                    <HiLocationMarker size={15} />
                    <span>{address?.label}</span>
                    <span className={s['shipping-address-header-label-tag']}>
                      기본 배송지
                    </span>
                  </div>
                  <OneWayButton
                    content='변경'
                    responsiveType='fixed'
                    widthSizeType='xxs'
                    heightSizeType='xxs'
                    colorType='dark'
                    fontSize='12px'
                    onClick={() => {
                      setAddressFormMode("update");
                      setIsAddressPopupOpen(true);
                    }}
                  />
                </div>
                <div className={s['shipping-address-detail']}>
                  <div><span>{address?.recipientName} {address?.phone}</span></div>
                  <div><span>[{address?.postalCode}] {address?.address1} {address?.address2}</span></div>
                </div>

                <div className={s['shipping-address-require']}>
                  <span className={s['shipping-address-require-label']}>배송요청사항</span>
                  <div className={s['shipping-address-require-right']}>
                    <span className={s['shipping-address-require-content']}>{address?.deliveryMemo}</span>
                    <OneWayButton
                      content='변경'
                      responsiveType='fixed'
                      widthSizeType='xxs'
                      heightSizeType='xxs'
                      colorType='dark'
                      fontSize='12px'
                      onClick={() => {/* TODO */}}
                    />
                  </div>
                </div>

                <div className={s['shipping-address-entry']}>
                  <div className={s['shipping-address-entry-title']}>공동현관 출입방법</div>
                  <div className={s['shipping-address-entry-method']}>
                    <div className={s['input-label-pair']}>
                      <Input id='entry-auth' type="checkbox"
                        checked={mode === "AUTH"}
                        onChange={e => onToggleAuth(e.target.checked)} />
                      <Label className='mb-0' for='entry-auth'>공동현관 비밀번호</Label>
                    </div>
                    <div className={s['input-label-pair']}>
                      <Input id='entry-public' type="checkbox"
                        checked={mode === "PUBLIC"}
                        onChange={e => onTogglePublic(e.target.checked)} />
                      <Label className='mb-0' for='entry-public'>자유출입가능</Label>
                    </div>
                  </div>
                  <div className={s['shipping-address-entry-pass']}>
                    <Input className='mt-0 fs-6' type="text" placeholder='비밀번호를 입력하세요'
                      value={entryInfo}
                      onChange={e => onChangeEntryInfo(e.target.value)}
                      disabled={mode === "PUBLIC"} />
                  </div>
                </div>
              </>
            )}
          </section>
          <section className={s['purchase-list']}>
            <div className={s['purchase-list-header']}>
              <div className={s['purchase-list-header-title']}>
                <span>구매내역</span>
              </div>
              <div className={s['purchase-list-header-right']}>
                <div className={s['purchase-list-header-count']}>
                  <span>총 {numPurchaseItems}개</span>
                </div>
                <button 
                  className={`${s['list-header-flip']} ${purchaseOpen ? s['flip-open'] : s['flip-closed']}`}
                  type="button"
                  aria-expanded={purchaseOpen}
                  aria-controls="purchase-list-items"
                  onClick={() => setPurchaseOpen(prev => !prev)}>
                  <MdKeyboardArrowUp size={20}/>
                </button>
              </div>
            </div>
            {purchaseOpen && (
              <div className={s['purchase-list-items']}>
                {purchaseList.map(p =>
                  <div 
                    className={s['purchase-list-item']}
                    key={p.id}>
                    <div className={s['list-item-img-wrapper']}>
                      <img
                        className={s['list-item-img']}
                        src={p.thumbnailUrl}/>
                    </div>
                    <div className={s['list-item-title']}>
                      <span>{p.titleSnapshot}</span>
                    </div>
                    <div className={s['list-item-qty']}>
                      <span>{p.quantity}개</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
          <section className={s['rental-list']}>
            <div className={s['rental-list-header']}>
              <div className={s['rental-list-header-title']}>
                <span>대여내역</span>
              </div>
              <div className={s['rental-list-header-right']}>
                <div className={s['rental-list-header-count']}>
                  <span>총 {numRentalItems}개</span>
                </div>
                <button
                  className={`${s['list-header-flip']} ${rentalOpen ? s['flip-open'] : s['flip-closed']}`}
                  type="button"
                  aria-expanded={rentalOpen}
                  aria-controls="rental-list-items"
                  onClick={() => setRentalOpen(prev => !prev)}>
                  <MdKeyboardArrowUp size={20}/>
                </button>
              </div>
            </div>
            {rentalOpen && (
              <div className={s['rental-list-items']}>
                {rentalList.map(r =>
                  <div 
                    className={s['rental-list-item']}
                    key={r.id}>
                    <div className={s['list-item-img-wrapper']}>
                      <img
                        className={s['list-item-img']}
                        src={r.thumbnailUrl}/>
                    </div>
                    <div className={s['list-item-title']}>
                      <span>{r.titleSnapshot}</span>
                    </div>
                    <div className={s['list-item-qty']}>
                      <span>{r.quantity}개</span>
                    </div>
                  </div>
                )}
                <div className={s['rental-list-policy']}>
                  <div className={s['rental-list-policy-title']}>
                    <span><GoAlert size={18} /> 꼭 읽어주세요</span>
                  </div>
                  <div className={s['rental-list-policy-content']}>
                    <div className={s['rental-list-policy-content-row']}>
                      <span>발송예정일</span>
                      <span>내일 ({dateLabel}, {weekday})</span>
                    </div>
                    <div className={s['rental-list-policy-content-row']}>
                      <span>대여기간</span>
                      <span>14일 (도착 완료일 기준)</span>
                    </div>
                    <div className={s['rental-list-policy-content-row']}>
                      <span>반납방법</span>
                      <span>반납신청 시 택배 수거</span>
                    </div>
                    <div className={s['rental-list-policy-content-row']}>
                      <span>파손 분실에 따라 추가금이 발생할 수 있습니다.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className={s['discount']}>
            <div className={s['discount-header']}>
              <div className={s['discount-header-title']}>
                <span>할인 적용</span>
              </div>
              <button
                className={`${s['list-header-flip']} ${discountOpen ? s['flip-open'] : s['flip-closed']}`}
                type="button"
                aria-expanded={discountOpen}
                aria-controls="discount-content"
                onClick={() => setDiscountOpen(prev => !prev)}>
                <MdKeyboardArrowUp size={20}/>
              </button>
            </div>
            { discountOpen && (
              <div className={s['discount-content']}>
                <div className={s['coupon']}>
                  <div className={s['coupon-title']}>
                    <span>쿠폰</span>
                  </div>
                  <div className={s['coupon-dropdown']}>
                    <Dropdown
                      isOpen={couponOpen}
                      toggle={() => setCouponOpen(v => !v)}>
                      <DropdownToggle
                        caret
                        color="light">
                        {selectedCoupon ? selectedCoupon.name : "쿠폰 선택"}
                      </DropdownToggle>
                      <DropdownMenu>
                        {(coupons as CouponIssuance[]).length === 0 && (
                          <DropdownItem 
                            disabled>
                            사용 가능한 쿠폰이 없습니다
                          </DropdownItem>
                        )}

                        {(coupons as CouponIssuance[]).map(c => {
                          const expired = isExpired(c.expiresAt);
                          const label =
                            c.type === "AMOUNT"
                              ? `${c.name} (-${c.discountAmount.toLocaleString()}원)`
                              : c.type === "RATE"
                              ? `${c.name} (-${(c.discountRateBp / 100).toFixed(0)}%, 최대 ${c.maxDiscountAmount.toLocaleString()}원)`
                              : c.name;

                          return (
                            <DropdownItem
                              key={c.id}
                              disabled={expired || c.status !== "AVAILABLE"}
                              active={selectedCouponId === c.id}
                              onClick={() => handlePickCoupon(c.id)}
                              title={expired ? "만료된 쿠폰" : undefined}>
                              {label}
                            </DropdownItem>
                          );
                        })}

                        {(coupons as CouponIssuance[]).length > 0 && (
                          <>
                            <DropdownItem divider />
                            <DropdownItem onClick={handleClearCoupon}>
                              쿠폰 해제
                            </DropdownItem>
                          </>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <div className={s['point']}>
                  <div className={s['point-title']}>
                    <span>포인트</span>
                  </div>
                  <div className={s['point-input']}>
                    <Input
                      inputMode="numeric"
                      pattern="\d*"
                      placeholder="사용할 포인트"
                      value={pointsInput}
                      onChange={e => onChangePoints(e.target.value)}
                      onBlur={onBlurPoints}
                      onKeyDown={onKeyDownPoints}
                    />
                    <OneWayButton
                      content='전액사용'
                      responsiveType='fixed'
                      widthSizeType='sm'
                      heightSizeType='sm'
                      colorType='dark'
                      fontSize='13px'
                      onClick={onUseAllPoints}
                    />
                  </div>
                </div>
                <div className={s['point-available']}>
                  <span>보유 {pointsAvailable.toLocaleString()}p</span>
                </div>
              </div>
            )}
          </section>
          <section className={s['payment-method']}>
            <div className={s['payment-method-header']}>
              <span className={s['payment-method-header-title']}>
                결제 수단
              </span>
            </div>
            <div className={s['payment-method-body']}>
              <fieldset className={s['pay-group']} aria-label="결제수단 선택">
                <label className={s['pay-option']}>
                  <input
                    type="radio"
                    name="pay"
                    value="KAKAOPAY"
                    checked={payMethod === "KAKAOPAY"}
                    onChange={() => setPayMethod("KAKAOPAY")}
                  />
                  <span className={`${s['pay-badge']} ${s['pay-kakao']}`}>
                    카카오페이
                  </span>
                </label>

                <label className={s['pay-option']}>
                  <input
                    type="radio"
                    name="pay"
                    value="TOSS"
                    checked={payMethod === "TOSS"}
                    onChange={() => setPayMethod("TOSS")}
                  />
                  <span className={`${s['pay-badge']} ${s['pay-toss']}`}>
                    토스페이
                  </span>
                </label>
              </fieldset>
            </div>
          </section>
        </div>
        {/* right column */}
        <div className={s['right-col']}>
          <section className={s['aggregation']}>
            <div className={s['aggregation-header']}>
              <div className={s['aggregation-header-title']}>
                <span>최종 결제 금액</span>
              </div>
              <div className={s['aggregation-header-right']}>
                <div className={s['aggregation-header-total-amount']}>
                  <span>{formatWon(aggregation.totalAmount)}</span>
                </div>
                <button
                  className={`${s['list-header-flip']} ${rentalOpen ? s['flip-open'] : s['flip-closed']}`}
                  type="button"
                  aria-expanded={aggregationOpen}
                  aria-controls="rental-list-items"
                  onClick={() => setAggregationOpen(prev => !prev)}>
                  <MdKeyboardArrowUp size={20}/>
                </button>
              </div>
            </div>
            { aggregationOpen && (
              <div className={s['aggregation-content']}>
                <div className={s['aggregation-details']}>
                  <div className={s['aggregation-content-row']}>
                    <span>상품 정가</span>
                    <span>{formatWon(aggregation.subtotalAmount)}</span>
                  </div>
                  <div className={s['aggregation-content-row']}>
                    <span>상품 할인</span>
                    <span style={{ "color": "red" }}>
                      {formatWon(aggregation.discountAmount)}
                    </span>
                  </div>
                  <div className={s['aggregation-content-row']}>
                    <span>대여비</span>
                    <span>{formatWon(aggregation.rentalAmount)}</span>
                  </div>
                  <div className={s['aggregation-content-row']}>
                    <span>배송비</span>
                    <span>{formatWon(aggregation.shippingAmount)}</span>
                  </div>
                  <div className={s['aggregation-content-row']}>
                    <span>쿠폰 할인</span>
                    <span style={{ "color": "red" }}>
                      {formatWon(-aggregation.couponDiscountAmount)}
                    </span>
                  </div>
                  <div className={s['aggregation-content-row']}>
                    <span>포인트 사용</span>
                    <span>{formatPoint(-aggregation.pointsSpent)}</span>
                  </div>
                </div>
                <div className={s['aggregation-summary']}>
                  <div className={s['aggregation-content-row']}>
                    <span className={s['aggregation-summary-title']}>
                      최종 결제 금액
                    </span>
                    <span className={s['aggregation-summary-amount']}>
                      {formatWon(aggregation.totalAmount)}
                    </span>
                  </div>
                  <div className={s['aggregation-content-row']}>
                    <span>적립 예정 포인트</span>
                    <span>{formatPoint(aggregation.pointsEarned)}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className={s['agree-policy']}>
            <div className={s['agree']}>
              <div className={s['agree-header']}>
                <label className={s['agree-title']}>
                  <Input
                    type="checkbox"
                    checked={agreeAll}
                    onChange={e => onToggleAgreeAll(e.target.checked)}
                  />
                  <span>주문내용 확인 및 결제 동의</span>
                </label>
                <button
                  type="button"
                  className={`${s['list-header-flip']} ${agreeOpen ? s['flip-open'] : s['flip-closed']}`}
                  aria-expanded={agreeOpen}
                  onClick={() => setAgreeOpen(v => !v)}>
                  <MdKeyboardArrowUp size={20}/>
                </button>
              </div>

              {agreeOpen && (
                <div className={s['agree-items']}>
                  <label className={s['agree-item']}>
                    <Input
                      type="checkbox"
                      checked={agreePersonal}
                      onChange={e => setAgreePersonal(e.target.checked)}
                    />
                    <span>개인정보 수집 동의</span>
                  </label>
                  <label className={s['agree-item']}>
                    <Input
                      type="checkbox"
                      checked={agreePg}
                      onChange={e => setAgreePg(e.target.checked)}
                    />
                    <span>결제 대행 서비스 동의</span>
                  </label>
                </div>
              )}
            </div>
          </section>
          <section className={s['order-proceed']}>
            <OneWayButton
              content={payLoading ? '결제창 여는 중...' : `${formatWon(aggregation.totalAmount)} 결제하기`}
              responsiveType='fluid'
              widthSizeType='lg'
              heightSizeType='xl'
              colorType='dark'
              fontSize='20px'
              disabled={!hasAddress || !canProceed || payLoading}
              onClick={handleOrderButtonClick}
            />
          </section>
        </div>
      </div>
    </main>
  );
}