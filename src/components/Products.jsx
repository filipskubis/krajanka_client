/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { CirclePlus } from 'lucide-react';
import Product from './Product';
import useSWR from 'swr';
import fetcher from '../helpers/fetcher';
import NewProductForm from './NewProductForm';
export default function Products() {
  const { data, error, isLoading } = useSWR('/products/get', fetcher);

  const [products, setProducts] = useState([]);
  const [formActive, setFormActive] = useState(false);

  function handleAddProduct(name, price, image, packaging, seasonal) {
    setFormActive(false);
    const body = { name, price, image, packaging, seasonal };

    try {
      fetcher('/products/add', 'POST', body);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (data != undefined) {
      setProducts(data);
    }
  }, [data]);
  if (isLoading) return;
  return (
    <div className="w-full box-border flex flex-col gap-4 p-4 no-scrollbar overflow-y-auto">
      {formActive ? (
        <NewProductForm
          handleAddProduct={handleAddProduct}
          setFormActive={setFormActive}
        />
      ) : (
        <button
          className="flex w-full items-center justify-center gap-4 bg-[#f28a72] p-3 shadow-md rounded-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFormActive(true);
          }}
        >
          <CirclePlus color="#303c6c" width={'2rem'} height={'auto'} />
          <p className="text-xl tablet:text-2xl">Dodaj produkt</p>
        </button>
      )}
      <div className="flex flex-col gap-4 tablet:grid tablet:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] tablet:justify-items-center">
        {products.map(({ _id, name, price, packagingMethod, image }) => (
          <Product
            key={_id}
            uniqueId={_id}
            name={name}
            initPrice={price}
            packaging={packagingMethod}
            src={image}
          />
        ))}
      </div>
    </div>
  );
}
