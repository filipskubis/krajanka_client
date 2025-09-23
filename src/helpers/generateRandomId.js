export default function generateRandomId() {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 6);

  return timestamp + randomChars;
}
