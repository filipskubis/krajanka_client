/* eslint-disable react/prop-types */
import { useState } from "react";
import Big from "big.js";
import { CircleMinus, CirclePlus, Trash2 } from "lucide-react";
import roundQuantity from "../helpers/roundQuantity";

const weightFormatter = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 });

export default function FormProductEditor({ product, claimedItemIds = [], onChange, onRemove }) {
  const [weightInput, setWeightInput] = useState("");
  const [error, setError] = useState("");
  const weighted = product.selectionMode === "weighted-items";

  const setMode = (event) => {
    const nextWeighted = event.target.checked;
    onChange({ ...product, selectionMode: nextWeighted ? "weighted-items" : "quantity", quantity: nextWeighted ? null : 1, weightedItems: nextWeighted ? product.weightedItems || [] : [] });
  };
  const addWeight = () => {
    const normalized = weightInput.trim().replace(",", ".");
    if (!/^\d+(?:\.\d)?$/.test(normalized) || Number(normalized) <= 0) { setError("Podaj dodatnią wagę z maksymalnie jednym miejscem po przecinku."); return; }
    onChange({ ...product, selectionMode: "weighted-items", quantity: null, weightedItems: [...(product.weightedItems || []), { id: crypto.randomUUID(), weight: Number(normalized) }] });
    setWeightInput(""); setError("");
  };
  const removeWeight = (id) => onChange({ ...product, weightedItems: product.weightedItems.filter((item) => item.id !== id) });

  return <section className="flex flex-col gap-3 rounded-md border p-3">
    <header className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-words font-semibold">{product.name}</p><p className="text-sm opacity-75">{product.price} zł/{product.packagingMethod}</p></div><button type="button" aria-label={`Usuń ${product.name}`} onClick={onRemove} className="grid h-9 w-9 shrink-0 place-items-center rounded text-slate focus-visible:ring-2 focus-visible:ring-coral"><Trash2 /></button></header>
    {product.packagingMethod === "kg" && <label className="flex min-h-9 items-center gap-2 text-sm"><input type="checkbox" checked={weighted} onChange={setMode} />Sprzedaż na sztuki wg wagi</label>}
    {!weighted ? <div className="flex flex-col gap-2 items-start"><label htmlFor={`quantity-${product.id}`}>Ilość: ({product.packagingMethod})</label><div className="flex gap-2 items-center"><input id={`quantity-${product.id}`} type="number" min="0.1" step="0.1" value={product.quantity} onChange={(event) => onChange({ ...product, quantity: event.target.value })} className="w-[80px] border-[1px] border-[#CCCCCC] p-1 text-lg" /><button type="button" aria-label={`Dodaj ${product.name}`} onClick={() => onChange({ ...product, quantity: roundQuantity(Number(product.quantity) + 0.1) })} className="grid h-9 w-9 place-items-center rounded focus-visible:ring-2 focus-visible:ring-coral"><CirclePlus /></button><button type="button" aria-label={`Odejmij ${product.name}`} onClick={() => Number(product.quantity) > 0.1 ? onChange({ ...product, quantity: roundQuantity(Number(product.quantity) - 0.1) }) : onRemove()} className="grid h-9 w-9 place-items-center rounded focus-visible:ring-2 focus-visible:ring-coral"><CircleMinus /></button></div></div> : <>
      <div className="flex flex-wrap gap-2"><label className="flex flex-col gap-1 text-sm font-medium">Waga sztuki (kg)<input inputMode="decimal" value={weightInput} onChange={(event) => setWeightInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addWeight(); } }} className="h-9 border p-1" /></label><button type="button" aria-label="Dodaj wagę" onClick={addWeight} className="self-end grid h-9 w-9 place-items-center rounded p-1 text-slate focus-visible:ring-2 focus-visible:ring-coral"><CirclePlus aria-hidden="true" /></button></div>
      {error && <p className="text-sm font-medium text-[#A1221E]" role="alert">{error}</p>}
      {(product.weightedItems || []).length > 0 && <ul className="mt-1 flex flex-col gap-3">{product.weightedItems.map((item) => { const claimed = claimedItemIds.includes(item.id); return <li key={item.id} className="flex min-h-10 items-center justify-between gap-3"><span className="min-w-0"><strong>{weightFormatter.format(item.weight)} kg</strong><span className="text-sm opacity-75"> · {Big(item.weight).times(product.price).toFixed(2)} zł · {claimed ? "Zamówione" : "Dostępna"}</span></span>{!claimed && <button type="button" aria-label={`Usuń wagę ${item.weight}`} onClick={() => removeWeight(item.id)} className="min-h-9 shrink-0 rounded px-2 text-sm font-medium text-slate focus-visible:ring-2 focus-visible:ring-coral">Usuń</button>}</li>; })}</ul>}
    </>}
  </section>;
}
