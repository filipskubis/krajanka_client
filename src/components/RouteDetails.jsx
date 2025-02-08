import { useState, useMemo, useContext } from "react";
import { useParams } from "react-router-dom";
import { Car, LibraryBig, MapPin } from "lucide-react";
import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import Confirm from "./Confirm";
import Spinner from "./Spinner";
import QuantityList from "./QuantityList";
import { AlertContext } from "../misc/AlertContext";
export default function RouteDetails() {
  const { id } = useParams();
  const { data } = useSWR(`/routes/get/${id}`, fetcher);
  const [removingRoute, setRemovingRoute] = useState("");
  const [confirmWindow, setConfirmWindow] = useState(false);
  const { addAlert } = useContext(AlertContext);
  const aggregatedProducts = useMemo(() => {
    if (!data || !data.orders) return [];

    const productMap = new Map();

    data.orders.forEach((order) => {
      order.products.forEach((product) => {
        const { name, quantity } = product;
        if (productMap.has(name)) {
          productMap.get(name).quantities.push({ id: order.id, quantity });
        } else {
          productMap.set(name, {
            name,
            quantities: [{ id: order.id, quantity }],
          });
        }
      });
    });

    return Array.from(productMap.values());
  }, [data]);

  async function syncWithCircuit() {
    try {
      const addresses = data.orders.map((order) => {
        let productsString = "";
        order.products.forEach(({ name, quantity, packagingMethod }) => {
          productsString += `${name} - ${quantity} (${packagingMethod})\n`;
        });
        const total = order.products.reduce(
          (value, product) =>
            value + Number(product.quantity) * Number(product.price),
          0
        );
        console.log(order);
        return {
          addressName: order.address.includes(data.destination)
            ? order.address
            : `${data.destination} ${order.address}`,
          phone: order.phone,
          notes: order.note,
          products: productsString,
          total,
          paymentMethod: order.paymentMethod,
        };
      });

      const response = await fetcher(
        `/circuit/routes/${data.destination} ${data.date}/addStops`,
        "POST",
        { addresses: addresses }
      );
      addAlert("success", response);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateRoute() {
    try {
      fetcher(`/routes/update/${id}`, "POST");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  async function removeRoute() {
    try {
      fetcher(`/routes/delete/${id}`, "POST");
      window.location.href = "/trasy";
    } catch (err) {
      console.log(err);
    }
  }
  if (!data) return <Spinner />;
  if (data) {
    return (
      <div className={`relative w-full h-fit p-4 bg-[#fbe8a6]`}>
        {confirmWindow ? (
          <Confirm
            action={"Usuń trasę"}
            description={
              "Czy na pewno chcesz usunąć trasę? Ta czynność nie może być cofnięta."
            }
            cancel={() => setConfirmWindow(false)}
            confirm={() => removeRoute()}
          />
        ) : null}
        <div className="bg-white relative h-full w-full print:shadow-none rounded-xl shadow-2xl flex flex-col items-start p-4 gap-6 pb-4 print:!text-sm">
          {removingRoute ? (
            <Confirm
              action={"Usuń zamówienie"}
              description={
                "Czy na pewno chcesz usunąć zamówienie? Ta czynność jest nieodwracalna."
              }
              cancel={() => {
                setRemovingRoute(null);
              }}
              confirm={() => {
                removeRoute(removingRoute);
              }}
            />
          ) : null}
          <p className="self-center text-xl">
            {data.destination} {data.date}
          </p>
          <div className="flex flex-col gap-3 w-full text-lg tablet:text-xl print:!text-sm">
            <div className="flex gap-2 items-center">
              <Car
                color="#f28a72"
                width={"30px"}
                height={"auto"}
                className="tablet:w-[2rem]  print:w-[1.5rem]"
              />
              <p> {data.driver} </p>
            </div>
            <div className="flex gap-2 items-center">
              <LibraryBig
                color="#f28a72"
                width={"30px"}
                height={"auto"}
                className="tablet:w-[2rem] print:w-[1.5rem]"
              />
              <p> {data.orders.length} </p>
            </div>
          </div>
          <button
            className="bg-[#E74D4D] rounded-2xl  flex-grow p-3 w-full flex justify-center items-center"
            onClick={() => {
              setConfirmWindow(true);
            }}
          >
            <p className="text-white text-md">Usuń</p>
          </button>
          <button
            className="bg-[#031C4D20] rounded-2xl flex-grow p-3 w-full flex justify-center items-center gap-2"
            onClick={syncWithCircuit}
          >
            <MapPin color="#3A7AF6" strokeWidth={2.5} />
            <p className="text-md">Połącz z Circuit</p>
          </button>
          <button
            className="bg-[#031C4D20] rounded-2xl flex-grow p-3 w-full flex  justify-center items-center"
            onClick={updateRoute}
          >
            <p className="text-md">Zaktualizuj</p>
          </button>
          <div className="flex flex-col w-full gap-8 items-center">
            <p className="text-xl text-bold">Produkty: </p>
            <QuantityList
              aggregatedProducts={aggregatedProducts}
              routeID={id}
            />
          </div>
        </div>
      </div>
    );
  }
}
