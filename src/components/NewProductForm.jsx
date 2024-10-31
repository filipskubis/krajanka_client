/* eslint-disable react/prop-types */
import ImageInput from './ImageInput';
import DropdownMenu from './DropdownMenu';
import { X } from 'lucide-react';
import { useState } from 'react';
export default function NewProductForm({ handleAddProduct, setFormActive }) {
  const [selectedOption, setSelectedOption] = useState('kg');
  const [file, setFile] = useState(null);
  function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.querySelector('#productName').value;
    const price = document.querySelector('#price').value;
    const image = file ? file : null;
    const packaging = selectedOption;
    const seasonal = document.querySelector('#cbx-46').checked;
    handleAddProduct(name, price, image, packaging, seasonal);
  }
  return (
    <form
      className="w-full flex justify-center fadeIn"
      onSubmit={handleFormSubmit}
    >
      <div className="relative w-[80%] flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
        <button
          className="absolute top-[0.5rem] right-[0.5rem]"
          onClick={() => {
            setFormActive(false);
          }}
        >
          <X color="#00000070" />
        </button>
        <div className="flex flex-col gap-1">
          <label htmlFor="productName"> Nazwa: </label>
          <input
            type="text"
            required
            id="productName"
            className="p-1 rounded-lg focus:outline-none border-[2px] border-slate"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="price"> Cena: </label>
          <input
            type="number"
            required
            id="price"
            className="p-1 rounded-lg focus:outline-none border-[2px] border-slate"
          />
        </div>
        <div className="flex flex-col gap-1">
          <ImageInput
            label={'Zdjęcie (opcjonalnie): '}
            file={file}
            setFile={setFile}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="checkbox-wrapper-46 flex flex-col gap-2">
            <span>Sezonowe: </span>
            <input type="checkbox" id="cbx-46" className="inp-cbx" />
            <label htmlFor="cbx-46" className="cbx">
              <span>
                <svg viewBox="0 0 12 10" height="13px" width="15px">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg>
              </span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dropdownMenu"> Sposób pakowania: </label>
          <DropdownMenu
            options={[
              'sztuki',
              'kg',
              'wiązki',
              'główka',
              'słoik 0.9l',
              'butelka 0.5l',
              'butelka 1l',
              'paczka',
              'porcja',
              'pęczek',
            ]}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>
        <button className="border-[1px] rounded-full bg-[#00000020] p-2 active:scale-[101%]">
          {' '}
          Dodaj{' '}
        </button>
      </div>
    </form>
  );
}
