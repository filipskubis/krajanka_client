/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

import { MapPin, CalendarDays, Car, LibraryBig, Trash2 } from "lucide-react";

export default function RouteListItem({ route, setRemovingRoute }) {
  const { _id, destination, date, driver, orders } = route;

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
}
