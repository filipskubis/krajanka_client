/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";

import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import Confirm from "./Confirm";
import Spinner from "./Spinner.jsx";
import ClientForm from "./ClientForm.jsx";
import ClientList from "./ClientList.jsx";

export default function Clients() {
  const { data, isLoading } = useSWR("/clients/get");
  const [clients, setClients] = useState([]);
  const [formActive, setFormActive] = useState(false);

  const [isBeingDeleted, setIsBeingDeleted] = useState(null);

  async function removeClient(client) {
    try {
      await fetcher(`/clients/delete/${client._id}`, "POST");
    } catch (err) {
      return;
    }

    const newClients = clients.filter(
      (currentClient) => currentClient.address != client.address
    );
    setClients(newClients);
  }

  function addNewClientTemp(client) {
    const newClients = [client, ...clients];
    setClients(newClients);
  }

  const [searchText, setSearchText] = useState("");

  const filteredClients = clients.filter((client) =>
    client.address.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    if (data != undefined) {
      setClients(data);
    }
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col gap-4 p-6 tablet:!text-lg bg-[#fbe8a6]">
      {isBeingDeleted ? (
        <Confirm
          action={"Usuń stałego klienta"}
          description={
            "Czy na pewno chcesz usunąć tego klienta? Ta czynność jest nieodwracalna."
          }
          cancel={() => {
            setIsBeingDeleted(null);
          }}
          confirm={() => {
            removeClient(isBeingDeleted);
            setIsBeingDeleted(null);
          }}
        />
      ) : null}

      {formActive ? (
        <ClientForm
          setFormActive={setFormActive}
          setClients={setClients}
          addNewClientTemp={addNewClientTemp}
        />
      ) : (
        <button
          className="flex w-full items-center justify-center gap-4 bg-coral p-3 shadow-md rounded-full"
          onClick={() => {
            setFormActive(true);
          }}
        >
          <CirclePlus color="#303c6c" width={"2rem"} height={"100%"} />
          <p className="text-xl tablet:text-2xl">Dodaj stałego klienta</p>
        </button>
      )}
      <div className="formverse mt-4 shadow-lg">
        <input
          className="inputverse"
          placeholder="Wyszukaj klienta"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          required=""
          type="text"
        />
        <span className="input-border"></span>
      </div>
      <div className="flex flex-col gap-4 tablet:grid tablet:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] tablet:justify-items-center">
        <ClientList
          filteredClients={filteredClients}
          setIsBeingDeleted={setIsBeingDeleted}
        />
      </div>
    </div>
  );
}
