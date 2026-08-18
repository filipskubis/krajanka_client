/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { ChevronDown, CirclePlus, ClipboardList, CircleMinus, Trash2 } from "lucide-react";
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
import DatePicker from "./DatePicker";
import { getQuantityStep, normalizeQuantity, updateOrderProductQuantity } from "../helpers/roundQuantity";
import WeightedItemPicker from "./WeightedItemPicker";
Big.DP = 2;
Big.RM = Big.roundHalfUp;

function convertToDateObject(dateStr) {
  const dateObject = dayjs(dateStr, "DD-MM-YYYY");

  return { dateObject };
}

export default function EditForm({ order, close }) {
  const { data: publicForm, error: publicFormError } = useSWR(
    order.formId ? `/forms/public/${order.formId}` : null,
    fetcher,
  );
  const [products, setProducts] = useState(order.products);
  const [productModal, setProductModal] = useState(false);
  const [clientModal, setClientModal] = useState(false);
  const [weightedProductId, setWeightedProductId] = useState(null);

  const [payment, setPayment] = useState(order.paymentMethod || "Przelew/BLIK");
  const [note, setNote] = useState(order.note || "");
  const handleNoteChange = (e) => setNote(e.target.value);
  const [address, setAddress] = useState(order.address);
  const [phone, setPhone] = useState(order.phone);
  const [orderNumber, setOrderNumber] = useState(order.orderNumber);

  const [date, setDate] = useState(null);

  useEffect(() => {
    if (order && order.date) {
      const { dateObject } = convertToDateObject(order.date);
      setDate(dateObject);
    }
  }, [order]);

  const { addAlert } = useContext(AlertContext);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    const productsNoTotal = products.map(({ total, ...rest }) => rest);
    let formattedDate = null;
    if (date) {
      formattedDate = date.format("DD-MM-YYYY");
    }

    const body = {
      address,
      phone,
      products: productsNoTotal,
      paymentMethod: payment,
      note: note || null,
      orderNumber,
      date: formattedDate,
      originalOrderNumber: order.orderNumber,
    };
    try {
      const response = await fetcher(`/orders/edit/${order._id}`, "PUT", body);
      resetForm();
      close();
      window.location.reload();
      addAlert("success", response);
    } catch (err) {
      addAlert("error", err);
    }
  }

  function handleAdd(id) {
    const newProducts = products.map((product) => {
      if (product?.id === id) {
        return updateOrderProductQuantity(product, Number(product.quantity) + getQuantityStep(product.packagingMethod));
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

  const weightedProduct = products.find((product) => product.id === weightedProductId);
  const weightedFormProduct = publicForm?.products?.find(
    (product) => product.id === weightedProduct?.formProductId,
  );

  function replaceWeightedItem(item) {
    if (!weightedProduct || !weightedFormProduct) return;

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== weightedProduct.id) return product;
        return {
          ...product,
          weightedItemId: item.id,
          quantity: Number(item.weight),
          weight: Number(item.weight),
          lineTotal: Number(item.totalPrice),
          selectionMode: "weighted-items",
          packagingMethod: weightedFormProduct.packagingMethod,
        };
      }),
    );
    setWeightedProductId(null);
  }

  function resetForm() {
    setProducts([]);
    setAddress("");
    setPhone("");
    setOrderNumber("");
    setDate(null);
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
      {weightedProduct && weightedFormProduct ? (
        <WeightedItemPicker
          formProduct={weightedFormProduct}
          selectedWeightedItemId={weightedProduct.weightedItemId}
          onChoose={replaceWeightedItem}
          onClose={() => setWeightedProductId(null)}
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
            <div className="hidden">
              <p className="col-span-1">Nazwa:</p>
              <p>Cena:</p>
              <p>Ilość:</p>
              <p>Razem:</p>
            </div>
          ) : null}

          {products.map(
            ({ id, name, price, quantity, packagingMethod, selectionMode }, index) => (
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
                  {selectionMode === "weighted-items" ? (
                    <>
                      <button
                        type="button"
                        aria-label={`Zmień ważoną sztukę: ${name}, ${quantity} ${packagingMethod}`}
                        className="flex items-center gap-2 rounded-md px-1 py-1 text-darkBlue transition-colors hover:bg-[#fff7f5] focus-visible:ring-2 focus-visible:ring-coral disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!publicForm}
                        onClick={() => setWeightedProductId(id)}
                      >
                        {quantity} ({packagingMethod})
                        <ChevronDown className="h-4 w-4 text-coral" aria-hidden="true" />
                      </button>
                      {publicFormError ? (
                        <p className="text-center text-xs text-[#A1221E]">
                          Nie można pobrać dostępnych sztuk.
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                <p className="shrink-0">{`${String(Big(quantity).times(price))} zł`}</p>
                </div>
              </div>
            ),
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
                        Big(0),
                      )
                      .toFixed(2), // Round the final result to 2 decimal places
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
              ),
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
