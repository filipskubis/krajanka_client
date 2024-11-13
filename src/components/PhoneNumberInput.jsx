import { useRef, useEffect } from "react";

/* eslint-disable react/prop-types */
export default function PhoneNumberInput({ value = "", change }) {
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    change(value);
    adjustTextareaSize();
  };

  // Adjust the textarea width and height dynamically
  const adjustTextareaSize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.width = "auto"; // Reset width to recalculate

      // Set width to fit content up to a maximum
      const maxWidth = window.innerWidth * 0.8;
      const contentWidth = textareaRef.current.scrollWidth + 10; // Add some padding
      textareaRef.current.style.width = `${Math.min(contentWidth, maxWidth)}px`;

      // Set height to fit content as it grows vertically
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Adjust size on initial render and whenever value changes
  useEffect(() => {
    adjustTextareaSize();
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="phone">Kontakt:</label>
      <textarea
        id="phone"
        required
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleInputChange}
        className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC] text-center resize-none"
        style={{
          minWidth: "7rem", // Set a minimum width
          maxWidth: "80vw", // Prevents exceeding viewport width
          overflow: "hidden", // Prevents scrollbar from appearing
        }}
      />
    </div>
  );
}
