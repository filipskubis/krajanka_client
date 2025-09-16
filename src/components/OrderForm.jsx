/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import { CircleMinus, CirclePlus, ClipboardList } from "lucide-react";
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
Big.DP = 2;
Big.RM = Big.roundHalfUp;

export default function OrderForm() {
  // const [data, setData] = useState();

  //delegate product data fetching into product modal and jam it into a promise all there

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

  // useEffect(() => {
  //   async function getData() {
  //     const [data, orderNumber] = await Promise.all([
  //       "/products/get",
  //       "/orders/getOrderNumber",
  //     ]);
  //     console.log(data, orderNumber);
  //   }
  // }, []);

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
            <div className="gap-4 p-1 grid grid-cols-[1.5fr_1fr_1fr_1fr] text-left">
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
                className="relative border-[1px] rounded-md p-1 gap-4 grid grid-cols-[2fr_1fr_1.5fr_1fr] items-start text-start"
              >
                <p className="break-words col-span-1">{`${
                  index + 1
                }. ${name}`}</p>
                <p>{price >= 1 ? `${price} zł` : `${price * 100} gr`}</p>
                <div className="flex flex-col gap-2 items-center">
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
                <p>{`${String(Big(quantity).times(price))} zł`}</p>
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
