import { useContext, useRef, useState } from "react";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { AlertContext } from "../misc/AlertContext";
import ProductModal from "./ProductModal";
import FormProductEditor from "./FormProductEditor";
import DatePicker from "./DatePicker";
import generateRandomId from "../helpers/generateRandomId";
import fetcher from "../helpers/fetcher";

export default function FormCreator() {
  const navigate = useNavigate();
  const { addAlert } = useContext(AlertContext);
  const textarea = useRef(null);
  const [products, setProducts] = useState([]);
  const [productModal, setProductModal] = useState(false);
  const [city, setCity] = useState("");
  const [minimumOrderValue, setMinimumOrderValue] = useState(80);
  const [eggRequirement, setEggRequirement] = useState(true);
  const [minimumEggQuantity, setMinimumEggQuantity] = useState(60);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault(); setSubmitting(true);
    try {
      const response = await fetcher("/forms/add", "POST", { id: generateRandomId(), city, products, note: note || null, date: (date || dayjs()).format("DD-MM-YYYY"), minimumOrderValue: Number(minimumOrderValue), minimumEggQuantity: eggRequirement ? Number(minimumEggQuantity) : 0 });
      addAlert("success", response); navigate("/formularze");
    } catch (error) { addAlert("error", error.message || error); } finally { setSubmitting(false); }
  }
  const replaceProduct = (next) => setProducts((current) => current.map((product) => product.id === next.id ? next : product));

  return <>
    {productModal && <ProductModal setProductModal={setProductModal} setProducts={setProducts} products={products} />}
    <form className="w-full min-h-screen bg-white p-4 rounded-lg flex flex-col gap-8 pb-12 tablet:!text-xl" onSubmit={handleFormSubmit}>
      <div className="relative flex flex-col gap-2 w-full before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
        <p>Oferta:</p>
        <button type="button" onClick={() => setProductModal(true)} className="flex ml-1 gap-2 w-fit items-center"><CirclePlus color="#f28a72" /><p className="text-coral">Dodaj Produkt</p></button>
        {products.map((product) => <FormProductEditor key={product.id} product={product} onChange={replaceProduct} onRemove={() => setProducts((current) => current.filter((candidate) => candidate.id !== product.id))} />)}
      </div>
      <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4"><label htmlFor="address">Miasto:</label><input type="text" id="address" value={city} onChange={(event) => setCity(event.target.value)} required className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC]" /></div>
      <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4"><p>Dodatkowe informacje:</p><textarea maxLength="100" rows="1" value={note} onChange={(event) => setNote(event.target.value)} ref={textarea} className="text-black text-lg focus:outline-none bg-transparent w-full p-2 rounded-lg text-wrap h-fit resize-none no-scrollbar border-[1px] border-[#f28a72]" /></div>
      <DatePicker date={date} handleDateChange={setDate} />
      <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4"><label htmlFor="minimumOrderValue">Minimalna wartość zamówienia (PLN):</label><input type="number" id="minimumOrderValue" min="0" value={minimumOrderValue} onChange={(event) => setMinimumOrderValue(event.target.value)} required className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC] w-32" /></div>
      <div className="relative flex flex-col gap-2 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4"><div className="checkbox-wrapper-46 flex flex-col gap-2 eggRequirement"><span>Wymagaj minimum jajek:</span><input type="checkbox" id="cbx-46" className="inp-cbx" onChange={(event) => setEggRequirement(event.target.checked)} checked={eggRequirement} /><label htmlFor="cbx-46" className="cbx"><span><svg viewBox="0 0 12 10" height="13px" width="15px"><polyline points="1.5 6 4.5 9 10.5 1" /></svg></span></label></div>{eggRequirement && <div className="flex flex-col gap-1"><label htmlFor="minimumEggQuantity">Minimalna ilość jajek:</label><input type="number" id="minimumEggQuantity" min="1" value={minimumEggQuantity} onChange={(event) => setMinimumEggQuantity(event.target.value)} required className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC] w-32" /></div>}</div>
      <button disabled={submitting} className="text-xl bg-coral p-4 shadow-md rounded-lg w-fit self-center mt-[2rem] tablet:text-2xl disabled:bg-[#cccccc]" type="submit">{submitting ? "Zapisywanie…" : "Stwórz formularz"}</button>
    </form>
  </>;
}
