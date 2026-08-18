import { Check, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const weight = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 });

export default function WeightedItemPicker({ formProduct, selectedWeightedItemId, onChoose, onClose }) {
  const dialogRef = useRef(null);
  const openerRef = useRef(document.activeElement);
  const items = (formProduct?.weightedItems || []).filter(
    (item) => item.available || item.id === selectedWeightedItemId,
  );

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
        <p className="mb-4 border-b border-[#CCCCCC] pb-3 text-sm opacity-75">Wybierz konkretną sztukę</p>
        {items.length ? (
          <ul className="flex flex-col gap-4 pt-2">
            {items.map((item) => {
              const selected = item.id === selectedWeightedItemId;
              const available = item.available && !selected;
              return (
                <li key={item.id}>
                  <button type="button" disabled={!available} onClick={() => onChoose(item)} className="weight-option">
                    <span className="weight-option__label">{weight.format(item.weight)} kg · {Number(item.totalPrice).toFixed(2)} zł</span>
                    <span className={`weight-option__action ${available ? "" : "weight-option__action--muted"}`}>
                      {selected ? <><Check aria-hidden="true" className="h-4 w-4" />Wybrano</> : available ? <>Wybierz<ChevronRight aria-hidden="true" className="h-4 w-4" /></> : "Wyprzedane"}
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
