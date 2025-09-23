/* eslint-disable no-unused-vars */
import { useState, useRef, useContext } from "react";
import { AlertContext } from "../misc/AlertContext";
import ProductModal from "./ProductModal";
import DatePicker from "./DatePicker";
import { CirclePlus, CircleMinus } from "lucide-react";
import HoldButton from "./HoldButton";
import generateRandomId from "../helpers/generateRandomId";
import { useNavigate } from "react-router-dom";
import fetcher from "../helpers/fetcher";

export default function FormCreator() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productModal, setProductModal] = useState(false);

  const [city, setCity] = useState("");

  const [date, setDate] = useState(null);
  const [note, setNote] = useState("");

  const handleTextareaChange = (e) => {
    setNote(e.target.value);
  };
  const handleDateChange = (newDate) => {
    console.log(newDate);
    setDate(newDate);
  };
  const { addAlert } = useContext(AlertContext);

  const textarea = useRef(null);

  async function handleFormSubmit(e) {
    e.preventDefault();
    let formattedDate = null;
    if (date) {
      formattedDate = date.format("DD-MM-YYYY");
    } else {
      let newDate = new Date();
      formattedDate = newDate.format("DD-MM-YYYY");
    }

    let stock = {};
    products.forEach(({ name, quantity }) => {
      stock[name] = quantity;
    });

    const body = {
      id: generateRandomId(),
      city,
      stock,
      products,
      note: note || null,
      date: formattedDate,
    };
    console.log(body);

    try {
      const response = await fetcher("/forms/add", "POST", body);
      console.log(response);
      navigate("/formularze");
      addAlert("success", response);
    } catch (err) {
      addAlert("error", err);
    }
  }

  function handleAdd(id) {
    const newProducts = products.map((product) => {
      if (product.id === id) {
        product.quantity++;
      }
      return product;
    });
    setProducts(newProducts);
  }
  function removeProduct(id) {
    const newProducts = products.filter((product) => product.id != id);
    setProducts(newProducts);
  }
  function handleSubtract(id) {
    const productToSubtract = products.find((product) => product.id === id);

    if (!productToSubtract) return;

    if (productToSubtract.quantity - 1 <= 0) {
      removeProduct(id);
    } else {
      const newProducts = products.map((product) => {
        if (product.id === id) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProducts(newProducts);
    }
  }

  return (
    <>
      {productModal ? (
        <ProductModal
          setProductModal={setProductModal}
          setProducts={setProducts}
        />
      ) : null}
      <form
        className="w-full min-h-screen bg-white p-4 rounded-lg flex flex-col gap-8 pb-12 tablet:!text-xl"
        onSubmit={handleFormSubmit}
      >
        <div className="relative flex flex-col gap-2 w-full before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p> Oferta: </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setProductModal(true);
            }}
            className="flex ml-1 gap-2 w-fit items-center"
          >
            <CirclePlus color="#f28a72" />
            <p className="text-coral"> Dodaj Produkt</p>
          </button>
          {products.length > 0 ? (
            <div className="gap-4 p-1 grid grid-cols-[1.5fr_1fr] text-left">
              <p className="col-span-1">Nazwa:</p>
              <p>Ilość:</p>
            </div>
          ) : null}

          {products.map(({ id, name, quantity, packagingMethod }, index) => (
            <div
              key={id}
              className="relative border-[1px] rounded-md p-1 gap-4 grid grid-cols-[1.5fr_1fr] items-start text-start"
            >
              <p className="break-words col-span-1">{`${
                index + 1
              }. ${name}`}</p>
              <div className="flex flex-col gap-2 items-start">
                {quantity} ({packagingMethod})
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAdd(id);
                    }}
                  >
                    <CirclePlus />
                  </button>
                  <HoldButton
                    click={() => {
                      handleSubtract(id);
                    }}
                    hold={() => {
                      removeProduct(id);
                    }}
                  >
                    <CircleMinus />
                  </HoldButton>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="address"> Miasto: </label>
          <input
            type="text"
            id="address"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            required
            className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC]"
          />
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p>Dodatkowe informacje: </p>
          <textarea
            maxLength="100"
            rows="1"
            value={note}
            onChange={handleTextareaChange}
            ref={textarea}
            className="text-black text-lg focus:outline-none bg-transparent w-full p-2 rounded-lg text-wrap h-fit resize-none no-scrollbar border-[1px] border-[#f28a72]"
          />
        </div>

        <DatePicker date={date} handleDateChange={handleDateChange} />

        <button
          className="text-xl bg-coral p-4 shadow-md rounded-lg w-fit self-center mt-[2rem] tablet:text-2xl"
          type="submit"
        >
          Stwórz formularz
        </button>
      </form>
    </>
  );
}
