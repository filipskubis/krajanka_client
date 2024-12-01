import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import fetcher from "../helpers/fetcher";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

export default function ProductNotes() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const textarea = useRef(null);
  const [note, setNote] = useState("");
  const noteRef = useRef();

  useEffect(() => {
    noteRef.current = note;
  }, [note]);

  const handleTextareaChange = (e) => {
    setNote(e.target.value);
  };
  useEffect(() => {
    if (product) {
      setNote(product.note || "");
    }
  }, [product]);

  useEffect(() => {
    async function fetchProduct() {
      const fetchedProduct = await fetcher(`/products/get/${id}`);
      if (!fetchedProduct) return;
      setProduct(fetchedProduct);
    }

    fetchProduct();

    return () => {
      fetcher(`/products/updateNotes/${id}`, "POST", { note: noteRef.current });
    };
  }, []);

  useEffect(() => {
    if (textarea.current) {
      textarea.current.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
      });
    }
  }, [textarea]);

  if (!product) return <Spinner />;

  return (
    <div className="w-full h-fit p-4">
      <div className="bg-white w-full h-full rounded-lg flex flex-col items-center p-4 gap-4">
        <h1 className="text-2xl"> {product.name} </h1>
        <textarea
          rows="10"
          value={note}
          onChange={handleTextareaChange}
          ref={textarea}
          className="text-black text-lg focus:outline-none bg-transparent w-full p-2 rounded-lg text-wrap h-fit resize-none no-scrollbar border-[1px] border-[#00000050]"
        />
        <Link
          to="/produkty"
          className="w-fit p-2 flex justify-start items-center h-fit border-[1px] border-[#00000050] rounded-lg self-start"
        >
          <ArrowLeft className="w-[2.5rem] h-auto" />
        </Link>
      </div>
    </div>
  );
}
