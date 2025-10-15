import s from "./AccountPointCard.module.css";

type AccountPointCardProps = {
  date: string;
  type: string;
  title: string;
  orderId: string;
  expireDate?: string;
  amount: number;
};

export default function AccountPointCard({
  date,
  type,
  title,
  orderId,
  expireDate,
  amount,
}: AccountPointCardProps) {
  const isPlus = amount > 0;

  return (
    <div className={s["card"]}>
      <div className={s["date"]}>{date}</div>
      <div className={s["content"]}>
        <div className={s["type"]}>{type}</div>
        <div className={s["title"]}>{title}</div>
        <div className={s["order-id"]}>{orderId}</div>
        {expireDate && <div className={s["expire"]}>{expireDate}</div>}
      </div>
      <div className={`${s["amount"]} ${isPlus ? s["plus"] : s["minus"]}`}>
        {isPlus ? `+${amount.toLocaleString()}` : amount.toLocaleString()}
      </div>
    </div>
  );
}
