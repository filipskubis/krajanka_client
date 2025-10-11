/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";
import Product from "./Product";
import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import NewProductForm from "./NewProductForm";
import Spinner from "./Spinner.jsx";
import { useLocation } from "react-router-dom";
export default function Products() {
  const { data, error, isLoading } = useSWR("/products/get");
  const location = useLocation();
  const { productId } = location.state || {};

  const [products, setProducts] = useState([]);
  const [formActive, setFormActive] = useState(false);
  function handleAddProduct(name, price, image, packaging, seasonal, favorite) {
    setFormActive(false);
    const body = { name, price, image, packaging, seasonal, favorite };

    try {
      fetcher("/products/add", "POST", body);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (data !== undefined) {
      setProducts(data);
    }
  }, [data]);

  // Handle scroll to product after component renders
  useEffect(() => {
    if (productId && products.length > 0) {
      // Use setTimeout to ensure the DOM is fully updated
      const timer = setTimeout(() => {
        const element = document.getElementById(productId);
        if (element) {
          console.log("Scrolling to product:", productId);
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [productId, products]);

  if (isLoading) return <Spinner />;
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
          <CirclePlus color="#303c6c" width={"2rem"} height={"auto"} />
          <p className="text-xl tablet:text-2xl">Dodaj produkt</p>
        </button>
      )}
      <div className="flex flex-col gap-4 tablet:grid tablet:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] tablet:justify-items-center">
        {products.map(
          ({ _id, name, price, packagingMethod, image, favorite }) => (
            <Product
              key={_id}
              uniqueId={_id}
              initName={name}
              initPrice={price}
              initFavorite={favorite}
              packaging={packagingMethod}
              src={image}
            />
          )
        )}
      </div>
    </div>
  );
}
