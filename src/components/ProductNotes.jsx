import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import fetcher from "../helpers/fetcher";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

export default function ProductNotes() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [note, setNote] = useState({ stock: "", toOrder: "" });
  const noteRef = useRef();

  useEffect(() => {
    noteRef.current = note;
  }, [note]);

  useEffect(() => {
    if (product?.note) {
      setNote({
        stock: product.note.stock || "",
        toOrder: product.note.toOrder || "",
      });
    } else {
      setNote({
        stock: "",
        toOrder: "",
      });
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

  if (!product) return <Spinner />;

  return (
    <div className="w-full h-fit p-4">
      <div className="bg-white w-full h-full rounded-lg flex flex-col items-center p-4 gap-6">
        <h1 className="text-2xl"> {product.name} </h1>
        <label htmlFor="stock"> Na stanie: </label>
        <div className="relative flex">
          <input
            type="text"
            id="stock"
            className="border-[1px] border-black rounded-lg text-lg p-1"
            value={note.stock}
            onChange={(e) => {
              setNote({ ...note, stock: e.target.value });
            }}
          />
          <div className="absolute right-2 h-full flex items-center">
            {" "}
            {["główki", "kg", "sztuki", "wiązki"].includes(
              product.packagingMethod
            ) && product.packagingMethod}
          </div>
        </div>
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
