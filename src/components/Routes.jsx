import { CirclePlus, LibraryBig } from "lucide-react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import { MapPin, CalendarDays, Trash2, Car } from "lucide-react";
import { useState, useEffect} from "react";
import Confirm from "./Confirm";
export default function Routes() {
  const { data } = useSWR("/routes/get", fetcher);
  const [removingRoute, setRemovingRoute] = useState("");
  const [routes, setRoutes] = useState(null)

  useEffect(() => {
    if (data) {
      const sortedRoutes = data.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateB - dateA;
      });
      setRoutes(sortedRoutes);
    }
  }, [data]);
  async function removeRoute(id) {
    try {
      fetcher(`/routes/delete/${id}`, "POST");
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  }
  if (routes) {
    return (
      <div className="relative flex flex-col gap-4 p-8 tablet:grid bg-[#fbe8a6] pb-[4rem] tablet:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] tablet:justify-items-center">
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
        <Link
          className="flex w-full items-center justify-center gap-4 bg-[#f28a72] p-3 shadow-md rounded-full"
          to="/formularzTrasy"
        >
          <CirclePlus color="#303c6c" width={"2rem"} height={"auto"} />
          <p className="text-xl tablet:text-2xl">Dodaj trasę</p>
        </Link>
        {routes.map(({ _id, destination, date, driver, orders }) => {
          return (
            <Link
              to={`/trasa/${_id}`}
              key={_id}
              className="relative w-full h-fit bg-white rounded-lg shadow-xl flex flex-col gap-4 items-start p-4 tablet:max-w-[400px] tablet:h-full"
            >
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <MapPin color="#f28a72" className="min-w-[1.5rem] h-auto" />
                  <p>{destination} </p>
                </div>

                <div className="flex gap-2 items-center">
                  <CalendarDays color="#f28a72" />
                  <p> {date} </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Car color="#f28a72" />
                  <p> {driver} </p>
                </div>
                <div className="flex gap-2 items-center">
                  <LibraryBig color="#f28a72" />
                  <p> {orders.length} </p>
                </div>
              </div>
              <div
                className="bg-[#E74D4D] rounded-full p-2 self-end absolute right-[0.5rem] bottom-[0.5rem]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setRemovingRoute(_id);
                }}
              >
                <Trash2 color="white" width={"20px"} height={"auto"} />
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
}
