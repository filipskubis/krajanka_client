import Big from "big.js";

export default function roundQuantity(value) {
  return Number(Number(value).toFixed(1));
}

export function updateOrderProductQuantity(product, value) {
  const quantity = roundQuantity(value);
  const updatedProduct = { ...product, quantity };

  if (product.selectionMode !== "weighted-items") return updatedProduct;

  return {
    ...updatedProduct,
    weight: quantity,
    lineTotal: Number(Big(quantity).times(product.price).toFixed(2)),
  };
}
