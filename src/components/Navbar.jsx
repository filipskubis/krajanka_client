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
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function Navbar({ open, onOpenChange }) {

  return (
    <header className="dontPrint relative flex h-[3.5rem] w-full shrink-0 items-center justify-start border-b-[1px] border-[#303c6c50] p-4">
      <button
        onClick={() => {
          onOpenChange(true);
        }}
      >
        <AlignJustify color="#303c6c" width="2rem" height="2rem" />
      </button>
      {open && (
        <button
          aria-label="Zamknij menu"
          className="app-drawer absolute left-0 top-0 z-[99999999999998] w-screen cursor-default bg-black/10"
          onClick={() => onOpenChange(false)}
        />
      )}
      <nav
        aria-hidden={!open}
        className={`app-drawer absolute left-0 top-0 z-[99999999999999] flex w-[20rem] flex-col items-start gap-[2.5rem] overflow-y-auto bg-[#f9f9f9] pl-4 pr-4 pt-[max(4rem,calc(env(safe-area-inset-top)+3rem))] pb-[max(1rem,env(safe-area-inset-bottom))] transition-transform duration-200 tablet:w-[24rem] ${
          open ? "translate-x-[0]" : "translate-x-[-100%]"
        }`}
      >
        <button
          className="absolute top-[1rem] left-[1rem] "
          onClick={() => {
            onOpenChange(false);
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
            onOpenChange(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:mt-[0.25rem] tablet:text-2xl p-4 flex gap-[1.5rem] hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.15rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
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
            onOpenChange(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:text-2xl p-4 flex gap-[1.5rem] hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.15rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
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
            onOpenChange(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:text-2xl p-4 flex gap-[1.5rem] hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.15rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
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
            onOpenChange(false);
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
              onOpenChange(false);
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
            onOpenChange(false);
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
              onOpenChange(false);
            }}
          >
            <CirclePlus
              color="#303c6c"
              className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
            />
          </Link>
        </Link>
        <Link
          to="/formularze"
          onClick={() => {
            onOpenChange(false);
          }}
          className='relative w-[16rem] tablet:w-[20rem] tablet:text-2xl p-4 flex  justify-between hover:bg-[#303c6c10] rounded-t-xl items-center text-xl before:absolute before:content-[""] before:h-[0.125rem] before:left-0 before:w-full before:bottom-0 before:bg-slate'
        >
          <div className="flex gap-[1.5rem] items-center">
            <Star
              color="#303c6c"
              className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
            />
            <p> Formularze </p>
          </div>
          <Link
            to="/kreatorFormularzy"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
          >
            <CirclePlus
              color="#303c6c"
              className="w-[2rem] h-[2rem] tablet:w-[3rem] tablet:h-[2.5rem]"
            />
          </Link>
        </Link>
      </nav>
    </header>
  );
}
