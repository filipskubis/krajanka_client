/* eslint-disable react/prop-types */
import { CircleUserRound, Trash2, Check } from "lucide-react";
import { useState } from "react";
import fetcher from "../helpers/fetcher";

export default function ClientList({ filteredClients, setIsBeingDeleted }) {
  const [editMode, setEditMode] = useState(null);

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
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");

  return (
    <>
      {filteredClients.slice(0, 50).map((client) => (
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
    </>
  );
}
