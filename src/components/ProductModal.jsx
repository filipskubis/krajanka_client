/* eslint-disable react/prop-types */
import { X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
// import Spinner from './Spinner';
export default function ProductModal({
  data,
  setProductModal,
  handleAddProduct,
}) {
  const modalRef = useRef(null);
  const [currentProduct, setCurrentProduct] = useState('');
  function handleChange(e) {
    const name = e.target.value;
    const product = data.find((product) => product.name === name);
    setCurrentProduct(product);
  }
  useEffect(() => {
    function closeFunction(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setProductModal(false);
      }
    }
    window.addEventListener('click', closeFunction);

    return () => {
      window.removeEventListener('click', closeFunction);
    };
  }, [setProductModal]);

  return (
    <div className="absolute flex inset-0 justify-center pt-[30%] w-screen h-screen">
      <div className="fixed w-[9999px] h-[9999px] top-0 left-0 backdrop-blur-sm z-[9998]"></div>
      <form
        className="relative w-[80vw] h-[35vh] bg-white shadow-xl border-[1px] border-darkcoral rounded-lg z-[9999] p-4 pt-8 flex flex-col gap-4"
        onSubmit={handleAddProduct}
        ref={modalRef}
      >
        <button
          className="absolute right-2 top-2"
          onClick={() => {
            setProductModal(false);
          }}
        >
          <X />
        </button>
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="productSelect" className="text-lg">
            {' '}
            Produkt:{' '}
          </label>
          <select
            name="productSelect"
            id="productSelect"
            onChange={handleChange}
            required
            className="w-min p-2 border-[1px] border-[#CCCCCC]"
          >
            <option value=""> - Wybierz z listy -</option>
            <optgroup label="Stała oferta" className="text-coral">
              {data
                .filter((product) => !product.seasonal)
                .map(({ name }, index) => (
                  <option value={name} key={`regular-${index}`}>
                    {name}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Sezonowe" className="text-coral">
              {data
                .filter((product) => product.seasonal)
                .map(({ name }, index) => (
                  <option value={name} key={`seasonal-${index}`}>
                    {name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="quantity" className="text-lg">
            {' '}
            Ilość: {currentProduct ? `(${currentProduct.packagingMethod})` : ''}
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            defaultValue={1}
            step="0.01"
            required
            className="w-[100px] border-[1px] border-[#CCCCCC] p-1"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <button className="w-full flex justify-center items-center  h-[50px] bg-[#f28a7280]">
            Dodaj
          </button>
        </div>
      </form>
    </div>
  );
}
