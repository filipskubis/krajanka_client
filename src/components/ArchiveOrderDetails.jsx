import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { CalendarDays, CreditCard, MapPin, NotebookPen, Phone } from "lucide-react";
import fetcher from "../helpers/fetcher";
import generateOrderIdentifier from "../helpers/generateOrderIdentifier.js";
import { AlertContext } from "../misc/AlertContext.jsx";
import Spinner from "./Spinner.jsx";

function formatTimestamp(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function ArchiveOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAlert } = useContext(AlertContext);
  const { data: order, error, isLoading } = useSWR(`/orders/archive/${id}`);
  const [isRestoring, setIsRestoring] = useState(false);

  async function restoreOrder() {
    if (isRestoring) return;
    setIsRestoring(true);
    try {
      const result = await fetcher(`/orders/archive/${id}/restore`, "POST");
      await Promise.all([mutate("/orders/archive"), mutate("/orders/get")]);
      addAlert("success", "Pomyślnie przywrócono zamówienie.");
      navigate(`/zamówienie/${result._id}`);
    } catch (restoreError) {
      addAlert(
        "error",
        typeof restoreError === "string"
          ? restoreError
          : "Nie udało się przywrócić zamówienia.",
      );
      setIsRestoring(false);
    }
  }

  if (isLoading) return <Spinner />;

  if (error || !order) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#fbe8a6] p-8 text-center text-slate-700">
        <p>
          {typeof error === "string"
            ? error
            : "Zarchiwizowane zamówienie nie istnieje."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-full w-full bg-[#fbe8a6] p-4">
      <div className="flex h-full w-full flex-col items-start gap-6 rounded-xl bg-white p-4 pb-8 shadow-2xl tablet:mx-auto tablet:max-w-2xl">
        <p className="self-center text-2xl text-slate-700 tablet:text-3xl">
          {order.orderId ||
            generateOrderIdentifier(order.orderNumber, order.date)}
        </p>
        <div className="flex w-full flex-col gap-3 text-lg tablet:text-xl">
          <div className="flex items-center gap-2">
            <MapPin color="#f28a72" width="30px" className="tablet:w-8" />
            <p>{order.address || "- ~ -"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Phone color="#f28a72" width="30px" className="tablet:w-8" />
            <p>{order.phone || "- ~ -"}</p>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard color="#f28a72" width="30px" className="tablet:w-8" />
            <p>{order.paymentMethod || "- ~ -"}</p>
          </div>
          <div className="flex items-center gap-2">
            <NotebookPen color="#f28a72" width="30px" className="tablet:w-8" />
            <p>{order.note || "- ~ -"}</p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays color="#f28a72" width="30px" className="tablet:w-8" />
            <p>{order.date || "- ~ -"}</p>
          </div>
          <button
            className="mt-4 flex items-center justify-center rounded-2xl bg-slate p-3 text-lg text-white disabled:cursor-not-allowed disabled:opacity-60 tablet:text-xl"
            onClick={restoreOrder}
            disabled={isRestoring}
          >
            {isRestoring ? "Przywracanie…" : "Przywróć"}
          </button>
          <div className="mt-8 border-t border-slate-200 pt-5 text-sm leading-6 text-[#64748b] tablet:text-base">
            <div className="space-y-1">
              <p>Utworzono: {formatTimestamp(order.createdAt)}</p>
              <p>Usunięto: {formatTimestamp(order.deletedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
