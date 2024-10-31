import { useContext } from 'react';
import { AlertContext } from '../misc/AlertContext';
import Alert from './Alert.jsx';
export default function Alerts() {
  const { alerts, removeAlert } = useContext(AlertContext);

  return (
    <div className="alerts fixed top-0 left-0 w-full h-fit flex flex-col p-1 gap-2 z-[99999999]">
      {alerts.map(({ type, message, id }) => {
        return (
          <Alert
            key={id}
            type={type}
            message={message}
            id={id}
            handleClick={() => {
              removeAlert(id);
            }}
          />
        );
      })}
    </div>
  );
}
