import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth

const Navbar = () => {
    const { currentUser, logout } = useAuth(); // Usa el hook useAuth para acceder a la autenticación
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole'); // Obtén el rol del usuario desde el localStorage
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('userRole'); // Elimina el rol del usuario del localStorage
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <>
            <nav className='font-comfortaa flex justify-around items-center bg-white px-10 md:px-0 py-2 shadow-md'>
                <div className='mx-auto md:mx-0 '>
                    <img src={logo} alt='logo' className='h-16'></img>
                </div>

                <button className="md:hidden text-2xl"
                    onClick={() => setOpen(!open)}>
                    ☰
                </button>

                <ul className="hidden md:flex text-sm sm:text-lg  w-2/3 sm:w-1/3 h-full justify-between">
                    <li className="flex-1 flex items-center justify-center text-center hover:font-bold">
                        <Link to="/" className="w-full h-full flex items-center justify-center">
                            Inicio
                        </Link>
                    </li>
                    {currentUser && userRole === "admin" && (
                        <li className="flex-1 flex items-center justify-center text-center hover:font-bold">
                            <Link to="/admin" className="w-full h-full flex items-center justify-center">
                                Dashboard
                            </Link>
                        </li>
                    )}
                    <li className="flex-1 flex items-center justify-center text-center hover:font-bold">
                        <Link to="/Cart" className="w-full h-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </Link>
                    </li>
                    {currentUser ? (
                        <>
                            <li className="flex-1 flex items-center justify-center text-center hover:font-bold">
                                <Link to="/perfil" className="w-full h-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUser} />
                                </Link>
                            </li>
                            <li className="flex-1 flex items-center justify-center text-center hover:font-bold">
                                <button
                                    onClick={handleLogout}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    Salir
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="flex-1 flex items-center justify-center text-center hover:font-bold">
                            <Link to="/Login" className="w-full h-full flex items-center justify-center">
                                Iniciar sesión
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            <ul className={`font-comfortaa md:hidden overflow-hidden transition-all duration-300 flex flex-col px-10 py-2 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <li className="p-2 border-b w-full text-right">
                    <Link to="/" onClick={() => setOpen(false)}>
                        Inicio
                    </Link>
                </li>
                {currentUser && userRole === "admin" && (
                    <li className="p-2 border-b w-full text-right">
                        <Link to="/admin" onClick={() => setOpen(false)}>
                            Dashboard
                        </Link>
                    </li>
                )}
                <li className="p-2 border-b w-full text-right">
                    <Link to="/Cart" onClick={() => setOpen(false)}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </Link>
                </li>
                {currentUser ? (
                    <>
                        <li className="p-2 border-b w-full text-right">
                            <Link to="/perfil" onClick={() => setOpen(false)}>
                                <FontAwesomeIcon icon={faUser} />
                            </Link>
                        </li>
                        <li className="p-2 border-b w-full text-right">
                            <button
                                onClick={() => {handleLogout(); setOpen(false);}}
                            
                            >
                                Salir
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="p-2 border-b w-full text-right">
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
