import fetcher from "../helpers/fetcher";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
export default function Stock() {
  const [products, setProducts] = useState(null);
  const [productTotals, setProductTotals] = useState(null);

  useEffect(() => {
    async function getData() {
      const products = await fetcher("/products/get");
      setProducts(products);
      const productTotals = await fetcher("/products/getProductTotals");
      setProductTotals(productTotals);
    }
    getData();
  }, []);
  if (!products || !productTotals) return <Spinner />;

  return (
    <div className="w-full h-full bg-white p-4 relative">
      {" "}
      <div className="flex flex-col gap-4 items-center pb-4">
        <div className="grid grid-cols-3 w-full border-b-2 p-2 mb-4 sticky top-0 left-0 bg-white z-[999999]">
          <div className="col-start-1 col-end-2 w-full flex justify-center">
            Na stanie
          </div>
          <div className="col-start-2 col-end-3 w-full flex justify-center">
            Zamówione
          </div>
          <div className="col-start-3 col-end-4 w-full flex justify-center">
            Zamówić
          </div>
        </div>
        {products.map(({ _id, note = null, name, packagingMethod }) => {
          if (
            note.stock !== "" ||
            (productTotals[name] && productTotals[name] !== 0) ||
            note.toOrder !== ""
          ) {
            return (
              <div key={_id} className="grid grid-cols-3 gap-2 w-full">
                <div className="col-start-1 col-end-4 text-center text-coral text-lg">
                  {" "}
                  {name}{" "}
                </div>
                <div className="col-start-1 col-end-2 w-full flex justify-center border-b-[1px]">
                  {" "}
                  {note?.stock}{" "}
                  {note?.stock && packagingMethod === "kg" && packagingMethod}
                </div>
                <div className="col-start-2 col-end-3 w-full flex justify-center border-b-[1px]">
                  {" "}
                  {productTotals[name] !== 0 && productTotals[name]}{" "}
                  {productTotals[name] !== 0 &&
                    packagingMethod === "kg" &&
                    packagingMethod}
                </div>
                <div className="col-start-3 col-end-4  w-full flex justify-center border-b-[1px]">
                  {" "}
                  {note?.toOrder}{" "}
                  {note?.toOrder && packagingMethod === "kg" && packagingMethod}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
