/* eslint-disable react/prop-types */
import { X } from 'lucide-react';
export default function Alert({ type = 'info', message, handleClick }) {
  const getAlertStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          container:
            'bg-[#4CAF50] border-l-4 border-[#0B5C2E] text-[#F4FFF8] p-3 pt-4 pb-4 rounded-lg flex items-center transition duration-300 ease-in-out alertAnimation',
          icon: 'h-5 w-5 flex-shrink-0 mr-2',
          iconColor: '#0B5C2E', // Darker green
          textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
        };
      case 'warning':
        return {
          container:
            'bg-[#FF9801] border-l-4 border-[#B97400] text-[#FFF9E8] p-3 pt-4 pb-4 rounded-lg flex items-center transition duration-300 ease-in-out alertAnimation',
          icon: 'h-5 w-5 flex-shrink-0 mr-2',
          iconColor: '#B97400', // Darker orange
          textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
        };
      case 'error':
        return {
          container:
            'bg-[#F44336] border-l-4 border-[#A1221E] text-[#FFEBEB] p-3 pt-4 pb-4 rounded-lg flex items-center transition duration-300 ease-in-out alertAnimation',
          icon: 'h-5 w-5 flex-shrink-0 mr-2',
          iconColor: '#A1221E', // Darker red
          textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
        };
      case 'info':
      default:
        return {
          container:
            'bg-[#2196F3] border-l-4 border-[#174A7A] text-[#F0F9FF] p-3 pt-4 pb-4 rounded-lg flex items-center transition duration-300 ease-in-out alertAnimation',
          icon: 'h-5 w-5 flex-shrink-0 mr-2',
          iconColor: '#174A7A', // Darker blue
          textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
        };
    }
  };

  const styles = getAlertStyles(type);
  return (
    <div role="alert" className={styles.container}>
      <svg
        stroke={styles.iconColor}
        viewBox="0 0 24 24"
        fill="none"
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p
        className="text-sm font-semibold"
        style={{
          color: 'inherit',
        }}
      >
        {message}
      </p>
      <button className="absolute right-[1rem]" onClick={handleClick}>
        <X color="#3e3e40"></X>
      </button>
    </div>
  );
}
