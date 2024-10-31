import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../helpers/fetcher';
import { MapPin, Phone, CalendarDays, Clock } from 'lucide-react';
import { useState } from 'react';
import Confirm from './Confirm';
import { useNavigate } from 'react-router-dom';
import Big from 'big.js';
import EditForm from './EditForm';
Big.DP = 2;
Big.RM = Big.roundHalfUp;

export default function OrderDetails() {
  const { id } = useParams();
  const { data, isLoading } = useSWR(`/orders/get/${id}`, fetcher);
  const [editing, setEditing] = useState(false);
  const [confirmWindow, setConfirmWindow] = useState(false);
  const navigate = useNavigate();
  if (isLoading) {
    return <div> Loading... </div>;
  }

  async function removeOrder() {
    try {
      const response = await fetcher(`/orders/remove/${id}`, 'POST');
      if (response.ok) {
        navigate('/zamówienia');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (editing && data) {
    return (
      <EditForm
        order={data}
        close={() => {
          setEditing(false);
        }}
      />
    );
  }
  return (
    <div className="relative w-full h-fit p-4 ">
      {confirmWindow ? (
        <Confirm
          action={'Usuń zamówienie'}
          description={
            'Czy na pewno chcesz usunąć zamówienie? Ta czynność nie może być cofnięta.'
          }
          cancel={() => {
            setConfirmWindow(false);
          }}
          confirm={() => {
            removeOrder();
          }}
        />
      ) : null}
      <div className="bg-white h-full w-full rounded-xl shadow-2xl flex flex-col items-start p-4 gap-6 pb-8">
        <p className="text-2xl text-slate self-center tablet:text-3xl">
          {' '}
          Zamówienie numer: {data.orderNumber}
        </p>
        <div className="flex flex-col gap-3 w-full text-lg tablet:text-xl">
          <div className="flex gap-2 items-center">
            <MapPin
              color="#f28a72"
              width={'30px'}
              height={'auto'}
              className="tablet:w-[2rem]"
            />
            <p>{data.address} </p>
          </div>
          <div className="flex gap-2 items-center">
            <Phone
              color="#f28a72"
              width={'30px'}
              height={'auto'}
              className="tablet:w-[2rem]"
            />
            <p>{data.phone} </p>
          </div>
          <div className="flex gap-2 items-center">
            <CalendarDays
              color="#f28a72"
              width={'30px'}
              height={'auto'}
              className="tablet:w-[2rem]"
            />
            <p> {data.date} </p>
          </div>
          <div className="flex gap-2 items-center">
            <Clock
              color="#f28a72"
              width={'30px'}
              height={'auto'}
              className="tablet:w-[2rem]"
            />
            <p> {data.time} </p>
          </div>
          {data.products.length > 0 ? (
            <p className="gap-4 p-1 grid grid-cols-5 w-full">
              <p className="col-start-1 col-end-3"> Nazwa: </p>
              <p className="col-start-3 col-end-4"> Cena: </p>
              <p className="col-start-4 col-end-5"> Ilość: </p>
            </p>
          ) : null}

          {data.products.map(
            ({ name, price, quantity, packagingMethod }, index) => (
              <div
                key={index}
                className="border-[2px] border-slate rounded-md p-1 gap-4 grid grid-cols-5 content-center"
              >
                <p className="col-start-1 col-end-3"> {name} </p>
                <p className="col-start-3 col-end-4"> {price} zł</p>
                <p className="col-start-4 col-end-6">
                  {' '}
                  {quantity} ({packagingMethod})
                </p>
              </div>
            )
          )}
          {data.products.length > 0 ? (
            <div className="gap-4 p-1 flex w-full justify-end">
              <p className="border-[2px] border-slate p-1 rounded-md flex gap-2 ">
                <p> Suma: </p>
                <p>
                  {data.products.reduce(
                    (acc, product) =>
                      acc + Number(Big(product.quantity).times(product.price)),
                    0
                  )}{' '}
                  zł
                </p>
              </p>
            </div>
          ) : null}
          <div className="mt-4 flex gap-4 dontPrint text-lg tablet:text-xl">
            <button
              className="bg-slate rounded-2xl flex-grow p-3 flex justify-center items-center"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setEditing(true);
              }}
            >
              <p className="text-white">Edytuj</p>
            </button>
            <button
              className="bg-[#E74D4D] rounded-2xl flex-grow p-3 flex justify-center items-center"
              onClick={() => {
                setConfirmWindow(true);
              }}
            >
              <p className="text-white">Usuń</p>
            </button>
          </div>
          <button
            className="bg-slate rounded-2xl flex-grow p-3 flex justify-center items-center dontPrint"
            onClick={handlePrint}
          >
            <p className="text-white text-lg tablet:text-xl">Drukuj</p>
          </button>
        </div>
      </div>
    </div>
  );
}
