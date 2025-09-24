import type { ReactNode } from "react";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import s from './AccordionItem.module.css';

type AccordionItemProps = {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionItem({
  id,
  title,
  children,
  defaultOpen = false,
} : AccordionItemProps) {
  
  const [isPanelOpened, setIsPanelOpened] = useState(defaultOpen);
  
  return (
    <div className={s['item-layout']}>
      <button 
        className={s['item-header-layout']}
        onClick={() => setIsPanelOpened(!isPanelOpened)}>
        <div className={s['item-header-content']}>
          <div className={s['item-header-id']}>
            <span>{id}</span>
          </div>
          <div className={s['item-header-title']}>
            <span>{title}</span>
          </div>
        </div>
        <FiChevronDown className={`${s['item-header-icon']} 
          ${isPanelOpened ? s['panel-open'] : ""}`}/>
      </button>
      <div 
        className={s['item-panel-layout']}
        hidden={!isPanelOpened}>
          <div className={s['item-panel-content']}>
            {children}
          </div>
      </div>
    </div>
  );
}
