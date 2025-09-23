import {
  Carrot,
  UsersRound,
  BookOpen,
  Route,
  PackageOpen,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div
      className={`flex h-full flex-col pt-[10%] items-center gap-[2.5rem] w-full h-max bg-[#fbe8a6]`}
    >
      <Link
        to="/produkty"
        className="relative w-[20rem] shadow-lg tablet:w-[28rem] bg-white tablet:mt-[0.25rem] tablet:text-4xl p-5 flex gap-[1.5rem] tablet:gap-[2.5rem] hover:bg-[#303c6c10] rounded-xl items-center text-2xl "
      >
        <Carrot
          color="#303c6c"
          className="w-[2.5rem] h-[2.5rem] tablet:w-[3.5rem] tablet:h-[3.5rem]"
        />
        <p> Produkty </p>
      </Link>
      <Link
        to="/stan"
        className="relative w-[20rem] shadow-lg tablet:w-[28rem] bg-white tablet:text-4xl p-5 flex gap-[1.5rem] hover:bg-[#303c6c10] tablet:gap-[2.5rem] rounded-xl items-center text-2xl "
      >
        <PackageOpen
          color="#303c6c"
          className="w-[2.5rem] h-[2.5rem] tablet:w-[3.5rem] tablet:h-[3.5rem]"
        />
        <p> Stan </p>
      </Link>
      <Link
        to="/klienci"
        className="relative w-[20rem] shadow-lg tablet:w-[28rem] bg-white tablet:text-4xl p-5 flex gap-[1.5rem] hover:bg-[#303c6c10] tablet:gap-[2.5rem] rounded-xl items-center text-2xl "
      >
        <UsersRound
          color="#303c6c"
          className="w-[2.5rem] h-[2.5rem] tablet:w-[3.5rem] tablet:h-[3.5rem]"
        />
        <p> Klienci </p>
      </Link>

      <Link
        to="/zamówienia"
        className="relative w-[20rem] shadow-lg tablet:w-[28rem] bg-white tablet:text-4xl p-5 flex gap-[1.5rem] hover:bg-[#303c6c10] tablet:gap-[2.5rem] rounded-xl items-center text-2xl "
      >
        <BookOpen
          color="#303c6c"
          className="w-[2.5rem] h-[2.5rem] tablet:w-[3.5rem] tablet:h-[3.5rem]"
        />
        <p> Zamówienia </p>
      </Link>
      <Link
        to="/trasy"
        className="relative w-[20rem] shadow-lg tablet:w-[28rem] bg-white tablet:text-4xl p-5 flex gap-[1.5rem] hover:bg-[#303c6c10] tablet:gap-[2.5rem] rounded-xl items-center text-2xl "
      >
        <Route
          color="#303c6c"
          className="w-[2.5rem] h-[2.5rem] tablet:w-[3.5rem] tablet:h-[3.5rem]"
        />
        <p> Trasy </p>
      </Link>
      <Link
        to="/formularze"
        className="relative w-[20rem] shadow-lg tablet:w-[28rem] bg-white tablet:text-4xl p-5 flex gap-[1.5rem] hover:bg-[#303c6c10] tablet:gap-[2.5rem] rounded-xl items-center text-2xl "
      >
        <Star
          color="#303c6c"
          className="w-[2.5rem] h-[2.5rem] tablet:w-[3.5rem] tablet:h-[3.5rem]"
        />
        <p> Formularze </p>
      </Link>
    </div>
  );
}
