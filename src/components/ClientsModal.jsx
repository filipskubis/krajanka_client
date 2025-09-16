/* eslint-disable react/prop-types */

import useSWR from "swr";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ClientsModal({ setClientModal, handleClientChoice }) {
  const { data } = useSWR(`/clients/get`);
  const [value, setValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const modalRef = useRef(null);

  useEffect(() => {
    function closeFunction(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setClientModal(false);
      }
    }
    window.addEventListener("click", closeFunction);

    return () => {
      window.removeEventListener("click", closeFunction);
    };
  }, [setClientModal]);

  function handleSubmit(e) {
    e.preventDefault();
    const myClient = data.find((client) => {
      return client._id === value;
    });

    handleClientChoice(myClient.address, myClient.phone);
    setClientModal(false);
  }

  // Filter clients based on the search query
  const filteredClients = data
    ? data.filter((client) =>
        client.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="absolute flex inset-0 justify-center pt-[30%] w-screen h-screen">
      <div className="fixed w-[9999px] h-[9999px] top-0 left-0 backdrop-blur-sm z-[9998]"></div>
      <form
        className="relative w-[80vw] h-[50vh] bg-white shadow-xl border-[1px] border-darkcoral rounded-lg z-[9999] pt-8 flex flex-col gap-4 overflow-auto"
        onSubmit={handleSubmit}
        ref={modalRef}
      >
        <button
          className="absolute right-2 top-2"
          onClick={() => {
            setClientModal(false);
          }}
        >
          <X />
        </button>

        <div className="p-4">
          <input
            type="text"
            placeholder="Szukaj"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border-[1px] border-gray-300 rounded-lg"
          />
        </div>

        <div className="p-4 flex flex-col gap-4 w-full">
          <div className="radio-input">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <label className="label" key={client._id}>
                  <input
                    type="radio"
                    onChange={() => {
                      setValue(client._id);
                    }}
                    id={client._id}
                    checked={client._id === value}
                    name="client"
                    value={client._id}
                  />
                  <p className="text">{client.address}</p>
                </label>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nie znaleziono klientów
              </p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 w-full">
          <button className="w-full flex text-[#000000] justify-center items-center h-[50px] bg-[#f28a72]">
            Zatwierdź
          </button>
        </div>
      </form>
    </div>
  );
}
