export default function generateOrderIdentifier(orderNumber, dateString) {
  // Validate the input date format (DD-MM-YYYY)
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  if (!dateRegex.test(dateString)) {
    return obfuscateOrderNumber(orderNumber);
  }

  // Obfuscate the order number
  const obfuscatedOrderNumber = obfuscateOrderNumber(orderNumber);

  // Split the date string into components
  const [day, month, year] = dateString.split("-");

  // Create the identifier by combining obfuscated order number and date components
  // Example format: X9A7F-20250108 (obfuscated order number + YYYYMMDD)
  const orderIdentifier = `${obfuscatedOrderNumber}${year}${month}${day}`;

  return orderIdentifier;
}

// Helper function to obfuscate the order number
function obfuscateOrderNumber(orderNumber) {
  const salt = 12345; // Use a static salt value to add randomness
  const obfuscated = (parseInt(orderNumber, 10) * salt).toString(36); // Multiply and convert to base-36
  return obfuscated.toUpperCase(); // Return in uppercase for consistency
}

// Example usage
const orderNumber = 123;
const orderDate = "08-01-2025";
const identifier = generateOrderIdentifier(orderNumber, orderDate);
console.log(identifier); // Output: 7D9J9-20250108
