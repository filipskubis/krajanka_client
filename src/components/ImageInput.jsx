/* eslint-disable react/prop-types */
import { Image } from 'lucide-react';
export default function ImageInput({ label, file, setFile }) {
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
    }
  };

  return (
    <>
      <input
        type="file"
        id="file"
        className="file-input hidden"
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file"
        className="bg-blue-500 text-black rounded-lg cursor-pointer hover:bg-blue-600 "
      >
        <div className="flex flex-col justify-center items-start gap-1">
          <p> {label} </p>
          {file ? (
            <img
              src={file}
              className="w-[100px] h-[100px] rounded-lg object-cover border-2 border-slate"
            />
          ) : (
            <Image color="#6b7a8f" width={'40px'} height={'auto'} />
          )}
        </div>
      </label>
    </>
  );
}
