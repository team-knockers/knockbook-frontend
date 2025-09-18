import type { ReactNode } from "react";
import s from './Item.module.css';
import { FiCheck, FiX } from "react-icons/fi";

type ItemProps = {
  ok: boolean;
  children: ReactNode;
}

export default function Item({
  ok,
  children
} : ItemProps) {
  return (
    <span className={s[`${ok ? 'positive' : 'negative'}`]}>
      {ok ? <FiCheck /> : <FiX />} {children}
    </span>
  );
}