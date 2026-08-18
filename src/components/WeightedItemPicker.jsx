import { Check, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Big from "big.js";

const weight = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 });

export default function WeightedItemPicker({ formProduct, selectedWeightedItemId, onChoose, onClose }) {
  const dialogRef = useRef(null);
  const openerRef = useRef(document.activeElement);
  const itemGroups = useMemo(() => Object.values((formProduct?.weightedItems || []).reduce((groups, item) => {
    const key = Big(item.weight).toString();
    if (!groups[key]) groups[key] = { weight: item.weight, items: [] };
    groups[key].items.push(item);
    return groups;
  }, {})), [formProduct]);

  useEffect(() => {
    const opener = openerRef.current;
    dialogRef.current?.focus();
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      opener?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <button type="button" aria-label="Zamknij wybór ważonego produktu" className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={onClose} />
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="weighted-item-picker-title" className="relative z-[9999] max-h-[70vh] w-[80vw] overflow-y-auto rounded-lg border border-darkcoral bg-white p-4 shadow-xl outline-none md:w-[60vw] xl:w-[50vw]">
        <button type="button" aria-label="Zamknij" className="absolute right-2 top-2 rounded focus-visible:ring-2 focus-visible:ring-coral" onClick={onClose}><X /></button>
        <h2 id="weighted-item-picker-title" className="mb-4 text-xl">{formProduct.name}</h2>
        <p className="mb-4 border-b border-[#CCCCCC] pb-3 text-sm opacity-75">Wybierz wagę</p>
        {itemGroups.length ? (
          <ul className="flex flex-col gap-4 pt-2">
            {itemGroups.map((group) => {
              const item = group.items.find((candidate) => candidate.available && candidate.id !== selectedWeightedItemId);
              const selected = group.items.some((candidate) => candidate.id === selectedWeightedItemId);
              const allSoldOut = group.items.every((candidate) => !candidate.available);

              return (
                <li key={Big(group.weight).toString()}>
                  <button type="button" disabled={!item} onClick={() => onChoose(item)} className="weight-option">
                    <span className="weight-option__label">{weight.format(group.weight)} kg · {Number(item?.totalPrice ?? group.items[0].totalPrice).toFixed(2)} zł</span>
                    <span className={`weight-option__action ${item ? "" : "weight-option__action--muted"}`}>
                      {item ? <>Wybierz<ChevronRight aria-hidden="true" className="h-4 w-4" /></> : selected ? <><Check aria-hidden="true" className="h-4 w-4" />Wybrano</> : allSoldOut ? "Wyprzedane" : "Niedostępne"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : <p className="rounded-lg bg-[#f28a7270] p-3 text-sm">Brak dostępnych sztuk tego produktu.</p>}
      </section>
    </div>,
    document.body,
  );
}
