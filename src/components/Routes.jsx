import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import { useState } from "react";
import Confirm from "./Confirm";
import RouteListItem from "./RouteListItem.jsx";
import Spinner from "./Spinner.jsx";

export default function Routes() {
  const { data: routes, isLoading } = useSWR("/routes/get");
  const [removingRoute, setRemovingRoute] = useState("");

  async function removeRoute(id) {
    try {
      fetcher(`/routes/delete/${id}`, "POST");
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  }
  if (isLoading) {
    return <Spinner />;
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

        {routes.map((route) => {
          return (
            <RouteListItem
              key={route._id}
              route={route}
              setRemovingRoute={setRemovingRoute}
            />
          );
        })}
      </div>
    );
  }
}
