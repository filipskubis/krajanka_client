// import { useState } from "react"
import {
  AlignJustify,
  CirclePlus,
  Carrot,
  UsersRound,
  BookOpen,
  ArrowLeft,
  Route,
  PackageOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }

    return () => {
      document.body.style.overflowY = "";
    };
  }, [open]);

  return (
    <div
      className={`dontPrint w-full h-[3.5rem] flex justify-start items-center p-4 border-b-[1px] border-[#303c6c50]`}
    >
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        <AlignJustify color="#303c6c" width="2rem" height="2rem" />
      </button>
      <div
        className={`flex h-full flex-col items-start pl-4 pt-16 gap-[2.5rem] ${
          open ? "translate-x-[0]" : "translate-x-[-100%]"
        } absolute left-0 top-0 w-[20rem] tablet:w-[24rem] pr-4 bg-[#f9f9f9] transition-transform duration-200 z-[9999]`}
      >
        <button
          className="absolute top-[1rem] left-[1rem] "
          onClick={() => {
            setOpen(false);
          }}
        >
          <ArrowLeft
            color="#303c6c"
            className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem] "
          />
        </button>
        <Link
          to="/produkty"
          onClick={() => {
            setOpen(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:mt-[0.25rem] tablet:text-2xl p-4 flex gap-[1.5rem] hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.125rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
        >
          <Carrot
            color="#303c6c"
            className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
          />
          <p> Produkty </p>
        </Link>

        <Link
          to="/stan"
          onClick={() => {
            setOpen(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:text-2xl p-4 flex gap-[1.5rem] hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.125rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
        >
          <PackageOpen
            color="#303c6c"
            className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
          />
          <p> Stan </p>
        </Link>
        <Link
          to="/klienci"
          onClick={() => {
            setOpen(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:text-2xl p-4 flex gap-[1.5rem] hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.125rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
        >
          <UsersRound
            color="#303c6c"
            className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
          />
          <p> Klienci </p>
        </Link>
        <Link
          to="/zamówienia"
          onClick={() => {
            setOpen(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:text-2xl p-4 flex  justify-between hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.125rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
        >
          <div className="flex gap-[1.5rem] items-center">
            <BookOpen
              color="#303c6c"
              className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
            />
            <p> Zamówienia </p>
          </div>
          <Link
            to="/formularzZamówienia"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <CirclePlus
              color="#303c6c"
              className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
            />
          </Link>
        </Link>
        <Link
          to="/trasy"
          onClick={() => {
            setOpen(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:text-2xl p-4 flex  justify-between hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.125rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
        >
          <div className="flex gap-[1.5rem] items-center">
            <Route
              color="#303c6c"
              className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
            />
            <p> Trasy </p>
          </div>
          <Link
            to="/formularzTrasy"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <CirclePlus
              color="#303c6c"
              className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
            />
          </Link>
        </Link>
      </div>
    </div>
  );
}
