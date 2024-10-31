import { useEffect, useState } from 'react';
import { CircleUserRound, CirclePlus, X, Trash2 } from 'lucide-react';
import PhoneNumberInput from './PhoneNumberInput';
import useSWR from 'swr';
import fetcher from '../helpers/fetcher';
import Confirm from './Confirm';
export default function Clients() {
  const { data } = useSWR('/clients/get', fetcher);
  const [clients, setClients] = useState([]);
  const [formActive, setFormActive] = useState(false);
  const [phone, setPhone] = useState('');
  const [isBeingDeleted, setIsBeingDeleted] = useState(null);
  async function removeClient(client) {
    try {
      await fetcher(`/clients/delete/${client._id}`, 'POST');
    } catch (err) {
      return;
    }

    const newClients = clients.filter(
      (currentClient) => currentClient.address != client.address
    );
    setClients(newClients);
  }
  useEffect(() => {
    if (data != undefined) {
      setClients(data);
    }
  }, [data]);
  async function handleSubmit(e) {
    e.preventDefault();
    const address = document.querySelector('#address').value;
    const phone = document.querySelector('#phone').value;
    let id;
    try {
      const result = await fetcher('/clients/add', 'POST', {
        address,
        phone,
      });
      id = result._id;
    } catch (err) {
      return err;
    }

    const newClients = [{ address, phone, _id: id }, ...clients];

    setClients(newClients);
    setFormActive(false);
    setPhone('');
  }
  return (
    <div className="flex flex-col gap-4 p-6 tablet:!text-lg">
      {isBeingDeleted ? (
        <Confirm
          action={'Usuń stałego klienta'}
          description={
            'Czy na pewno chcesz usunąć tego klienta? Ta czynność jest nieodwracalna.'
          }
          cancel={() => {
            setIsBeingDeleted(null);
          }}
          confirm={() => {
            removeClient(isBeingDeleted);
            setIsBeingDeleted(null);
          }}
        />
      ) : null}
      <form
        className="self-center mb-4 w-full flex justify-center"
        onSubmit={handleSubmit}
      >
        {formActive ? (
          <div className="w-full  flex justify-center fadeIn">
            <div className="relative w-[80%] flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg">
              <button
                className="absolute top-[0.5rem] right-[0.5rem]"
                onClick={() => {
                  setFormActive(false);
                }}
              >
                <X color="#00000070" width={'1.5rem'} height={'100%'} />
              </button>
              <div className="flex flex-col gap-1">
                <label htmlFor="address"> Adres: </label>
                <input
                  type="text"
                  required
                  id="address"
                  className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC]"
                />
              </div>
              <PhoneNumberInput value={phone} change={setPhone} />
              <button className="border-[1px] rounded-full bg-[#00000020] p-2 active:scale-[101%]">
                {' '}
                Dodaj{' '}
              </button>
            </div>
          </div>
        ) : (
          <button
            className="flex w-full items-center justify-center gap-4 bg-coral p-3 shadow-md rounded-full"
            onClick={() => {
              setFormActive(true);
            }}
          >
            <CirclePlus color="#303c6c" width={'2rem'} height={'100%'} />
            <p className="text-xl tablet:text-2xl">Dodaj stałego klienta</p>
          </button>
        )}
      </form>
      <div className="flex flex-col gap-4 tablet:grid tablet:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] tablet:justify-items-center">
        {clients.map((client) => (
          <div
            key={client._id}
            className="relative rounded-lg bg-white justify-start p-4 flex items-center gap-4 tablet:w-full tablet:max-w-[350px]"
          >
            <CircleUserRound color="#f4976c" width={'2rem'} height={'100%'} />
            <p className="relative w-[70%]">
              <p>{client.address}</p>
              <p>tel: {client.phone}</p>
            </p>
            <div className="flex items-center h-full right-[0.7rem] absolute">
              <div
                className="bg-[#E74D4D] rounded-full p-2"
                onClick={() => {
                  setIsBeingDeleted(client);
                }}
              >
                <Trash2 color="white" width={'18px'} height={'auto'} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
