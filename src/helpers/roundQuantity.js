import Big from "big.js";

export default function roundQuantity(value) {
  return Number(Number(value).toFixed(1));
}

export function getQuantityStep(packagingMethod) {
  return packagingMethod === "kg" ? 0.1 : 1;
}

export function normalizeQuantity(value, packagingMethod) {
  const quantity = Number(value);
  return packagingMethod === "kg" ? roundQuantity(quantity) : Math.round(quantity);
}

export function updateOrderProductQuantity(product, value) {
  const quantity = normalizeQuantity(value, product.packagingMethod);
  const updatedProduct = { ...product, quantity };

  if (product.selectionMode !== "weighted-items") return updatedProduct;

  return {
    ...updatedProduct,
    weight: quantity,
    lineTotal: Number(Big(quantity).times(product.price).toFixed(2)),
  };
}
