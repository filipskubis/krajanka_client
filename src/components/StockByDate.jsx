/* eslint-disable react/prop-types */
import useSWR from "swr";

import Spinner from "./Spinner";
export default function StockByDate({ date, products }) {
  const { data: productTotals } = useSWR(`/products/getProductTotals/${date}`);

  if (!productTotals) return <Spinner />;
  return products.map(({ _id, note = null, name, packagingMethod }) => {
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
            {productTotals[name] > 0 && productTotals[name]}{" "}
            {productTotals[name] > 0 &&
              packagingMethod === "kg" &&
              packagingMethod}
          </div>
          <div className="col-start-3 col-end-4  w-full flex justify-center border-b-[1px]">
            {" "}
            {note?.stock - productTotals[name] < 0
              ? Math.abs(note?.stock - productTotals[name])
              : null}{" "}
            {note?.stock - productTotals[name] < 0 &&
              packagingMethod === "kg" &&
              packagingMethod}
          </div>
        </div>
      );
    }
    return null;
  });
}
