/* eslint-disable react/prop-types */
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import "dayjs/locale/pl";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#f28a72",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiDatePickerToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#f28a72",
        },
      },
    },

    MuiButtonBase: {
      styleOverrides: {
        root: {
          color: "#f28a72",
        },
      },
    },
  },
});

export default function DatePicker({ date, handleDateChange }) {
  return (
    <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
      <label htmlFor="date"> Data: </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
          <MobileDatePicker
            value={date}
            onChange={handleDateChange}
            localeText={{
              cancelButtonLabel: "Anuluj",
              okButtonLabel: "OK",
              clearButtonLabel: "Wyczyść",
              toolbarTitle: "Wybierz datę",
              previousMonth: "Poprzedni miesiąc",
              nextMonth: "Następny miesiąc",
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}
