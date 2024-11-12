import { useContext, useState } from "react";
import DatePicker from "./DatePicker";
import fetcher from "../helpers/fetcher";
import { AlertContext } from "../misc/AlertContext";
import { useNavigate } from "react-router-dom";

export default function RouteForm() {
  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const [driver, setDriver] = useState("Basia");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(null);

  async function handleFormSubmit(e) {
    e.preventDefault();
    const body = { driver, date: date.format("DD-MM-YYYY"), destination };
    try {
      const message = await fetcher("/routes/add", "POST", body);
      addAlert("success", message);
      navigate("/trasy");
    } catch (err) {
      addAlert("error", err);
    }
  }
  return (
    <>
      <form
        className="w-full min-h-screen bg-white p-4 rounded-lg flex flex-col gap-8 pb-12 tablet:!text-xl"
        onSubmit={handleFormSubmit}
      >
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="destination"> Miasto:</label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
            }}
            required
            className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC] w-[100px]"
          />
        </div>
        <DatePicker
          date={date}
          handleDateChange={(date) => {
            setDate(date);
          }}
        />
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p>Kierowca:</p>
          <div className="radio-input">
            {["Basia", "Mariusz"].map((value) => (
              <label key={value} className="label bg-[#f28a7270] rounded-xl">
                <input
                  type="radio"
                  checked={driver === value}
                  onChange={() => setDriver(value)}
                  name="payment-radio"
                  value={value}
                />
                <p className="text">{value}</p>
              </label>
            ))}
          </div>
        </div>
        <button
          className="text-xl bg-coral p-4 shadow-md rounded-lg w-fit self-center mt-[2rem] tablet:text-2xl"
          type="submit"
        >
          Stwórz trasę
        </button>
      </form>
    </>
  );
}
