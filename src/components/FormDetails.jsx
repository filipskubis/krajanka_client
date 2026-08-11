import useSWR from "swr";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, MapPin, NotebookPen } from "lucide-react";
import Confirm from "./Confirm";
import Spinner from "./Spinner";
import fetcher from "../helpers/fetcher";
import { AlertContext } from "../misc/AlertContext";
import FormEdit from "./FormEdit";

const weight = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 });

export default function FormDetails() {
  const { id } = useParams(); const { data, isLoading } = useSWR(`/forms/get/${id}`); const [editing, setEditing] = useState(false); const [confirmWindow, setConfirmWindow] = useState(false); const { addAlert } = useContext(AlertContext); const navigate = useNavigate();
  async function removeForm() { try { await fetcher(`/forms/remove/${id}`, "POST"); navigate("/zamówienia"); } catch (error) { addAlert("error", error.message || error); } }
  async function copyLink() { try { await navigator.clipboard.writeText(`https://zamowienia.up.railway.app/${id}`); addAlert("success", "Pomyślnie skopiowano link"); } catch { addAlert("error", "Nie udało się skopiować linku"); } }
  if (isLoading) return <Spinner />;
  if (editing && data) return <FormEdit formData={data} close={() => setEditing(false)} />;
  if (!data) return <p>Brak danych do wyświetlenia.</p>;
  return <div className="relative w-full h-fit p-4 bg-[#fbe8a6]">{confirmWindow && <Confirm action="Usuń formularz" description="Czy na pewno chcesz usunąć formularz?" cancel={() => setConfirmWindow(false)} confirm={removeForm} />}<div className="bg-white rounded-xl shadow-2xl flex flex-col items-start p-4 gap-6 pb-8"><p className="text-2xl text-slate self-center">{data.city} {data.date}</p><button className="bg-slate rounded-2xl w-full p-3 text-white" onClick={copyLink}>Kopiuj link</button><div className="flex flex-col gap-3 w-full text-lg"><p className="flex gap-2 items-center"><MapPin color="#f28a72" />{data.city}</p><p className="flex gap-2 items-center"><NotebookPen color="#f28a72" />{data.note || "- ~ -"}</p><p className="flex gap-2 items-center"><CalendarDays color="#f28a72" />{data.date}</p><section className="flex flex-col gap-2 w-full">{(data.products || []).map((product) => product.selectionMode === "weighted-items" ? <div key={product.id} className="rounded border p-2"><p className="font-semibold">{product.name} · pojedyncze sztuki</p><ul>{(product.weightedItems || []).map((item) => <li key={item.id}>{weight.format(item.weight)} kg</li>)}</ul></div> : <div key={product.id || product.name} className="rounded border p-2">{product.name} · {product.quantity ?? data.stock?.[product.name]}</div>)}</section><div className="mt-4 flex gap-4 w-full"><button className="bg-slate rounded-2xl flex-grow p-3 text-white" onClick={() => setEditing(true)}>Edytuj</button><button className="bg-[#E74D4D] rounded-2xl flex-grow p-3 text-white" onClick={() => setConfirmWindow(true)}>Usuń</button></div></div></div></div>;
}
