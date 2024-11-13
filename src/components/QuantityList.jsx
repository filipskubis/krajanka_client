/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import fetcher from "../helpers/fetcher";
import Spinner from "./Spinner";

export default function QuantityList({ aggregatedProducts, routeID }) {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const { data } = useSWR("/products/get", fetcher);

  const [quantities, setQuantities] = useState([]);
  const initialized = useRef(false);
  useEffect(() => {
    const fetchOrInitializeQuantityList = async () => {
      if (initialized.current) return;

      try {
        const quantityList = await fetcher(
          `/routes/getQuantityList/${routeID}`,
          "GET"
        );
        if (quantityList.length > 0) {
          setQuantities(quantityList);
        } else {
          const newQuantities = aggregatedProducts.map(
            ({ name, quantities }) => ({
              productName: name,
              quantities: quantities.map((quantity) =>
                typeof quantity === "object"
                  ? quantity
                  : { value: quantity, packed: false }
              ),
            })
          );

          setQuantities(newQuantities);
        }
        initialized.current = true;
      } catch (error) {
        console.error("Error fetching or initializing quantity list:", error);
      }
    };

    fetchOrInitializeQuantityList();
  }, [aggregatedProducts, routeID]);

  useEffect(() => {
    return () => {
      const saveQuantityList = async () => {
        try {
          const body = { quantityList: quantities };
          await fetcher(`/routes/updateQuantityList/${routeID}`, "POST", body);
        } catch (error) {
          console.error("Error updating quantity list:", error);
        }
      };

      saveQuantityList();
    };
  }, [quantities, routeID]);

  const toggleProduct = (name) => {
    setExpandedProduct(expandedProduct === name ? null : name);
  };

  // Get the packaging method for a specific product
  const getPackagingMethod = (name) => {
    const product = data?.find((item) => item.name === name);
    return product ? product.packagingMethod : "";
  };

  if (!quantities) return <Spinner />;
  return (
    <div className="flex flex-col gap-4">
      {quantities.map(
        ({ productName, quantities: productQuantities }, productIndex) => {
          const packagingMethod = getPackagingMethod(productName);

          return (
            <div key={productName} className="border rounded-md text-black">
              <button
                className="w-full p-4 text-left font-bold border-[#f28a92]"
                onClick={() => toggleProduct(productName)}
              >
                {productName}
              </button>
              {expandedProduct === productName && (
                <div className="p-4 bg-gray-100 text-[#000000] expand">
                  {packagingMethod !== "kg" && packagingMethod !== "sztuki" && (
                    <p className="text-md font-semibold text-gray-600 mb-4 -mt-4">
                      Sposób pakowania: {packagingMethod}
                    </p>
                  )}
                  <p className="text-md font-semibold text-gray-600 mb-4">
                    Łącznie:{" "}
                    {productQuantities.reduce((current, quantity) => {
                      return current + Number(quantity.value); // Convert to number
                    }, 0)}{" "}
                    {packagingMethod === "kg" ? packagingMethod : null}
                  </p>
                  <ul className="grid grid-cols-3 gap-2 mt-2">
                    {productQuantities.map((quantityObj, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="checkbox-wrapper-46 flex flex-col gap-2">
                          <input
                            type="checkbox"
                            id={`cbx-${productName}-${index}`}
                            className="inp-cbx"
                            checked={quantityObj.packed}
                            onChange={() => {
                              const newQuantities = [...quantities];
                              newQuantities[productIndex].quantities[index] = {
                                ...quantityObj,
                                packed: !quantityObj.packed,
                              };
                              setQuantities(newQuantities);
                            }}
                          />
                          <label
                            htmlFor={`cbx-${productName}-${index}`}
                            className="cbx"
                          >
                            <span>
                              <svg
                                viewBox="0 0 12 10"
                                height="13px"
                                width="15px"
                              >
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                              </svg>
                            </span>
                          </label>
                        </div>
                        <span>
                          {quantityObj.value}
                          {packagingMethod === "kg" && (
                            <span className="text-md text-gray-500 ml-1">
                              kg
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}
