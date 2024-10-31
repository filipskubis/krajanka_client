/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { CirclePlus, ClipboardList, CircleMinus } from 'lucide-react';
import PhoneNumberInput from './PhoneNumberInput';
import fetcher from '../helpers/fetcher';
import useSWR from 'swr';
import ClientsModal from './ClientsModal';
import ProductModal from './ProductModal';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import 'dayjs/locale/pl';
import dayjs from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Big from 'big.js';
import { AlertContext } from '../misc/AlertContext';

Big.DP = 2;
Big.RM = Big.roundHalfUp;

function convertToDateAndTimeObjects(dateStr, timeStr) {
  // Parse the date part
  const dateObject = dayjs(dateStr, 'DD-MM-YYYY');

  // Parse the time part
  const [hours, minutes] = timeStr.split(':');
  const timeObject = dayjs()
    .hour(parseInt(hours, 10))
    .minute(parseInt(minutes, 10))
    .second(0)
    .millisecond(0);

  return { dateObject, timeObject };
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#f28a72',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiDatePickerToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f28a72',
        },
      },
    },
    MuiTimePickerToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f28a72',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: '#f28a72',
        },
      },
    },
  },
});

export default function EditForm({ order, close }) {
  const { data } = useSWR('/products/get', fetcher);
  const [products, setProducts] = useState(order.products);
  const [productModal, setProductModal] = useState(false);
  const [clientModal, setClientModal] = useState(false);

  const [address, setAddress] = useState(order.address);
  const [phone, setPhone] = useState(order.phone);
  const [orderNumber, setOrderNumber] = useState(order.orderNumber);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (order) {
      const { dateObject, timeObject } = convertToDateAndTimeObjects(
        order.date,
        order.time
      );
      setDate(dateObject);
      setTime(timeObject);
    }
  }, [order]);

  const { addAlert } = useContext(AlertContext);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    const productsNoTotal = products.map(({ total, ...rest }) => rest);
    if (!(date && time)) {
      return console.log('Please select both date and time.');
    }
    const formattedDate = date.format('DD-MM-YYYY');
    const formattedTime = time.format('HH:mm');
    const body = {
      address,
      phone,
      products: productsNoTotal,
      orderNumber,
      date: formattedDate,
      time: formattedTime,
      originalOrderNumber: order.orderNumber,
    };
    try {
      const response = await fetcher(`/orders/edit/${order._id}`, 'PUT', body);
      resetForm();
      close();
      addAlert('success', response);
    } catch (err) {
      addAlert('error', err);
    }
  }

  function handleAdd(id) {
    const newProducts = products.map((product) => {
      if (product?.id === id) {
        product.quantity++;
      }
      return product;
    });
    setProducts(newProducts);
  }
  function removeProduct(id) {
    const newProducts = products.filter((product) => product?.id !== id);
    setProducts(newProducts);
  }
  function handleSubtract(id) {
    const productToSubtract = products.find((product) => product.id === id);

    if (!productToSubtract) return;

    if (productToSubtract.quantity - 1 <= 0) {
      removeProduct(id);
    } else {
      const newProducts = products.map((product) => {
        if (product.id === id) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProducts(newProducts);
    }
  }

  function resetForm() {
    setProducts([]);
    setAddress('');
    setPhone('');
    setOrderNumber('');
    setDate(null);
    setTime(null);
  }

  function handleClientChoice(address, phone) {
    setAddress(address);
    setPhone(phone);
  }
  function handleAddProduct(e) {
    e.preventDefault();
    e.stopPropagation();

    const name = e.target.querySelector('#productSelect').value;
    const quantity = e.target.querySelector('#quantity').value;
    const product = data.find((product) => product.name === name);
    const uniqueId = crypto.randomUUID();
    const productObject = {
      id: uniqueId,
      name,
      quantity: quantity,
      price: product.price,
      packagingMethod: product.packagingMethod,
    };
    setProducts([...products, productObject]);
    setProductModal(false);
  }
  console.log(products);
  return (
    <>
      {clientModal ? (
        <ClientsModal
          setClientModal={setClientModal}
          handleClientChoice={handleClientChoice}
        />
      ) : null}
      {productModal ? (
        <ProductModal
          data={data}
          setProductModal={setProductModal}
          handleAddProduct={handleAddProduct}
        />
      ) : null}
      <form
        className="w-full h-fit bg-white p-4 rounded-lg flex flex-col gap-8 pb-12"
        onSubmit={handleFormSubmit}
      >
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="order-number"> Nr zamówienia:</label>
          <input
            id="order-number"
            type="number"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value);
            }}
            required
            className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC] w-[100px]"
          />
        </div>
        <div className="relative flex flex-col gap-2 w-full before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <p> Produkty: </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setProductModal(true);
            }}
            className="flex ml-1 gap-2 items-center"
          >
            <CirclePlus color="#f28a72" />
            <p className="text-coral"> Dodaj Produkt</p>
          </button>
          {products.length > 0 ? (
            <p className="gap-4 p-1 grid grid-cols-5">
              <p className="col-start-1 col-end-3"> Nazwa: </p>
              <p className="col-start-3 col-end-4"> Cena: </p>
              <p className="col-start-4 col-end-5"> Ilość: </p>
            </p>
          ) : null}

          {products.map(({ id, name, price, quantity, packagingMethod }) => (
            <div
              key={id}
              className="relative border-[1px] rounded-md p-1 gap-4 grid grid-cols-5 content-center"
            >
              <p className="col-start-1 col-end-3"> {name} </p>
              <p className="col-start-3 col-end-4"> {price} zł</p>
              <p className="col-start-4 col-end-5">
                {' '}
                {quantity} ({packagingMethod})
              </p>
              <div className="absolute flex gap-2 right-2 h-full items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAdd(id);
                  }}
                >
                  <CirclePlus />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubtract(id);
                  }}
                >
                  <CircleMinus />
                </button>
              </div>
            </div>
          ))}
          {products.length > 0 ? (
            <div className="gap-4 p-1 flex w-full justify-end">
              <p className="border-[1px] p-1 rounded-md flex gap-2">
                <p> Suma: </p>
                <p>
                  {products.reduce(
                    (acc, product) =>
                      acc + Number(Big(product.quantity).times(product.price)),
                    0
                  )}{' '}
                  zł
                </p>
              </p>
            </div>
          ) : null}
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="address"> Adres: </label>
          <div
            className="flex ml-1 mb-2 gap-2 items-center"
            onClick={(e) => {
              e.stopPropagation();
              setClientModal(true);
            }}
          >
            <ClipboardList color="#f28a72" />
            <p className="text-coral"> Wybierz z listy</p>
          </div>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            required
            className="p-1 rounded-lg focus:outline-none border-[1px] border-[#CCCCCC]"
          />
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <PhoneNumberInput
            value={phone}
            change={(value) => {
              setPhone(value);
            }}
          />
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="date"> Data: </label>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
              <MobileDatePicker
                value={date}
                onChange={handleDateChange}
                localeText={{
                  cancelButtonLabel: 'Anuluj',
                  okButtonLabel: 'OK',
                  clearButtonLabel: 'Wyczyść',
                  toolbarTitle: 'Wybierz datę',
                  previousMonth: 'Poprzedni miesiąc',
                  nextMonth: 'Następny miesiąc',
                }}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </div>
        <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
          <label htmlFor="date"> Godzina: </label>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                value={time}
                onChange={handleTimeChange}
                ampm={false}
                localeText={{
                  toolbarTitle: 'Wybierz godzinę',
                  cancelButtonLabel: 'Anuluj',
                  okButtonLabel: 'OK',
                }}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </div>
        <button
          className="text-xl bg-coral p-4 shadow-md rounded-lg w-fit self-center mt-[2rem]"
          onSubmit={handleFormSubmit}
        >
          Zatwierdź
        </button>
      </form>
    </>
  );
}
