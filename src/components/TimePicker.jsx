/* eslint-disable react/prop-types */
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pl";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
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
    MuiTimePickerToolbar: {
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

export default function TimePicker({ time, handleTimeChange }) {
  return (
    <div className="relative flex flex-col gap-1 before:absolute before:content-[''] before:w-full before:h-[2px] before:bg-[#CCCCCC] before:-bottom-4">
      <label htmlFor="date"> Godzina: </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileTimePicker
            value={time}
            onChange={handleTimeChange}
            ampm={false}
            localeText={{
              toolbarTitle: "Wybierz godzinę",
              cancelButtonLabel: "Anuluj",
              okButtonLabel: "OK",
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}
