import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell flex w-full flex-col bg-[#fbe8a6]">
      <Navbar open={menuOpen} onOpenChange={setMenuOpen} />
      <main className={`app-content flex-1 min-h-0 ${menuOpen ? "overflow-hidden" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
