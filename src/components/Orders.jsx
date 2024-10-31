import useSWR from 'swr';
import fetcher from '../helpers/fetcher';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Trash2, CalendarDays, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confirm from './Confirm';
// coral: '#f28a72',
// slate: '#6b7a8f',

export default function Orders() {
  const { data, isLoading } = useSWR('/orders/get', fetcher);
  const [orders, setOrders] = useState([]);
  const [removingOrder, setRemovingOrder] = useState(null);
  useEffect(() => {
    if (data) {
      const sortedOrders = data.sort((a, b) => b.orderNumber - a.orderNumber);
      setOrders(sortedOrders);
    }
  }, [data]);

  async function removeOrder(id) {
    try {
      await fetcher(`/orders/remove/${id}`, 'POST');

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  if (isLoading) return <div> Loading... </div>;
  return (
    <div className="relative flex flex-col gap-4 p-8 tablet:grid  pb-[4rem] tablet:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] tablet:justify-items-center">
      {removingOrder ? (
        <Confirm
          action={'Usuń zamówienie'}
          description={
            'Czy na pewno chcesz usunąć zamówienie? Ta czynność jest nieodwracalna.'
          }
          cancel={() => {
            setRemovingOrder(null);
          }}
          confirm={() => {
            removeOrder(removingOrder);
          }}
        />
      ) : null}
      {orders.map(({ _id, address, phone, orderNumber, date, time }) => (
        <Link
          to={`/zamówienie/${_id}`}
          key={_id}
          className="relative w-full h-fit bg-white rounded-lg shadow-xl flex flex-col gap-4 items-start p-4 tablet:max-w-[400px] tablet:h-full"
        >
          <p className="self-center text-xl">
            {' '}
            Zamówienie numer {orderNumber}{' '}
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <MapPin color="#f28a72" />
              <p>{address} </p>
            </div>
            <div className="flex gap-2 items-center">
              <Phone color="#f28a72" />
              <p>{phone} </p>
            </div>
            <div className="flex gap-2 items-center">
              <CalendarDays color="#f28a72" />
              <p> {date} </p>
            </div>
            <div className="flex gap-2 items-center">
              <Clock color="#f28a72" />
              <p> {time} </p>
            </div>
          </div>
          <div
            className="bg-[#E74D4D] rounded-full p-2 self-end absolute right-[0.5rem] bottom-[0.5rem]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setRemovingOrder(_id);
            }}
          >
            <Trash2 color="white" width={'20px'} height={'auto'} />
          </div>
        </Link>
      ))}
    </div>
  );
}
