import { useContext, useState } from "react";
import { useAuth } from "../misc/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import fetcher from "../helpers/fetcher";
import { AlertContext } from "../misc/AlertContext.jsx";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const { addAlert } = useContext(AlertContext);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await fetcher("/auth/login", "POST", { password });

      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      addAlert("error", "Hasło jest błędne");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full h-screen flex flex-col gap-4 justify-center items-center"
    >
      <input
        type="password"
        placeholder="Hasło"
        className="border-2 border-[#D3D3D3] rounded-lg p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="loginBtn" type="submit">
        Zaloguj się
      </button>
    </form>
  );
}
