import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "app/context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth(); // Usa el hook useAuth para acceder a la autenticación
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole"); // Obtén el rol del usuario desde el localStorage
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("userRole"); // Elimina el rol del usuario del localStorage
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <nav className="flex items-center justify-around bg-white px-10 py-2 font-comfortaa shadow-md md:px-0">
        <div className="mx-auto md:mx-0 ">
          <img src={logo} alt="logo" className="h-16"></img>
        </div>

        <button className="text-2xl md:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <ul className="hidden h-full w-2/3 justify-between  text-sm sm:w-1/3 sm:text-lg md:flex">
          <li className="flex flex-1 items-center justify-center text-center hover:font-bold">
            <Link
              to="/"
              className="flex h-full w-full items-center justify-center"
            >
              Inicio
            </Link>
          </li>
          {currentUser && userRole === "admin" && (
            <li className="flex flex-1 items-center justify-center text-center hover:font-bold">
              <Link
                to="/admin"
                className="flex h-full w-full items-center justify-center"
              >
                Dashboard
              </Link>
            </li>
          )}
          <li className="flex flex-1 items-center justify-center text-center hover:font-bold">
            <Link
              to="/Cart"
              className="flex h-full w-full items-center justify-center"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
          </li>
          {currentUser ? (
            <>
              <li className="flex flex-1 items-center justify-center text-center hover:font-bold">
                <Link
                  to="/profile"
                  className="flex h-full w-full items-center justify-center"
                >
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              </li>
              <li className="flex flex-1 items-center justify-center text-center hover:font-bold">
                <button
                  onClick={handleLogout}
                  className="flex h-full w-full items-center justify-center"
                >
                  Salir
                </button>
              </li>
            </>
          ) : (
            <li className="flex flex-1 items-center justify-center text-center hover:font-bold">
              <Link
                to="/Login"
                className="flex h-full w-full items-center justify-center"
              >
                Iniciar sesión
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <ul
        className={`flex flex-col overflow-hidden px-10 py-2 font-comfortaa transition-all duration-300 md:hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <li className="w-full border-b p-2 text-right">
          <Link to="/" onClick={() => setOpen(false)}>
            Inicio
          </Link>
        </li>
        {currentUser && userRole === "admin" && (
          <li className="w-full border-b p-2 text-right">
            <Link to="/admin" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          </li>
        )}
        <li className="w-full border-b p-2 text-right">
          <Link to="/Cart" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
        </li>
        {currentUser ? (
          <>
            <li className="w-full border-b p-2 text-right">
              <Link to="/profile" onClick={() => setOpen(false)}>
                <FontAwesomeIcon icon={faUser} />
              </Link>
            </li>
            <li className="w-full border-b p-2 text-right">
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <li className="w-full border-b p-2 text-right">
            <Link to="/Login" onClick={() => setOpen(false)}>
              Iniciar sesión
            </Link>
          </li>
        )}
      </ul>
    </>
  );
};

export default Navbar;
