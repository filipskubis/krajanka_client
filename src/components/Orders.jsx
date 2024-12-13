import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Trash2,
  CalendarDays,
  CirclePlus,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Link } from "react-router-dom";
import Confirm from "./Confirm";
import Spinner from "./Spinner.jsx";
import Big from "big.js";

Big.DP = 2;
Big.RM = Big.roundHalfUp;

export default function Orders() {
  const { data, isLoading } = useSWR("/orders/get", fetcher);
  const [orders, setOrders] = useState([]);
  const [removingOrder, setRemovingOrder] = useState(null);
  const [searchText, setSearchText] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.address.toLowerCase().includes(searchText.toLowerCase()) ||
      order.date.includes(searchText)
  );

  useEffect(() => {
    if (data) {
      const sortedOrders = data.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    }
  }, [data]);
  

  async function removeOrder(id) {
    try {
      await fetcher(`/orders/remove/${id}`, "POST");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="relative flex flex-col gap-4 p-8 tablet:grid bg-[#fbe8a6] pb-[4rem] tablet:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] tablet:justify-items-center">
      {removingOrder ? (
        <Confirm
          action={"Usuń zamówienie"}
          description={
            "Czy na pewno chcesz usunąć zamówienie? Ta czynność jest nieodwracalna."
          }
          cancel={() => {
            setRemovingOrder(null);
          }}
          confirm={() => {
            removeOrder(removingOrder);
          }}
        />
      ) : null}
      <Link
        className="flex w-full items-center justify-center gap-4 bg-[#f28a72] p-3 shadow-md rounded-full"
        to="/formularzZamówienia"
      >
        <CirclePlus color="#303c6c" width={"2rem"} height={"auto"} />
        <p className="text-xl tablet:text-2xl">Dodaj zamówienie</p>
      </Link>
      <div className="formverse mt-4 shadow-lg">
        <input
          className="inputverse"
          placeholder="Wyszukaj zamówienie"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          required=""
          type="text"
        />
        <span className="input-border"></span>
      </div>

      {filteredOrders.map(
        ({
          _id,
          address,
          phone,
          orderNumber,
          date,
          paymentMethod,
          products,
        }) => (
          <Link
            to={`/zamówienie/${_id}`}
            key={_id}
            className="relative w-full h-fit bg-white rounded-lg shadow-xl flex flex-col gap-4 items-start p-4 tablet:max-w-[400px] tablet:h-full"
          >
            <p className="self-center text-xl">
              {" "}
              Zamówienie numer {orderNumber}{" "}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <MapPin color="#f28a72" className="min-w-[1.5rem] h-auto" />
                <p>{address} </p>
              </div>
              <div className="flex gap-2 items-center">
                <Phone color="#f28a72" />
                <p>{phone} </p>
              </div>
              {paymentMethod ? (
                <div className="flex gap-2 items-center">
                  <CreditCard color="#f28a72" />
                  <p>{paymentMethod} </p>
                </div>
              ) : null}

              <div className="flex gap-2 items-center">
                <CalendarDays color="#f28a72" />
                <p> {date || "- ~ -"} </p>
              </div>

              <div className="flex gap-2 items-center">
                <Banknote color="#f28a72" />
                <p>
                  {`${products.reduce((value, product) => {
                    return (
                      value + Number(Big(product.quantity).times(product.price))
                    );
                  }, 0)} PLN`}
                </p>
              </div>
            </div>
            <div
              className="bg-[#E74D4D] rounded-full p-2 self-end absolute right-[0.5rem] bottom-[0.5rem]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setRemovingOrder(_id);
              }}
            >
              <Trash2 color="white" width={"20px"} height={"auto"} />
            </div>
          </Link>
        )
      )}
    </div>
  );
}
