import { useContext, useState, useEffect } from "react";
import DatePicker from "./DatePicker";
import fetcher from "../helpers/fetcher";
import { AlertContext } from "../misc/AlertContext";
import { useNavigate } from "react-router-dom";
import { X, CircleArrowRight } from "lucide-react";
export default function RouteForm() {
  const { addAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const [driver, setDriver] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isFormActive, setIsFormActive] = useState(false);
  const [driverInput, setDriverInput] = useState("");
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

  function removeDriver(value) {
    const newDrivers = [...drivers].filter((driver) => driver !== value);
    setDrivers(newDrivers);
  }

  useEffect(() => {
    return () => {
      fetcher("/routes/updateDrivers", "POST", { drivers });
    };
  });

  useEffect(() => {
    async function getData() {
      const drivers = await fetcher("/routes/getDrivers");
      setDrivers(drivers);
    }
    getData();
  }, []);

  return (
    <>
      <form
        className="relative w-full min-h-screen bg-white p-4 rounded-lg flex flex-col gap-8 pb-12 tablet:!text-xl"
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
            {drivers.map((value) => (
              <div className="relative" key={value}>
                <label className="label bg-[#f28a7270] rounded-xl">
                  <input
                    type="radio"
                    checked={driver === value}
                    onChange={() => setDriver(value)}
                    name="payment-radio"
                    value={value}
                  />
                  <p className="text">{value}</p>
                </label>
                {driver === value && (
                  <button
                    className="z-[9999] absolute top-1/2 translate-y-[-50%] right-[1rem]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeDriver(value);
                    }}
                  >
                    <X
                      className="pointer-events-none"
                      color="#E74D4D"
                      strokeWidth={3}
                    />
                  </button>
                )}
              </div>
            ))}
            {isFormActive ? (
              <label className="label flex justify-between items-center bg-white rounded-xl border-[2px] border-[#f28a7270]">
                <input
                  type="text"
                  value={driverInput}
                  onChange={(e) => {
                    setDriverInput(e.target.value);
                  }}
                  className="h-full w-fit focus:outline-none "
                  placeholder="Imię kierowcy"
                />
                <button
                  className="h-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setDriverInput("");
                    setIsFormActive(false);
                    setDrivers((prev) => {
                      return [...prev, driverInput];
                    });
                  }}
                >
                  <CircleArrowRight color="#d88572" />
                </button>
              </label>
            ) : (
              <button
                className="flex items-center justify-center gap-4 text-xl bg-[#F28A7299] p-4 h-[50px] shadow-md rounded-lg w-full mt-[2rem] tablet:text-2xl "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFormActive(true);
                }}
              >
                <p>Dodaj kierowcę</p>
              </button>
            )}
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
