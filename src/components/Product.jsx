/* eslint-disable react/prop-types */
import { Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect, useContext } from "react";
import fetcher from "../helpers/fetcher";
import { AlertContext } from "../misc/AlertContext.jsx";
import Confirm from "./Confirm.jsx";
import { Link } from "react-router-dom";
import Star from "./Star.jsx";
export default function Product({
  uniqueId,
  initName,
  src,
  initPrice,
  packaging,
  initFavorite,
}) {
  const { addAlert } = useContext(AlertContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const inputRef = useRef();
  const input2Ref = useRef();
  const [price, setPrice] = useState(initPrice);
  const [name, setName] = useState(initName);
  const formRef = useRef(null);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [favorite, setFavorite] = useState(initFavorite);
  const [disabled, setDisabled] = useState(false);
  async function toggleFavorite() {
    if (disabled) return;
    const newValue = !favorite;
    setFavorite(() => newValue);
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 500);
    try {
      fetcher(`/products/updateFavorite/${uniqueId}`, "POST", {
        favorite: newValue,
      });
    } catch (err) {
      setFavorite((prev) => !prev);
    }
  }

  useEffect(() => {
    if (isEditMode) {
      input2Ref.current.focus();
    }
  }, [isEditMode]);

  async function removeProduct() {
    try {
      const response = await fetcher(`/products/delete/${uniqueId}`, "POST");
      addAlert("success", response);
    } catch (err) {
      addAlert("error", err.message);
    }
    window.location.reload();
  }

  async function handleEditSubmit(e = null) {
    if (e) e.preventDefault();
    if (price === initPrice && name === initName) return;
    if (e) return;
    const body = { price: price, name: name };
    try {
      const response = await fetcher(`/products/edit/${uniqueId}`, "PUT", body);
      addAlert("success", response);
    } catch (err) {
      addAlert("error", err.message);
    }
    setIsEditMode(false);
  }
  return (
    <Link
      key={uniqueId}
      id={uniqueId}
      to={`/product/${uniqueId}`}
      className={`relative flex flex-col gap-2 items-center justify-end min-h-[120px] border-2 border-[#6b7a8f] p-2 pt-[3rem] bg-white rounded-md tablet:w-full`}
    >
      <Star
        checked={favorite}
        disabled={disabled}
        toggleChecked={toggleFavorite}
        className="absolute left-[0.5rem] top-[0.5rem]"
      ></Star>
      {isBeingDeleted ? (
        <Confirm
          action="Usuń produkt"
          description="Czy na pewno chcesz usunąć produkt? Ta czynność jest nieodwracalna."
          cancel={() => {
            setIsBeingDeleted(false);
          }}
          confirm={removeProduct}
        />
      ) : null}
      {isEditMode ? (
        <div
          className="bg-[#E74D4D] border-[2px] border-[#E74D4D] rounded-lg p-1 self-end absolute right-[0.5rem] top-[0.5rem]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsBeingDeleted(true);
          }}
        >
          <Trash2 color="white" width={"20px"} height={"auto"} />
        </div>
      ) : null}
      <div
        className="border-[2px] border-black rounded-lg p-1 absolute bottom-[0.5rem] right-[0.5rem] hover:bg-[#00000010]"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (isEditMode) {
            handleEditSubmit();
          }

          setIsEditMode(!isEditMode);
        }}
      >
        <Pencil width={"20px"} height={"auto"} />
      </div>
      {src ? (
        <img
          src={src}
          className="h-[150px] w-auto object-cover"
          referrerPolicy="no-referrer"
        />
      ) : null}

      {isEditMode ? (
        <form
          className="flex flex-col items-center gap-2"
          ref={formRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <input
            ref={input2Ref}
            type="text"
            className="min-w-[5rem] text-xl font-bold text-center"
            value={name}
            onChange={(e) => {
              let value = e.target.value;
              setName(value);
            }}
          />
          <div className="text-lg flex gap-1" onSubmit={handleEditSubmit}>
            <div className="relative flex">
              <input
                ref={inputRef}
                type="number"
                className="w-[5rem]"
                value={price}
                step="0.1"
                onChange={(e) => {
                  let value = e.target.value;

                  if (value.includes(".")) {
                    const [integerPart, decimalPart] = value.split(".");
                    if (decimalPart.length > 2) {
                      value = `${integerPart}.${decimalPart.slice(0, 2)}`;
                    }
                  } else {
                    if (value.length > 3) {
                      value = value.slice(0, 3);
                    }
                  }

                  setPrice(value);
                }}
              />
              <p className="absolute right-[0.25rem]">PLN</p>
            </div>

            <p> /</p>
            <p> {packaging} </p>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-bold text-center">{name}</p>
          <div className="text-lg">
            {price < 1 ? (
              <p>
                {price * 100} groszy / {packaging}
              </p>
            ) : (
              <p>
                {price} PLN / {packaging}
              </p>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}
