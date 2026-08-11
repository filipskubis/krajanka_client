import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  CalendarDays,
  CircleUserRound,
  Clock,
  CreditCard,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner.jsx";
import generateOrderIdentifier from "../helpers/generateOrderIdentifier.js";

function normaliseSearchValue(value) {
  return typeof value === "string"
    ? value.trim().toLocaleLowerCase("pl-PL")
    : "";
}

export default function Archive() {
  const { data: orders, error, isLoading, mutate } = useSWR("/orders/archive");
  const [searchText, setSearchText] = useState("");
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    const query = normaliseSearchValue(searchText);
    if (!query) return orders;
    return orders.filter((order) =>
      [
        order?.address,
        order?.date,
        order?.orderId ||
          generateOrderIdentifier(order?.orderNumber, order?.date),
      ].some((value) => normaliseSearchValue(value).includes(query)),
    );
  }, [orders, searchText]);

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-[#fbe8a6] p-8 text-center text-slate-700">
        <p>Nie udało się pobrać archiwum zamówień.</p>
        <button
          className="rounded-2xl bg-slate p-3 text-white"
          onClick={() => mutate()}
        >
          Spróbuj ponownie
        </button>
      </div>
    );

  return (
    <div className="flex min-h-full flex-col gap-4 bg-[#fbe8a6] p-8 pb-[4rem] tablet:grid tablet:grid-cols-2 tablet:justify-items-center">
      <div className="w-full tablet:col-span-2 tablet:max-w-[52rem]">
        <label className="sr-only" htmlFor="archive-search">
          Wyszukaj zarchiwizowane zamówienie
        </label>
        <div className="formverse my-4 shadow-lg">
          <input
            id="archive-search"
            className="inputverse"
            type="search"
            placeholder="Wyszukaj w archiwum"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <span className="input-border" />
        </div>
      </div>
      {Array.isArray(orders) && orders.length === 0 ? (
        <p className="tablet:col-span-2">Brak zarchiwizowanych zamówień.</p>
      ) : filteredOrders.length === 0 ? (
        <p className="tablet:col-span-2">Nie znaleziono zamówień.</p>
      ) : (
        filteredOrders.map((order) => (
          <Link
            to={`/archiwum/${order._id}`}
            key={order._id}
            className="relative flex h-fit w-full flex-col items-start gap-4 rounded-lg bg-white p-4 shadow-xl tablet:h-full tablet:max-w-[400px]"
          >
            {order.createdByClient && (
              <CircleUserRound
                aria-label="Zamówienie utworzone przez klienta"
                color="#303c6c"
                size="32px"
                strokeWidth={2.5}
                className="absolute -left-2.5 -top-2.5"
              />
            )}
            <p className="self-center text-xl text-slate-700">
              Zamówienie{" "}
              {order.orderId ||
                generateOrderIdentifier(order.orderNumber, order.date)}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MapPin color="#f28a72" className="h-auto min-w-[1.5rem]" />
                <p>{order.address || "- ~ -"}</p>
              </div>
              {order.phone && (
                <div className="flex items-center gap-2">
                  <Phone color="#f28a72" />
                  <p>{order.phone}</p>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex items-center gap-2">
                  <CreditCard color="#f28a72" />
                  <p>{order.paymentMethod}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CalendarDays color="#f28a72" />
                <p>{order.date || "- ~ -"}</p>
              </div>
              {order.createdAt && (
                <div className="flex items-center gap-2">
                  <Clock color="#f28a72" />
                  <p>
                    {new Date(order.createdAt).toLocaleTimeString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
