/* eslint-disable react/prop-types */
import { Pencil, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect, useContext } from 'react';
import fetcher from '../helpers/fetcher';
import { AlertContext } from '../misc/AlertContext.jsx';
import Confirm from './Confirm.jsx';

export default function Product({ uniqueId, name, src, initPrice, packaging }) {
  const { addAlert } = useContext(AlertContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const inputRef = useRef();
  const [price, setPrice] = useState(initPrice);
  const formRef = useRef(null);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  useEffect(() => {
    if (isEditMode) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  async function removeProduct() {
    try {
      const response = await fetcher(`/products/delete/${uniqueId}`, 'POST');
      addAlert('success', response);
    } catch (err) {
      addAlert('error', err.message);
    }
    window.location.reload();
  }

  async function handleEditSubmit(e = null) {
    if (e) e.preventDefault();
    if (price === initPrice) return;
    const body = { price: price };
    try {
      const response = await fetcher(`/products/edit/${uniqueId}`, 'PUT', body);
      addAlert('success', response);
    } catch (err) {
      addAlert('error', err.message);
    }
    setIsEditMode(false);
  }
  return (
    <div
      key={uniqueId}
      className="relative flex flex-col gap-2 items-center justify-end min-h-[250px] border-2 border-[#6b7a8f] p-2 bg-white rounded-md tablet:w-full"
    >
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
          <Trash2 color="white" width={'20px'} height={'auto'} />
        </div>
      ) : null}
      <div
        className="border-[2px] border-black rounded-lg p-1 absolute bottom-[0.5rem] right-[0.5rem] hover:bg-[#00000010]"
        onClick={() => {
          if (isEditMode) {
            handleEditSubmit();
          }

          setIsEditMode(!isEditMode);
        }}
      >
        <Pencil width={'20px'} height={'auto'} />
      </div>
      {src != null && (
        <img
          src={src}
          className="h-[150px] w-auto object-cover"
          referrerPolicy="no-referrer"
        />
      )}
      <p className="text-xl font-bold text-center">{name}</p>
      {isEditMode ? (
        <form
          className="text-lg flex gap-1"
          ref={formRef}
          onSubmit={handleEditSubmit}
        >
          <div className="relative flex">
            <input
              ref={inputRef}
              type="number"
              className="w-[5rem]"
              value={price}
              step="0.1"
              onChange={(e) => {
                let value = e.target.value;

                if (value.includes('.')) {
                  const [integerPart, decimalPart] = value.split('.');
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
        </form>
      ) : (
        <p className="text-lg">
          {price < 1 ? (
            <p>
              {price * 100} groszy / {packaging}
            </p>
          ) : (
            <p>
              {price} PLN / {packaging}
            </p>
          )}
        </p>
      )}
    </div>
  );
}
