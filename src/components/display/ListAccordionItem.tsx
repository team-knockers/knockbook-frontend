import type { ReactNode } from "react";
import { useState } from "react";
import s from './ListAccordionItem.module.css';

type ListAccordionItemProps = {
  state: string;
  title: string;
  date: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function ListAccordionItem({
  state,
  title,
  date,
  children,
  defaultOpen = false,
} : ListAccordionItemProps) {
  
  const [isPanelOpened, setIsPanelOpened] = useState(defaultOpen);
  
  return (
    <div className={s['item-layout']}>
      <button
        className={s['item-header-layout']}
        onClick={() => setIsPanelOpened(!isPanelOpened)}>
          <div className={s['item-header-meta']}>
            <div className={s['item-header-state']}>
              <span>{state}</span>
            </div>
            <div className={s['item-header-date']}>
                <span>{date}</span>
            </div>
          </div>          
          <div className={s['item-header-title']}>
            <span>{title}</span>
          </div>
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
