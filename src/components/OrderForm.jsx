/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import { CircleMinus, CirclePlus, ClipboardList, Trash2 } from "lucide-react";
import PhoneNumberInput from "./PhoneNumberInput";
import fetcher from "../helpers/fetcher";
import useSWR from "swr";
import ClientsModal from "./ClientsModal";
import ProductModal from "./ProductModal";
import { useNavigate } from "react-router-dom";
import Big from "big.js";
import { AlertContext } from "../misc/AlertContext";
import DatePicker from "./DatePicker.jsx";
import HoldButton from "./HoldButton.jsx";
import { getQuantityStep, normalizeQuantity, updateOrderProductQuantity } from "../helpers/roundQuantity";
Big.DP = 2;
Big.RM = Big.roundHalfUp;

export default function OrderForm() {
  const { data: orderNumber } = useSWR("/orders/getOrderNumber");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productModal, setProductModal] = useState(false);
  const [clientModal, setClientModal] = useState(false);
  const [payment, setPayment] = useState("Przelew/BLIK");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [date, setDate] = useState(null);

  const { addAlert } = useContext(AlertContext);

  const textarea = useRef(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (textarea.current) {
      textarea.current.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });
    }
  }, [textarea]);

  const handleTextareaChange = (e) => {
    setNote(e.target.value);
  };
  const handleDateChange = (newDate) => {
    console.log(newDate);
    setDate(newDate);
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    const productsNoTotal = products.map(({ total, ...rest }) => rest);
    let formattedDate = null;
    if (date) {
      formattedDate = date.format("DD-MM-YYYY");
    } else {
      let newDate = new Date();
      formattedDate = newDate.format("DD-MM-YYYY");
    }

    const body = {
      address,
      phone,
      paymentMethod: payment,
      products: productsNoTotal,
      orderNumber,
      note: note || null,
      date: formattedDate,
      time: null,
    };

    try {
      const response = await fetcher("/orders/add", "POST", body);
      resetForm();
      navigate("/zamówienia");
      addAlert("success", response);
    } catch (err) {
      addAlert("error", err);
    }
  }

  function resetForm() {
    setProducts([]);
    setAddress("");
    setPhone("");
    setDate(null);
  }

  function handleAdd(id) {
    const newProducts = products.map((product) => {
      if (product.id === id) {
        return updateOrderProductQuantity(product, Number(product.quantity) + getQuantityStep(product.packagingMethod));
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

    const step = getQuantityStep(productToSubtract.packagingMethod);
    if (normalizeQuantity(Number(productToSubtract.quantity) - step, productToSubtract.packagingMethod) < step) {
      removeProduct(id);
    } else {
      const newProducts = products.map((product) => {
        if (product.id === id) {
          return updateOrderProductQuantity(product, Number(product.quantity) - step);
        }
        return product;
      });
      setProducts(newProducts);
    }
  }

  function handleClientChoice(address, phone) {
    setAddress(address);
    setPhone(phone);
  }

  return (
    <>
      {clientModal ? (
        <ClientsModal
          setClientModal={setClientModal}
          handleClientChoice={handleClientChoice}
        />
      ) : null}
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
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="order-number"> Nr zamówienia:</label>
          <input
            id="order-number"
            type="number"
            value={orderNumber}
            disabled
            required
            className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC] w-[100px]"
          />
        </div>
        <div className="relative flex flex-col gap-2 w-full before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p> Produkty: </p>
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
            <div className="hidden">
              <p className="col-span-1">Nazwa:</p>
              <p>Cena:</p>
              <p>Ilość:</p>
              <p>Razem:</p>
            </div>
          ) : null}

          {products.map(
            ({ id, name, price, quantity, packagingMethod }, index) => (
              <div
                key={id}
                className="flex flex-col gap-3 rounded-md border-[1px] p-3 text-start"
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-semibold">{`${index + 1}. ${name}`}</p>
                    <p className="text-sm opacity-75">{price >= 1 ? `${price} zł` : `${price * 100} gr`}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Usuń ${name} z zamówienia`}
                    className="grid h-9 w-9 place-items-center rounded text-slate hover:bg-[#A1221E]/10 focus-visible:ring-2 focus-visible:ring-coral"
                    onClick={() => removeProduct(id)}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </header>
                <div className="flex w-full items-end justify-between gap-4">
                  <div className="flex flex-col items-start gap-2">
                    <p>Ilość: ({packagingMethod})</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={getQuantityStep(packagingMethod)}
                        step={getQuantityStep(packagingMethod)}
                        value={quantity}
                        onChange={(event) => {
                          const nextQuantity = Number(event.target.value);
                          const step = getQuantityStep(packagingMethod);
                          if (!Number.isFinite(nextQuantity) || nextQuantity < step) return;
                          setProducts((current) => current.map((product) => product.id === id ? updateOrderProductQuantity(product, nextQuantity) : product));
                        }}
                        className="w-[80px] border-[1px] border-[#CCCCCC] p-1 text-lg"
                      />
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
                  <p className="shrink-0">{`${String(Big(quantity).times(price))} zł`}</p>
                </div>
              </div>
            )
          )}

          {products.length > 0 ? (
            <div className="gap-4 p-1 flex w-full justify-end">
              <p className="border-[2px] border-slate p-1 rounded-md flex gap-2 ">
                <p> Suma: </p>
                <p>
                  {String(
                    products
                      .reduce(
                        (acc, product) =>
                          acc.plus(Big(product.quantity).times(product.price)),
                        Big(0)
                      )
                      .toFixed(2)
                  )}{" "}
                  zł
                </p>
              </p>
            </div>
          ) : null}
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="address"> Adres: </label>
          <div
            className="flex ml-1 mb-2 gap-2 items-center"
            onClick={(e) => {
              e.stopPropagation();
              setClientModal(true);
            }}
          >
            <ClipboardList color="#f28a72" />
            <p className="text-coral"> Wybierz z listy</p>
          </div>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            required
            className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC]"
          />
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <PhoneNumberInput
            value={phone}
            change={(value) => {
              setPhone(value);
            }}
          />
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p> Płatność: </p>
          <div className="radio-input ">
            <label className="label bg-[#f28a7270] rounded-xl ">
              <input
                type="radio"
                id="value-1"
                checked={payment === "Przelew/BLIK"}
                onChange={(e) => {
                  setPayment(e.target.value);
                }}
                name="value-radio"
                value="Przelew/BLIK"
              />
              <p className="text">Przelew/BLIK</p>
            </label>
            <label className="label checked:border-[1px] checked:border-[#f28a72] bg-[#f28a7270] rounded-xl">
              <input
                type="radio"
                id="value-2"
                checked={payment === "Za pobraniem"}
                onChange={(e) => {
                  setPayment(e.target.value);
                }}
                name="value-radio"
                value="Za pobraniem"
              />
              <p className="text ">Za pobraniem</p>
            </label>
            <label className="label bg-[#f28a7270] rounded-xl">
              <input
                type="radio"
                id="value-3"
                checked={payment === "Gotówka/Przelew"}
                onChange={(e) => {
                  setPayment(e.target.value);
                }}
                name="value-radio"
                value="Gotówka/Przelew"
              />
              <p className="text">Gotówka/Przelew</p>
            </label>
          </div>
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p>Dodatkowe notatki: </p>
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
          Dodaj zamówienie
        </button>
      </form>
    </>
  );
}
