import { CircleMinus, CirclePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import fetcher from "../helpers/fetcher";
import { getQuantityStep, normalizeQuantity } from "../helpers/roundQuantity";

export default function ProductModal({ setProductModal, setProducts, products = [] }) {
  const dialogRef = useRef(null);
  const openerRef = useRef(document.activeElement);
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const selectedProduct = data.find((product) => product._id === selectedId);

  useEffect(() => { fetcher("/products/get").then(setData); }, []);
  useEffect(() => {
    const opener = openerRef.current;
    dialogRef.current?.focus();
    const close = (event) => { if (event.key === "Escape") setProductModal(false); };
    window.addEventListener("keydown", close);
    return () => { window.removeEventListener("keydown", close); opener?.focus?.(); };
  }, [setProductModal]);

  const add = (event) => {
    event.preventDefault();
    const product = data.find((candidate) => candidate._id === selectedId);
    if (!product || products.some((candidate) => candidate.productId === product._id)) return;
    setProducts((current) => [...current, { id: crypto.randomUUID(), productId: product._id, name: product.name, price: product.price, packagingMethod: product.packagingMethod, seasonal: product.seasonal, favorite: product.favorite, selectionMode: "quantity", quantity: Number(quantity), weightedItems: [] }]);
    setProductModal(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex min-h-screen w-screen justify-center p-4 pt-[20vh] tablet:pt-[30vh]">
      <button type="button" aria-label="Zamknij wybór produktu" className="fixed inset-0 h-screen w-screen cursor-default bg-black/20 backdrop-blur-sm" onClick={() => setProductModal(false)} />
      <form ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onSubmit={add} className="relative z-[9999] flex h-fit min-h-[220px] w-[80vw] max-w-lg flex-col gap-4 rounded-lg border border-darkcoral bg-white p-4 pt-8 shadow-xl outline-none">
        <button type="button" aria-label="Zamknij" className="absolute right-2 top-2 rounded focus-visible:ring-2 focus-visible:ring-coral" onClick={() => setProductModal(false)}><X /></button>
        <h2 id="product-modal-title" className="text-xl">Dodaj produkt</h2>
        <label className="flex flex-col gap-2 text-lg">Produkt<select required value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setQuantity(1); }} className="w-full border border-[#CCCCCC] p-2"><option value="">— Wybierz z listy —</option>{data.map((product) => <option key={product._id} value={product._id} disabled={products.some((candidate) => candidate.productId === product._id)}>{product.name} | {product.price} zł</option>)}</select></label>
        {selectedProduct && <div className="flex flex-col gap-2 items-center"><label htmlFor="product-quantity" className="text-lg">Ilość: ({selectedProduct.packagingMethod})</label><div className="flex gap-2 items-center"><input id="product-quantity" type="number" min={getQuantityStep(selectedProduct.packagingMethod)} step={getQuantityStep(selectedProduct.packagingMethod)} value={quantity} onChange={(event) => { const nextQuantity = Number(event.target.value); const step = getQuantityStep(selectedProduct.packagingMethod); if (Number.isFinite(nextQuantity) && nextQuantity >= step) setQuantity(normalizeQuantity(nextQuantity, selectedProduct.packagingMethod)); }} className="w-[100px] border border-[#CCCCCC] p-1 text-lg" /><button type="button" aria-label="Zwiększ ilość" onClick={() => setQuantity((current) => normalizeQuantity(Number(current) + getQuantityStep(selectedProduct.packagingMethod), selectedProduct.packagingMethod))}><CirclePlus className="w-[2rem] h-auto" /></button><button type="button" aria-label="Zmniejsz ilość" onClick={() => setQuantity((current) => Math.max(getQuantityStep(selectedProduct.packagingMethod), normalizeQuantity(Number(current) - getQuantityStep(selectedProduct.packagingMethod), selectedProduct.packagingMethod)))}><CircleMinus className="w-[2rem] h-auto" /></button></div></div>}
        <button className="mt-auto -mx-4 -mb-4 flex h-[50px] items-center justify-center rounded-b-lg bg-[#f28a7280]">Dodaj</button>
      </form>
    </div>, document.body,
  );
}
