/* eslint-disable react/prop-types */
import { useState } from "react";
import PhoneNumberInput from "./PhoneNumberInput";
import { X } from "lucide-react";
import fetcher from "../helpers/fetcher";

export default function ClientForm({ setFormActive, addNewClientTemp }) {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
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

    addNewClientTemp({ address, phone, _id: id });
    setFormActive(false);
  }

  return (
    <form
      className="self-center mb-4 w-full flex justify-center"
      onSubmit={handleSubmit}
    >
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
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
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
    </form>
  );
}
