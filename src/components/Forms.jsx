import Confirm from "./Confirm";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, CirclePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import Spinner from "./Spinner";
import fetcher from "../helpers/fetcher";

export default function Forms() {
  const { data: forms, isLoading } = useSWR("/forms/get");
  const [removingForm, setRemovingForm] = useState(null);

  async function removeForm(id) {
    try {
      await fetcher(`/forms/remove/${id}`, "POST");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="relative flex flex-col gap-4 p-8 tablet:grid bg-[#fbe8a6] pb-[4rem] tablet:grid-cols-2 tablet:justify-items-center">
      {removingForm ? (
        <Confirm
          action={"Usuń formularz"}
          description={
            "Czy na pewno chcesz usunąć formularz? Ta czynność jest nieodwracalna."
          }
          cancel={() => {
            setRemovingForm(null);
          }}
          confirm={() => {
            removeForm(removingForm);
          }}
        />
      ) : null}
      <Link
        className="flex w-full items-center justify-center gap-4 bg-[#f28a72] p-3 shadow-md rounded-full"
        to="/kreatorFormularzy"
      >
        <CirclePlus color="#303c6c" width={"2rem"} height={"auto"} />
        <p className="text-xl tablet:text-2xl">Dodaj formularz</p>
      </Link>
      {forms.map(({ id, city, date }) => (
        <Link
          to={`/formularz/${id}`}
          key={id}
          className="relative w-full h-fit bg-white rounded-lg shadow-xl flex flex-col gap-4 items-start p-4 tablet:max-w-[400px] tablet:h-full"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <MapPin color="#f28a72" className="min-w-[1.5rem] h-auto" />
              <p>{city} </p>
            </div>

            <div className="flex gap-2 items-center">
              <CalendarDays color="#f28a72" />
              <p> {date || "- ~ -"} </p>
            </div>
          </div>
          <div
            className="bg-[#E74D4D] rounded-full p-2 self-end absolute right-[0.5rem] bottom-[0.5rem]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setRemovingForm(id);
            }}
          >
            <Trash2 color="white" width={"20px"} height={"auto"} />
          </div>
        </Link>
      ))}
    </div>
  );
}
