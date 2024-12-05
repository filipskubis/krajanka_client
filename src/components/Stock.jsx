import fetcher from "../helpers/fetcher";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
export default function Stock() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    async function getProducts() {
      const products = await fetcher("/products/get");
      setProducts(products);
    }
    getProducts();
  }, []);
  if (!products) return <Spinner />;

  return (
    <div className="w-full h-full bg-white p-4">
      {" "}
      <div className="flex flex-col gap-4 items-center sticky">
        <div className="grid grid-cols-3 w-full border-b-2 p-2 mb-4">
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
        {products.map(({ _id, note = null, name }) => {
          if (
            note !== null &&
            note !== "" &&
            (note.stock !== "" || note.ordered !== "" || note.toOrder !== "")
          ) {
            return (
              <div key={_id} className="grid grid-cols-3 gap-2 w-full">
                <div className="col-start-1 col-end-4 text-center text-coral">
                  {" "}
                  {name}{" "}
                </div>
                <div className="col-start-1 col-end-2 w-full flex justify-center border-b-[1px]">
                  {" "}
                  {note?.stock}
                </div>
                <div className="col-start-2 col-end-3 w-full flex justify-center border-b-[1px]">
                  {" "}
                  {note?.ordered}
                </div>
                <div className="col-start-3 col-end-4  w-full flex justify-center border-b-[1px]">
                  {" "}
                  {note?.toOrder}
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
