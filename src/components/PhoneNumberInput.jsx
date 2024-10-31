/* eslint-disable react/prop-types */
export default function PhoneNumberInput({ value = '', change }) {
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters from the input
    const cleanedValue = value.replace(/\D/g, '').slice(0, 9);

    // Group the numbers into chunks of 3 and separate with spaces or dashes
    const formattedValue = cleanedValue.replace(/(\d{3})(?=\d)/g, '$1 ');

    return formattedValue.trim();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    change(formattedValue);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="phone">Numer telefonu:</label>
      <input
        type="text"
        id="phone"
        required
        value={value}
        onChange={handleInputChange}
        className="p-1 w-[7rem] rounded-lg focus:outline-none border-[1px] border-[#CCCCCC] text-center"
      />
    </div>
  );
}
