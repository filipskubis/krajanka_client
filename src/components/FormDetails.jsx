import useSWR from "swr";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confirm from "./Confirm";
import Spinner from "./Spinner";
import { CalendarDays, MapPin, NotebookPen } from "lucide-react";
import fetcher from "../helpers/fetcher";
import { AlertContext } from "../misc/AlertContext";
import FormEdit from "./FormEdit";

export default function FormDetails() {
  const { id } = useParams();
  const { data, isLoading } = useSWR(`/forms/get/${id}`);
  const [editing, setEditing] = useState(false);
  const [confirmWindow, setConfirmWindow] = useState(false);
  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  async function removeForm() {
    try {
      await fetcher(`/forms/remove/${id}`, "POST");
      navigate("/zamówienia");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(
        `https://zamowienia-krajanka.up.railway.app/${id}`
      );

      addAlert("success", "Pomyślnie skopiowano link");
    } catch (err) {
      return;
    }
  }

  return (
    <div className={`relative w-full h-fit ${!editing && "p-4"} bg-[#fbe8a6]`}>
      {confirmWindow && (
        <Confirm
          action={"Usuń formularz"}
          description={
            "Czy na pewno chcesz usunąć formularz? Ta czynność nie może być cofnięta."
          }
          cancel={() => {
            setConfirmWindow(false);
          }}
          confirm={() => {
            removeForm();
          }}
        />
      )}

      <div className="bg-white h-full w-full rounded-xl shadow-2xl flex flex-col items-start p-4 gap-6 pb-8">
        {isLoading ? (
          <Spinner />
        ) : editing && data ? (
          <FormEdit
            formData={data}
            close={() => {
              setEditing(false);
            }}
          />
        ) : data ? (
          <>
            <p className="text-2xl text-slate self-center tablet:text-3xl print:text-lg print:text-left print:mb-2">
              {" "}
              {data.city} {data.date}
            </p>
            <button
              className="bg-slate rounded-2xl w-full flex-grow p-3 flex justify-center items-center dontPrint self-center"
              onClick={handleCopyLink}
            >
              <p className="text-white text-lg tablet:text-xl">Kopiuj link</p>
            </button>
            <div className="flex flex-col gap-3 w-full text-lg tablet:text-xl print:!text-sm">
              <div className="flex gap-2 items-center">
                <MapPin
                  color="#f28a72"
                  width={"30px"}
                  height={"auto"}
                  className="tablet:w-[2rem] print:w-[1.5rem]"
                />
                <p>{data.city} </p>
              </div>

              <div className="flex gap-2 items-center">
                <NotebookPen
                  color="#f28a72"
                  width={"30px"}
                  height={"auto"}
                  className="tablet:w-[2rem] print:w-[1.5rem]"
                />
                <p> {data.note || "- ~ -"} </p>
              </div>
              <div className="flex gap-2 items-center">
                <CalendarDays
                  color="#f28a72"
                  width={"30px"}
                  height={"auto"}
                  className="tablet:w-[2rem]  print:w-[1.5rem]"
                />
                <p> {data.date || "- ~ -"} </p>
              </div>
              {Object.keys(data.stock).length > 0 && (
                <div className="gap-2 p-1 grid grid-cols-[minmax(90px,_1.5fr)_1fr] text-left w-full">
                  <p>Nazwa:</p>
                  <p>Ilość:</p>
                </div>
              )}

              {Object.keys(data.stock).map((name, index) => (
                <div
                  key={name}
                  className="relative border rounded-md p-1 gap-2 grid grid-cols-[minmax(90px,_1.5fr)_1fr] items-center text-left w-full"
                >
                  <p className="break-words">{`${index + 1}. ${name}`}</p>
                  <p className="break-words">{data.stock[name]}</p>
                </div>
              ))}

              <div className="mt-4 flex gap-4 dontPrint text-lg tablet:text-xl">
                <button
                  className="bg-slate rounded-2xl flex-grow p-3 flex justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setEditing(true);
                  }}
                >
                  <p className="text-white">Edytuj</p>
                </button>
                <button
                  className="bg-[#E74D4D] rounded-2xl flex-grow p-3 flex justify-center items-center"
                  onClick={() => {
                    setConfirmWindow(true);
                  }}
                >
                  <p className="text-white">Usuń</p>
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>Brak danych do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
}
