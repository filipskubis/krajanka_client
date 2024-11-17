/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { CirclePlus, ClipboardList, CircleMinus } from "lucide-react";
import PhoneNumberInput from "./PhoneNumberInput";
import fetcher from "../helpers/fetcher";
import useSWR from "swr";
import ClientsModal from "./ClientsModal";
import ProductModal from "./ProductModal";
import "dayjs/locale/pl";
import dayjs from "dayjs";

import Big from "big.js";
import { AlertContext } from "../misc/AlertContext";
import HoldButton from "./HoldButton";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";
Big.DP = 2;
Big.RM = Big.roundHalfUp;

function convertToDateAndTimeObjects(dateStr, timeStr) {
  // Parse the date part
  const dateObject = dayjs(dateStr, "DD-MM-YYYY");

  // Parse the time part
  const [hours, minutes] = timeStr.split(":");
  const timeObject = dayjs()
    .hour(parseInt(hours, 10))
    .minute(parseInt(minutes, 10))
    .second(0)
    .millisecond(0);

  return { dateObject, timeObject };
}

export default function EditForm({ order, close }) {
  const { data } = useSWR("/products/get", fetcher);
  const [products, setProducts] = useState(order.products);
  const [productModal, setProductModal] = useState(false);
  const [clientModal, setClientModal] = useState(false);

  const [payment, setPayment] = useState(order.paymentMethod || "Przelew/BLIK");
  const [note, setNote] = useState(order.note || "");
  const handleNoteChange = (e) => setNote(e.target.value);
  const [address, setAddress] = useState(order.address);
  const [phone, setPhone] = useState(order.phone);
  const [orderNumber, setOrderNumber] = useState(order.orderNumber);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (order && order.date && order.time) {
      const { dateObject, timeObject } = convertToDateAndTimeObjects(
        order.date,
        order.time
      );
      setDate(dateObject);
      setTime(timeObject);
    }
  }, [order]);

  const { addAlert } = useContext(AlertContext);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    const productsNoTotal = products.map(({ total, ...rest }) => rest);
    let formattedDate = null;
    let formattedTime = null;
    if (date && time) {
      formattedDate = date.format("DD-MM-YYYY");
      formattedTime = time.format("HH:mm");
    }

    const body = {
      address,
      phone,
      products: productsNoTotal,
      paymentMethod: payment,
      note: note || null,
      orderNumber,
      date: formattedDate,
      time: formattedTime,
      originalOrderNumber: order.orderNumber,
    };
    try {
      const response = await fetcher(`/orders/edit/${order._id}`, "PUT", body);
      resetForm();
      close();
      addAlert("success", response);
    } catch (err) {
      addAlert("error", err);
    }
  }

  function handleAdd(id) {
    const newProducts = products.map((product) => {
      if (product?.id === id) {
        product.quantity++;
      }
      return product;
    });
    setProducts(newProducts);
  }
  function removeProduct(id) {
    const newProducts = products.filter((product) => product?.id !== id);
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

  function resetForm() {
    setProducts([]);
    setAddress("");
    setPhone("");
    setOrderNumber("");
    setDate(null);
    setTime(null);
  }

  function handleClientChoice(address, phone) {
    setAddress(address);
    setPhone(phone);
  }
  function handleAddProduct(e) {
    e.preventDefault();
    e.stopPropagation();

    const name = e.target.querySelector("#productSelect").value;
    const quantity = e.target.querySelector("#quantity").value;
    const product = data.find((product) => product.name === name);
    const uniqueId = crypto.randomUUID();
    const productObject = {
      id: uniqueId,
      name,
      quantity: quantity,
      price: product.price,
      packagingMethod: product.packagingMethod,
    };
    setProducts([...products, productObject]);
    setProductModal(false);
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
          data={data}
          setProductModal={setProductModal}
          handleAddProduct={handleAddProduct}
        />
      ) : null}
      <form
        className="w-full h-full bg-white flex flex-col gap-8 pb-12"
        onSubmit={handleFormSubmit}
      >
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="order-number"> Nr zamówienia:</label>
          <input
            id="order-number"
            type="number"
            disabled
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value);
            }}
            required
            className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC] w-[100px]"
          />
        </div>
        <div className="relative flex flex-col gap-2 w-full before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p> Produkty: </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setProductModal(true);
            }}
            className="flex ml-1 gap-2 items-center"
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
                className="relative border-[1px] rounded-md p-1 gap-4 grid grid-cols-[2fr_1fr_1.5fr_1fr] items-start  text-start"
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
                      .toFixed(2) // Round the final result to 2 decimal places
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
          <p>Płatność:</p>
          <div className="radio-input">
            {["Przelew/BLIK", "Za pobraniem", "Gotówka/Przelew"].map(
              (method) => (
                <label key={method} className="label bg-[#f28a7270] rounded-xl">
                  <input
                    type="radio"
                    checked={payment === method}
                    onChange={() => setPayment(method)}
                    name="payment-radio"
                    value={method}
                  />
                  <p className="text">{method}</p>
                </label>
              )
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p>Dodatkowe notatki:</p>
          <textarea
            maxLength="100"
            rows="1"
            value={note}
            onChange={handleNoteChange}
            className="text-black text-lg focus:outline-none bg-transparent w-full p-2 rounded-lg text-wrap h-fit resize-none no-scrollbar border-[1px] border-[#f28a72]"
          />
        </div>
        <DatePicker date={date} handleDateChange={handleDateChange} />
        <TimePicker time={time} handleTimeChange={handleTimeChange} />
        <button
          className="text-xl bg-coral p-4 shadow-md rounded-lg w-fit self-center mt-[2rem]"
          onSubmit={handleFormSubmit}
        >
          Zatwierdź
        </button>
      </form>
    </>
  );
}
