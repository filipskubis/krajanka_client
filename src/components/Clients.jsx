/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { CircleUserRound, CirclePlus, X, Trash2, Check } from "lucide-react";
import PhoneNumberInput from "./PhoneNumberInput";
import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import Confirm from "./Confirm";
import Spinner from "./Spinner.jsx";

export default function Clients() {
  const { data, isLoading } = useSWR("/clients/get", fetcher);
  const [clients, setClients] = useState([]);
  const [formActive, setFormActive] = useState(false);
  const [phone, setPhone] = useState("");
  const [isBeingDeleted, setIsBeingDeleted] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");
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

  const [searchText, setSearchText] = useState("");

  async function handleClientEdit(e) {
    e.preventDefault();
    const clientID = editMode;
    setEditMode(null);
    const body = {
      address: currentAddress,
      phone: currentPhone,
    };
    try {
      await fetcher(`/clients/edit/${clientID}`, "POST", body);
      window.location.reload();
    } catch (err) {
      return err;
    }
  }

  const filteredClients = clients.filter((client) =>
    client.address.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    if (data != undefined) {
      setClients(data);
    }
  }, [data]);
  async function handleSubmit(e) {
    e.preventDefault();
    const address = document.querySelector("#address").value;
    const phone = document.querySelector("#phone").value;
    let id;
    try {
      const result = await fetcher("/clients/add", "POST", {
        address,
        phone,
      });
      id = result._id;
    } catch (err) {
      return err;
    }

    const newClients = [{ address, phone, _id: id }, ...clients];

    setClients(newClients);
    setFormActive(false);
    setPhone("");
  }
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
      <form
        className="self-center mb-4 w-full flex justify-center"
        onSubmit={handleSubmit}
      >
        {formActive ? (
          <div className="w-full  flex justify-center fadeIn">
            <div className="relative w-[80%] flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
              <button
                className="absolute top-[0.5rem] right-[0.5rem]"
                onClick={() => {
                  setFormActive(false);
                }}
              >
                <X color="#00000070" width={"1.5rem"} height={"100%"} />
              </button>
              <div className="flex flex-col gap-1">
                <label htmlFor="address"> Adres: </label>
                <input
                  type="text"
                  required
                  id="address"
                  className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC]"
                />
              </div>
              <PhoneNumberInput value={phone} change={setPhone} />
              <button className="border-[1px] rounded-full bg-[#00000020] p-2 active:scale-[101%]">
                {" "}
                Dodaj{" "}
              </button>
            </div>
          </div>
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
      </form>
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
        {filteredClients.map((client) => (
          <div
            key={client._id}
            className="relative rounded-lg bg-white justify-start p-4 flex items-center gap-4 tablet:w-full tablet:max-w-[350px]"
          >
            <CircleUserRound color="#f4976c" width={"2rem"} height={"100%"} />
            {editMode === client._id ? (
              <div className="relative w-[70%] flex flex-col items-start gap-[8px]">
                <input
                  value={currentAddress}
                  className="w-[80%] shadow-inner-strong focus:outline-none rounded-sm p-2"
                  onChange={(e) => {
                    setCurrentAddress(e.target.value);
                  }}
                />
                <input
                  value={currentPhone}
                  className="w-[80%] shadow-inner-strong focus:outline-none rounded-sm p-2"
                  onChange={(e) => {
                    setCurrentPhone(e.target.value);
                  }}
                />
              </div>
            ) : (
              <button
                className="relative w-[70%] flex flex-col items-start"
                onClick={() => {
                  setEditMode(client._id);
                  setCurrentAddress(client.address);
                  setCurrentPhone(client.phone);
                }}
              >
                <p className="text-start">{client.address}</p>
                <p>tel: {client.phone}</p>
              </button>
            )}

            <div className="flex flex-col justify-center gap-[5%] h-full right-[0.7rem] absolute">
              {editMode === client._id ? (
                <button
                  className="bg-[#59B059] rounded-full p-2 relative cursor-pointer"
                  onClick={(e) => {
                    handleClientEdit(e);
                  }}
                >
                  <Check
                    color="white"
                    width={"18px"}
                    height={"auto"}
                    strokeWidth={3}
                  />
                </button>
              ) : null}

              <button
                className="bg-[#E74D4D] rounded-full p-2 cursor-pointer"
                onClick={() => {
                  setIsBeingDeleted(client);
                }}
              >
                <Trash2 color="white" width={"18px"} height={"auto"} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
